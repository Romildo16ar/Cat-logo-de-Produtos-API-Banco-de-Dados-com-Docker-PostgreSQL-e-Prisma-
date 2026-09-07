import 'dotenv/config';
import { app } from './app';
import { prisma } from './lib/prisma';

const port = Number(process.env.PORT ?? 3000);

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('Conectado ao PostgreSQL.');
  } catch {
    console.warn(
      'Aviso: nao foi possivel conectar ao PostgreSQL agora. ' +
        'Verifique se o container esta ativo (docker compose up -d). ' +
        'O servidor sobe mesmo assim e tenta reconectar a cada requisicao.',
    );
  }

  const server = app.listen(port, () => {
    console.log(`API ouvindo em http://localhost:${port}`);
    console.log(`   GET http://localhost:${port}/`);
    console.log(`   GET http://localhost:${port}/products`);
    console.log(`   GET http://localhost:${port}/products/1`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} recebido, encerrando...`);
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

void bootstrap();
