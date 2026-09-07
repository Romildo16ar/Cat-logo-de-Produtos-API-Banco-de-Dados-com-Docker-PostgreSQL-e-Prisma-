import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { HttpError } from '../utils/http-error';

/**
 * Middleware final de erro. Traduz erros conhecidos em respostas JSON
 * e evita vazar stack trace para o cliente.
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof HttpError) {
    res.status(error.status).json({
      error: error.status === 404 ? 'Not Found' : 'Bad Request',
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }

  // JSON malformado no corpo da requisicao (lancado pelo express.json()).
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'O corpo da requisicao nao e um JSON valido.',
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2025 = registro nao encontrado em update/delete.
    if (error.code === 'P2025') {
      res.status(404).json({
        error: 'Not Found',
        message: 'O registro solicitado nao existe.',
      });
      return;
    }
    res.status(400).json({
      error: 'Bad Request',
      message: `Erro do banco de dados (codigo ${error.code}).`,
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error('[erro] Falha ao conectar no PostgreSQL:', error.message);
    res.status(503).json({
      error: 'Service Unavailable',
      message:
        'Nao foi possivel conectar ao banco de dados. O container do PostgreSQL esta rodando? (docker compose up -d)',
    });
    return;
  }

  console.error('[erro] Excecao nao tratada:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Ocorreu um erro inesperado no servidor.',
  });
}
