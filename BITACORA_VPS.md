# Bitácora de Configuración del VPS - Cursos Ecuador

Esta bitácora documenta de forma secuencial y detallada los pasos de instalación, configuración y seguridad del **Servidor de Base de Datos (PostgreSQL)** y del **Servidor de Aplicación (Node.js/Express, PM2, Nginx)** en un entorno de producción sobre **Ubuntu LTS** para la plataforma **Cursos Ecuador**, adaptada para el uso de un **Dominio Personalizado** con **Cifrado SSL (HTTPS)**.

---

## Ficha Técnica del Despliegue
* **Proyecto:** Cursos Ecuador — Plataforma de venta de cursos online y membresías.
* **Sistema Operativo:** Ubuntu 22.04 / 24.04 LTS.
* **Dominio:** `tudominio.com` y `www.tudominio.com` (apuntando al VPS).
* **Certificado SSL:** Let's Encrypt (Cifrado Gratuito y Auto-renovable).
* **Servidor de Base de Datos:** PostgreSQL (Puerto `5432`).
* **Servidor de Aplicación:** Node.js (Express 4) ejecutado bajo PM2 (Puerto `5000`).
* **Servidor Web y Proxy Inverso:** Nginx (Puertos `80` y `443` con redirección automática a HTTPS).
* **Frontend:** React (Vite) precompilado como archivos estáticos.
* **Seguridad:** UFW, Fail2Ban, AppArmor, y SCRAM-SHA-256 para contraseñas de PostgreSQL.

---

## PARTE 1. CONFIGURACIÓN DEL SISTEMA OPERATIVO Y BASE DE DATOS

### Paso 1: Acceso Inicial SSH
Establecer conexión remota segura al servidor VPS provisto con privilegios de administrador.
```bash
ssh root@IP_DEL_VPS
```
* **Propósito:** Entrar al entorno de consola remota para realizar configuraciones iniciales.
* **Resultado Correcto:** Entrada a la consola con la ruta `root@nombre-servidor:~#`.

### Paso 2: Validación del Sistema
Confirmar la arquitectura y la versión de distribución del VPS.
```bash
lsb_release -a
whoami
ip addr
```
* **Resultado Correcto:** `Distributor ID: Ubuntu`, `Description: Ubuntu 22.04 LTS` o `24.04 LTS`.

### Paso 3: Actualización de Repositorios y Sistema
Actualizar la lista de paquetes disponibles en los servidores de Ubuntu e instalar las versiones más recientes de los paquetes del sistema.
```bash
sudo apt update
sudo apt upgrade -y
```

### Paso 4: Configurar Hostname y Zona Horaria de Ecuador
Definir un identificador único al servidor y ajustar el reloj del sistema a la hora oficial de Ecuador continental.
```bash
sudo hostnamectl set-hostname cursos-ecuador-vps
sudo timedatectl set-timezone America/Guayaquil
```
* **Propósito:** Garantizar que los logs del sistema, registros de transacciones y timestamps de base de datos correspondan exactamente a la hora local (-05:00 UTC).
* **Verificación:** `timedatectl` debe retornar `Time zone: America/Guayaquil (ECT, -0500)`.

### Paso 5: Instalar Dependencias del Sistema
Instalar los paquetes base requeridos para clonación, descargas, monitoreo y compilación de dependencias nativas de Node (como `bcrypt`).
```bash
sudo apt install -y git curl wget nano unzip tar htop build-essential fail2ban
```

---

## PARTE 2. SERVIDOR DE BASE DE DATOS (POSTGRESQL)

### Paso 6: Instalar PostgreSQL
Instalar el motor de base de datos PostgreSQL y las extensiones adicionales del ecosistema.
```bash
sudo apt install postgresql postgresql-contrib -y
```
* **Verificación de Servicio:**
  ```bash
  sudo systemctl is-active postgresql
  ```
  Debe retornar `active`.

### Paso 7: Crear Base de Datos, Usuario y Permisos en Postgres
Acceder a la terminal administrativa interactiva de PostgreSQL (`psql`) y crear el esquema inicial de seguridad.
```bash
# Entrar como el superusuario postgres
sudo -i -u postgres psql
```
Ejecutar los siguientes comandos en la consola interactiva `psql`:
```sql
-- 1. Crear la base de datos para la aplicación
CREATE DATABASE cursos_ecuador;

-- 2. Crear usuario dedicado con algoritmo scram-sha-256
CREATE USER cursos_app WITH ENCRYPTED PASSWORD 'contrasena_segura_de_tu_bd';

-- 3. Asignar todos los privilegios sobre la base de datos al usuario cursos_app
GRANT ALL PRIVILEGES ON DATABASE cursos_ecuador TO cursos_app;

-- 4. Salir de la terminal
\q
```
* **Propósito:** Cumplir con el principio de mínimo privilegio. La aplicación nunca debe usar el superusuario `postgres` para operaciones diarias.

### Paso 8: Cargar Esquema y Datos Semilla
Clonar el repositorio y poblar el servidor de base de datos localmente usando el usuario de aplicación creado.
```bash
# Entrar al directorio del proyecto (después de clonar en /var/www)
cd /var/www/cursos-ecuador/database

# 1. Cargar el esquema completo (Tablas, llaves foráneas, índices)
psql -h localhost -U cursos_app -d cursos_ecuador -f schema.sql

# 2. Insertar los datos semilla (Roles, categorías, cursos de prueba, lecciones)
psql -h localhost -U cursos_app -d cursos_ecuador -f seed.sql
```
* **Verificación:**
  ```bash
  psql -h localhost -U cursos_app -d cursos_ecuador -c "SELECT current_database(), current_user, count(*) FROM usuarios;"
  ```
  Debe devolver la base de datos `cursos_ecuador`, el usuario `cursos_app` y un conteo de usuarios mayor a 0 (cargados en la semilla).

---

## PARTE 3. SERVIDOR DE APLICACIÓN Y DOMINIO CON SSL

### Paso 9: Instalar Node.js 20 LTS
Instalar Node.js versión 20 (LTS) desde el repositorio oficial de NodeSource.
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```
* **Verificación:** `node -v` y `npm -v` deben devolver la versión instalada (`v20.x` y `10.x`).

### Paso 10: Configurar el Servidor Backend (Express)
Preparar la aplicación y establecer las variables de entorno de producción.
```bash
cd /var/www/cursos-ecuador/backend
npm install --production
nano .env
```
Copiar y pegar las variables de configuración en el archivo `.env` (asegurando el uso de `https://tudominio.com` para evitar problemas de CORS en producción):
```ini
PORT=5000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cursos_ecuador
DB_USER=cursos_app
DB_PASSWORD=contrasena_segura_de_tu_bd
JWT_SECRET=cursos_ecuador_jwt_secret_key_2025_change_in_production
JWT_REFRESH_SECRET=cursos_ecuador_refresh_secret_key_2025_change_in_production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://tudominio.com
STORAGE_PATH=storage
MAX_FILE_SIZE=52428800
LOG_LEVEL=info
```

### Paso 11: Levantar y Demonizar el Backend con PM2
Instalar el gestor de procesos PM2 globalmente para mantener la aplicación activa en segundo plano.
```bash
sudo npm install -g pm2
cd /var/www/cursos-ecuador/backend
pm2 start src/index.js --name "cursos-ecuador-backend"
```
Configurar el arranque automático de PM2 al reiniciar el VPS:
```bash
pm2 startup systemd
# Copiar y ejecutar el comando sugerido en pantalla por el sistema
pm2 save
```

### Paso 12: Compilación de Frontend
Generar los estáticos optimizados y minificados de la interfaz de usuario en React.
```bash
cd /var/www/cursos-ecuador/frontend
npm install
npm run build
```
* **Resultado:** Generación del empaquetado final dentro de `/var/www/cursos-ecuador/frontend/dist/`.

### Paso 13: Configurar Nginx para el Dominio (Puerto 80 inicial)
Instalar el servidor Nginx y configurarlo para escuchar bajo tu nombre de dominio.
```bash
sudo apt install nginx -y

# Eliminar archivo de configuración por defecto
sudo rm /etc/nginx/sites-enabled/default

# Crear archivo de configuración personalizado
sudo nano /etc/nginx/sites-available/cursos-ecuador
```
Agregar la siguiente configuración del servidor web (reemplazando `tudominio.com` y `www.tudominio.com` con tu dominio real comprado):
```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    # Ocultar versión de Nginx por seguridad
    server_tokens off;

    # 1. Frontend (React SPA)
    location / {
        root /var/www/cursos-ecuador/frontend/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # 2. Backend API - Reverse Proxy hacia Node.js
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 3. Almacenamiento Estático (Archivos subidos, PDFs, avatars)
    location /storage {
        alias /var/www/cursos-ecuador/backend/storage;
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }
}
```
Activar la configuración:
```bash
sudo ln -s /etc/nginx/sites-available/cursos-ecuador /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Paso 14: Instalar Certbot y Obtener el Certificado SSL (HTTPS)
Instalar Certbot (el cliente oficial de Let's Encrypt) para solicitar certificados criptográficos y reconfigurar automáticamente Nginx a HTTPS seguro (Puerto 443).

> [!IMPORTANT]
> **Antes de ejecutar este paso:** Asegúrate de que en el panel de tu proveedor de dominios hayas configurado los registros DNS tipo **A** apuntando `tudominio.com` y `www.tudominio.com` hacia la dirección IP pública de tu VPS Hostinger.

```bash
# Instalar Certbot para Nginx
sudo apt install certbot python3-certbot-nginx -y

# Solicitar el certificado y dejar que Certbot configure Nginx automáticamente
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
```
* **Durante la instalación:** Certbot te pedirá un correo (para avisos de expiración) y te preguntará si deseas redirigir automáticamente todo el tráfico HTTP (80) a HTTPS (443). Elige la opción **Redirect** (Recomendado).
* **Verificación de Auto-renovación:** Let's Encrypt expira cada 90 días, pero Certbot instala un timer automático. Puedes probar que funciona con:
  ```bash
  sudo certbot renew --dry-run
  ```

---

## ESTRUCTURA FINAL DE NGINX DESPUÉS DE CERTBOT (HTTPS Activo)
Una vez que ejecutas Certbot, tu archivo `/etc/nginx/sites-available/cursos-ecuador` se modifica automáticamente quedando de la siguiente forma segura:
```nginx
server {
    server_name tudominio.com www.tudominio.com;

    server_tokens off;

    # Frontend (React SPA)
    location / {
        root /var/www/cursos-ecuador/frontend/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Backend API - Reverse Proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Almacenamiento Estático
    location /storage {
        alias /var/www/cursos-ecuador/backend/storage;
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }

    # CONFIGURACIÓN SSL INYECTADA POR CERTBOT
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

# Redirección automática de HTTP (80) a HTTPS (443)
server {
    if ($host = www.tudominio.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = tudominio.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name tudominio.com www.tudominio.com;
    return 404; # managed by Certbot
}
```

---

## PARTE 4. SEGURIDAD DEL SERVIDOR (VPS & DB)

### Paso 15: Configurar el Firewall (UFW)
Restringir puertos expuestos al internet público.
```bash
# Permitir SSH, HTTP y HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'

# Activar firewall
sudo ufw enable
```
* **Verificación:**
  ```bash
  sudo ufw status verbose
  ```
  Debe mostrar que solo los puertos `22`, `80` (redireccionado) y `443` están expuestos públicamente.

### Paso 16: Garantizar la Privacidad de PostgreSQL (Localhost)
Verificar que el motor de base de datos no acepte conexiones externas por defecto.
```bash
sudo ss -ltnp | grep postgres
```
* **Resultado Correcto:**
  `LISTEN 127.0.0.1:5432` $\rightarrow$ Solo se permiten conexiones locales.
* **Corrección (Si estuviese en 0.0.0.0):**
  Editar `/etc/postgresql/<versión>/main/postgresql.conf`, buscar `listen_addresses = '*'` y cambiarlo por:
  ```ini
  listen_addresses = 'localhost'
  ```
  Y luego reiniciar el servicio: `sudo systemctl restart postgresql`.

### Paso 17: Habilitar Fail2Ban (Fuerza Bruta SSH)
Crear archivo de configuración local para bloquear intentos maliciosos de conexión SSH.
```bash
sudo nano /etc/fail2ban/jail.local
```
Contenido del archivo:
```ini
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = 22
backend = systemd
```
Habilitar y verificar el servicio:
```bash
sudo systemctl restart fail2ban
sudo fail2ban-client status sshd
```

---

## PARTE 5. VERIFICACIÓN FINAL DEL ENTORNO

Ejecutar este set de comandos rápidos para confirmar que todo el ecosistema está activo y seguro antes de entregar la plataforma:

1. **Estado del Firewall:** `sudo ufw status` (Debe estar `active`).
2. **Estado de Procesos Backend (PM2):** `pm2 status` (Debe marcar `online` para `cursos-ecuador-backend`).
3. **Estado de Nginx:** `sudo systemctl status nginx` (Debe marcar `active (running)`).
4. **Verificación de Puertos en Escucha:** `ss -tulpen` (Comprobar puertos 80, 22, 5000, 5432).
5. **Verificación de Salud de la API:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Debe retornar: `{"status":"ok", ...}`.

---

## BANCO DE PREGUNTAS Y RESPUESTAS PARA EXPOSICIÓN ACADÉMICA

**P1: ¿Por qué Nginx se configura como proxy inverso (reverse proxy) en lugar de exponer Node.js directamente al puerto 80/443?**
* **R:** Por seguridad, modularidad y rendimiento. Nginx es altamente eficiente para manejar la terminación SSL (HTTPS) liberando a Node.js de esta carga de cifrado, procesa y sirve estáticos de forma masiva (el build de React), y oculta la infraestructura interna del backend (puerto 5000). Si la aplicación Node se cae, Nginx sigue activo informando al usuario, previniendo ataques directos de denegación de servicio a Node.js.

**P2: ¿Cómo funciona Let's Encrypt y Certbot para mantener la conexión segura con HTTPS?**
* **R:** Let's Encrypt es una Autoridad de Certificación (CA) abierta y gratuita. Certbot se comunica con Let's Encrypt mediante el protocolo **ACME** para validar que somos dueños de `tudominio.com` (colocando temporalmente un archivo de verificación en el servidor web). Una vez validado, emite los archivos de certificado y llave privada (`fullchain.pem` y `privkey.pem`) e inyecta la configuración en Nginx. Let's Encrypt expira cada 90 días, pero Certbot instala un servicio automático (`systemd timer`) que valida y renueva el certificado de manera transparente sin intervención manual.

**P3: ¿Qué diferencia existe entre el middleware de limitación de tasa (rate limiting) en Node.js y la protección por Fail2Ban a nivel de sistema operativo?**
* **R:** El rate limiting en Node.js ([index.js](file:///c:/Users/Leslie/Desktop/P%20Inteligencia%20Negocios/cursos-ecuador/backend/src/index.js#L33)) se procesa a nivel de aplicación Express. Evita que un cliente sature de llamadas la base de datos o endpoints de login/pagos (limita a 100 llamadas por 15 min). Fail2Ban opera leyendo los logs de intentos de autenticación del sistema operativo (SSH) en `/var/log/auth.log` y, al detectar fallos repetidos, bloquea la IP del atacante directamente en las tablas del firewall de Linux (`iptables`), impidiendo que el tráfico siquiera entre al servidor.

**P4: ¿Por qué se configuró un Pool de conexiones en lugar de una conexión única a PostgreSQL?**
* **R:** La apertura y cierre de conexiones TCP directas con PostgreSQL consume muchos recursos y tiempo de procesamiento. El Pool (`new Pool` en [database.js](file:///c:/Users/Leslie/Desktop/P%20Inteligencia%20Negocios/cursos-ecuador/backend/src/config/database.js#L3)) mantiene un almacén activo de hasta 20 conexiones ya autenticadas. Cada vez que una consulta entra al backend, toma una conexión libre del pool, ejecuta la consulta y la devuelve de inmediato, optimizando la latencia de respuesta drásticamente.
