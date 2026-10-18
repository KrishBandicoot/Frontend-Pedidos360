# Pedidos360 — Guía de inicio rápido

Esta guía explica cómo levantar el proyecto conectando el frontend local con la infraestructura de producción en AWS.

## 1. Iniciar el entorno en AWS

1. Accede a la cuenta de AWS.
2. Enciende el laboratorio.

Al hacerlo, la instancia EC2 y el API Gateway se activarán automáticamente.

> **Nota de red:** El servidor tiene asignada una Elastic IP permanente (`18.235.232.179`), por lo que no es necesario reconfigurar las rutas de la puerta de enlace en cada inicio.

## 2. Clonar los repositorios

En tu computador local, abre una terminal de PowerShell y clona ambos repositorios en tu espacio de trabajo:

- [Backend-Pedidos360](https://github.com/KrishBandicoot/Backend-Pedidos360)
- [Frontend-Pedidos360](https://github.com/KrishBandicoot/Frontend-Pedidos360)

Por ejemplo:

```powershell
git clone https://github.com/KrishBandicoot/Backend-Pedidos360.git
git clone https://github.com/KrishBandicoot/Frontend-Pedidos360.git
```

## 3. Conectarse al servidor EC2

Abre PowerShell y utiliza tu llave de seguridad `.pem` para conectarte al servidor Ubuntu. Ajusta la ruta de la llave según su ubicación en tu computador:

```powershell
ssh -i "C:\Users\KrishBandicoot\Downloads\Cloud 2\Codigo Evaluacion\llave-pedidos.pem" ubuntu@18.235.232.179
```

**Verificación:** La consola cambiará al entorno Linux y mostrará un prompt similar a `ubuntu@ip-172-31-...`.

> Si la llave `.pem` está guardada en otra carpeta, reemplaza la ruta del comando por la ruta correcta.

## 4. Levantar la infraestructura (Docker y Spring Boot)

Una vez conectado al servidor EC2, inicia el clúster de RabbitMQ y luego ejecuta el microservicio Java en segundo plano para que continúe funcionando aunque cierres la sesión:

```bash
docker compose up -d
nohup java -jar microservicio-pedidos-1.0.0.jar > logs-backend.txt 2>&1 &
```

**Verificación:** Revisa los registros del backend con:

```bash
tail -f logs-backend.txt
```

Espera a que aparezca el mensaje `Started MicroservicioPedidosApplication`. Después, presiona `Ctrl + C` para salir de los registros.

## 5. Iniciar el frontend localmente

Abre una **nueva ventana de PowerShell en tu computador**. No utilices la terminal conectada al servidor EC2.

Navega hasta la carpeta donde clonaste el frontend de Angular y ejecuta:

```powershell
cd ruta\hacia\Frontend-Pedidos360
ng serve
```

Reemplaza `ruta\hacia\Frontend-Pedidos360` por la ruta real de la carpeta en tu computador.

**Verificación:** La terminal debería mostrar `Compiled successfully` y confirmar que el servidor de desarrollo está funcionando.

> Si el comando `ng` no se reconoce, comprueba que Node.js y Angular CLI estén instalados. Si el proyecto todavía no tiene sus dependencias instaladas, entra a su carpeta y ejecuta `npm install` antes de `ng serve`.

## 6. Acceder a la plataforma

Abre tu navegador y visita:

**http://localhost:4200**

La interfaz de Angular se ejecutará localmente y se comunicará con los servicios configurados para el proyecto, incluida la infraestructura de AWS y Supabase.

## Resumen de terminales

| Terminal | Dónde se ejecuta | Comandos principales |
|---|---|---|
| 1 | PowerShell local | Clonar repositorios y conectarse por SSH |
| 2 | Servidor EC2 (Linux) | `docker compose up -d` y ejecutar el JAR de Spring Boot |
| 3 | PowerShell local | `ng serve` dentro de la carpeta del frontend |

## Requisitos y notas

- Tener acceso a la cuenta/laboratorio de AWS.
- Tener la llave privada `llave-pedidos.pem` y permiso para conectarse a la instancia EC2.
- Tener Git instalado para clonar los repositorios.
- Tener Node.js, npm y Angular CLI disponibles para ejecutar el frontend.
- Confirmar que los nombres y las rutas de los archivos en EC2 coincidan con los comandos de esta guía.
- No compartas ni subas la llave privada `.pem` al repositorio.
