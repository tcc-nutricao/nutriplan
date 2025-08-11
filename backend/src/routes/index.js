import fs from 'fs';
import path from 'path';
import { Router } from 'express';

export const loadRoutes = (router, directoryPath) => {
  const directory = path.resolve(directoryPath);
  const filelist = fs.readdirSync(directory);

  filelist.forEach((file) => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadRoutes(router, fullPath);
    } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.mjs'))) {
      import(fullPath).then((routesModule) => {
        const routes = routesModule.default || routesModule;
        if (typeof routes === 'function') {
          routes(router);
        }
      }).catch(console.error);
    }
  });
};

export const startRoutes = (app, routesPath = './src/routes') => {
  const router = Router();
  app.use(router);

  loadRoutes(router, routesPath);

  router.route('/ping').all((req, res) => {
    res.status(200).send('Pong');
  });

  router.route('/').all((req, res) => {
    res.sendStatus(204);
  });

  router.route('*').all((req, res) => {
    res.status(404).send('Erro, rota não encontrada.');
  });
};
