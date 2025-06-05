# Development Guidelines

This repo contains a React/Vite frontend. Use the following commands for local development:

```
npm install        # install dependencies
npm run dev        # start dev server
npm run build      # production build
npm run lint       # check code with ESLint
```

Always run `npm run lint` before committing changes. Do not commit the `dist` folder or `node_modules`.

The `deploy.sh` script includes credentials for deploying via `rsync`. Keep these secrets private and avoid modifying them in commits.
