import type { Request, Response } from 'express';

/** Captura qualquer rota nao registrada e responde 404 em JSON. */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: 'Not Found',
    message: `Rota ${req.method} ${req.originalUrl} nao existe nesta API.`,
  });
}
