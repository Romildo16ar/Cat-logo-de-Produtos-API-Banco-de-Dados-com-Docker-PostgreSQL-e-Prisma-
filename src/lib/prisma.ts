import { PrismaClient } from '@prisma/client';

/**
 * Instancia unica do PrismaClient reaproveitada em toda a aplicacao.
 * Em modo de desenvolvimento o `tsx watch` recarrega o modulo a cada
 * alteracao, entao guardamos a instancia no globalThis para nao abrir
 * uma nova pool de conexoes a cada reload.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
