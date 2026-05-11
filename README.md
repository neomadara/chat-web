# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Sincronización con chat-shared (git subtree)

Dentro de chat-web, edita `src/shared/services/chatService.js`:

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

### Usando el remote `shared`

Jalar cambios desde chat-shared:

```bash
git subtree pull --prefix=src/shared shared main --squash
```

Empujar cambios hacia chat-shared:

```bash
git subtree push --prefix=src/shared shared main
```