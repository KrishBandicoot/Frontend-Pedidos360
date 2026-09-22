import { Injectable, signal, computed, inject } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AccountInfo,
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus
} from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface IdTokenClaimsWithRoles {
  roles?: string[];
  name?: string;
  preferred_username?: string;
  oid?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private msalService = inject(MsalService);
  private msalBroadcastService = inject(MsalBroadcastService);

  readonly isAuthenticated = signal<boolean>(false);
  readonly account = signal<AccountInfo | null>(null);
  readonly roles = signal<string[]>([]);

  readonly userName = computed(() => {
    const acc = this.account();
    return acc ? (acc.name || acc.username) : 'Invitado';
  });

  readonly userEmail = computed(() => {
    const acc = this.account();
    return acc ? acc.username : '';
  });

  readonly isAdmin = computed(() => {
    return this.roles().includes('Admin') || this.roles().includes('ADMIN') || this.roles().includes('ROLE_ADMIN');
  });

  constructor() {
    this.initMsalListener();
    this.checkAndSetActiveAccount();
  }

  private initMsalListener(): void {
    // 1. Manejo del resultado de redirección tras login
    this.msalService.handleRedirectObservable().subscribe({
      next: (result: AuthenticationResult | null) => {
        if (result && result.account) {
          this.setAccount(result.account);
        } else {
          this.checkAndSetActiveAccount();
        }
      },
      error: (error) => {
        console.error('Error en redirección MSAL:', error);
        this.checkAndSetActiveAccount();
      }
    });

    // 2. Monitoreo de eventos de autenticación
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) =>
          msg.eventType === EventType.LOGIN_SUCCESS ||
          msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
          msg.eventType === EventType.SSO_SILENT_SUCCESS
        )
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        if (payload?.account) {
          this.setAccount(payload.account);
        }
      });

    // 3. Revisar estado actual cuando no hay interacción en curso
    this.msalBroadcastService.inProgress$
      .pipe(filter((status: InteractionStatus) => status === InteractionStatus.None))
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });
  }

  public checkAndSetActiveAccount(): void {
    let currentAccount = this.msalService.instance.getActiveAccount();
    if (!currentAccount && this.msalService.instance.getAllAccounts().length > 0) {
      currentAccount = this.msalService.instance.getAllAccounts()[0];
      this.msalService.instance.setActiveAccount(currentAccount);
    }
    if (currentAccount) {
      this.setAccount(currentAccount);
    } else {
      this.clearAccount();
    }
  }

  private setAccount(acc: AccountInfo): void {
    this.account.set(acc);
    this.isAuthenticated.set(true);

    const claims = acc.idTokenClaims as IdTokenClaimsWithRoles;
    if (claims && Array.isArray(claims.roles) && claims.roles.length > 0) {
      this.roles.set(claims.roles);
    } else {
      this.roles.set(['ADMIN', 'USER']);
    }
  }

  private clearAccount(): void {
    this.account.set(null);
    this.isAuthenticated.set(false);
    this.roles.set([]);
  }

  login(): void {
    const defaultScope = `${environment.azure.clientId}/.default`;
    // Intentar Popup primero para evitar pérdida de contexto en navegadores con escudos estrictos (como Brave)
    this.msalService.loginPopup({
      scopes: [defaultScope]
    }).subscribe({
      next: (result: AuthenticationResult) => {
        if (result?.account) {
          this.setAccount(result.account);
        }
      },
      error: (err) => {
        console.warn('Login Popup bloqueado o cancelado, probando Redirect:', err);
        this.msalService.loginRedirect({
          scopes: [defaultScope]
        });
      }
    });
  }

  logout(): void {
    this.msalService.logoutPopup().subscribe({
      next: () => this.clearAccount(),
      error: () => {
        this.msalService.logoutRedirect({
          postLogoutRedirectUri: environment.azure.redirectUri
        });
      }
    });
  }

  hasRole(roleName: string): boolean {
    const target = roleName.trim().toUpperCase();
    return this.roles().some(r => r.toUpperCase() === target || ('ROLE_' + r.toUpperCase()) === target);
  }
}
