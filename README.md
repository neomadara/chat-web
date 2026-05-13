# chat-web

Version web del sistema de mensajeria en tiempo real. Implementada con React.js + Vite.

## Stack

- React.js + Vite
- TanStack Query (gestion de estado y cache)
- Supabase JS (base de datos y autenticacion)
- React Router DOM (navegacion)
- CSS Modules (estilos)

## Requisitos

- Node.js 18+
- Cuenta en Supabase con el proyecto configurado

## Instalacion

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/chat-web.git
cd chat-web

# Instalar dependencias
npm install

# Configurar variables de entorno
cp src/shared/.env-example .env
# Editar .env y usar variables VITE_* para la app web
```

## Variables de entorno

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre http://localhost:5173 en el navegador.

## Build para produccion

```bash
npm run build
npm run preview
```

## Estructura

```text
src/
|-- lib/
|   `-- supabaseweb.js       # Inicializacion de Supabase con variables VITE_
|-- screens/
|   |-- LoginScreen.jsx      # Pantalla de login
|   |-- ChatScreen.jsx       # Lista de conversaciones
|   |-- ChatRoomScreen.jsx   # Chat individual con realtime
|   `-- *.module.css         # Estilos de cada pantalla
|-- shared/                  # Codigo compartido (git subtree de chat-shared)
|   |-- lib/
|   |-- services/
|   |-- hooks/
|   `-- components/
`-- App.jsx                  # Rutas y auth guard
```

## Funcionalidades

- Login con email y password
- Lista de conversaciones con busqueda y filtros (Todos / Sin leer / Leidos)
- Mensajes en tiempo real via Supabase Realtime
- Mensajes agrupados por fecha con separadores
- Burbujas estilo WhatsApp (propios a la derecha, recibidos a la izquierda)
- Paginacion - cargar mensajes anteriores
- Eliminar mensajes (doble click)
- Logout

## Sincronizar shared layer

```bash
git remote add shared https://github.com/TU_USUARIO/chat-shared.git
git subtree pull --prefix=src/shared shared main --squash
```

## Sincronizacion con chat-shared (git subtree)

Dentro de chat-web, edita src/shared/services/chatService.js:

```bash
git add .
git commit -m "feat: update chatService"
```

Empuja ese cambio de vuelta a chat-shared:

```bash
git subtree push --prefix=src/shared https://github.com/TU_USUARIO/chat-shared.git main
```

Luego sincroniza chat-mobile:

```bash
cd ../chat-mobile
git subtree pull --prefix=src/shared https://github.com/TU_USUARIO/chat-shared.git main --squash
```

### Usando el remote shared

Jalar cambios desde chat-shared:

```bash
git subtree pull --prefix=src/shared shared main --squash
```

Empujar cambios hacia chat-shared:

```bash
git subtree push --prefix=src/shared shared main
```