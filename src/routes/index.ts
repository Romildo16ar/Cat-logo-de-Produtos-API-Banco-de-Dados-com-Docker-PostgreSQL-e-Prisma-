import { Router } from 'express';
import { ataItemRoutes } from './ata-item.routes';

export const routes = Router();

/** GET / - status da API. */
routes.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    api: 'Catalogo de Itens de Ata de Registro de Precos - CIESP',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /products',
      'GET /products/:id',
      'POST /products',
      'PUT /products/:id',
      'DELETE /products/:id',
    ],
  });
});


routes.use('/products', ataItemRoutes);
