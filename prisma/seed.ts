import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Dados ficticios, montados no formato de uma Ata de Registro de Precos
 * (Lei 14.133/2021) para fins didaticos. Nao representam uma ata real.
 */
const items: Prisma.AtaItemCreateInput[] = [
  {
    title: 'Notebook corporativo 14" i5 16GB',
    description:
      'Notebook 14 polegadas, processador Intel Core i5 de 13a geracao, 16 GB RAM DDR5, SSD NVMe 512 GB, Windows 11 Pro, garantia on-site de 36 meses.',
    unit: 'UN',
    quantity: 120,
    price: new Prisma.Decimal('4890.5000'),
    supplier: 'Tecnolog Suprimentos de Informatica LTDA',
    ataNumber: 'ARP 012/2026',
    validUntil: new Date('2026-12-31'),
  },
  {
    title: 'Monitor LED 27" Full HD',
    description:
      'Monitor 27 polegadas, painel IPS, resolucao 1920x1080, entradas HDMI e DisplayPort, ajuste de altura e inclinacao, garantia de 24 meses.',
    unit: 'UN',
    quantity: 200,
    price: new Prisma.Decimal('1180.9000'),
    supplier: 'Tecnolog Suprimentos de Informatica LTDA',
    ataNumber: 'ARP 012/2026',
    validUntil: new Date('2026-12-31'),
  },
  {
    title: 'Cadeira ergonomica giratoria NR-17',
    description:
      'Cadeira de escritorio giratoria com apoio lombar regulavel, bracos 3D, base em nylon, revestimento em tela mesh, em conformidade com a NR-17.',
    unit: 'UN',
    quantity: 350,
    price: new Prisma.Decimal('1425.0000'),
    supplier: 'Mobilia Corporativa Paulista S/A',
    ataNumber: 'ARP 013/2026',
    validUntil: new Date('2027-03-31'),
  },
  {
    title: 'Servico de limpeza predial - posto mensal',
    description:
      'Posto de servico continuado de limpeza e conservacao predial, 44h semanais, com fornecimento de materiais, uniformes e EPIs, encargos inclusos.',
    unit: 'POSTO/MES',
    quantity: 24,
    price: new Prisma.Decimal('6320.7500'),
    supplier: 'Conserva Facility Services EIRELI',
    ataNumber: 'ARP 007/2026',
    validUntil: new Date('2027-01-31'),
  },
  {
    title: 'Licenca de software de gestao documental (anual)',
    description:
      'Licenca anual por usuario nomeado de plataforma de gestao eletronica de documentos, com assinatura digital ICP-Brasil, suporte 8x5 e atualizacoes inclusas.',
    unit: 'LICENCA/ANO',
    quantity: 80,
    price: new Prisma.Decimal('2340.0000'),
    supplier: 'DocFlow Sistemas de Informacao LTDA',
    ataNumber: 'ARP 021/2026',
    validUntil: new Date('2027-06-30'),
  },
  {
    title: 'Ar-condicionado split inverter 12.000 BTUs',
    description:
      'Condicionador de ar tipo split hi-wall inverter, 12.000 BTUs, ciclo frio, classificacao A no Selo Procel, gas R-32, instalacao inclusa.',
    unit: 'UN',
    quantity: 60,
    price: new Prisma.Decimal('2795.3000'),
    supplier: 'Climatec Engenharia Termica LTDA',
    ataNumber: 'ARP 018/2026',
    validUntil: new Date('2027-02-28'),
  },
  {
    title: 'Resma de papel A4 75g/m2 - caixa com 10',
    description:
      'Caixa com 10 resmas de papel sulfite A4, 210x297 mm, gramatura 75 g/m2, alvura minima 90%, com certificacao de origem florestal.',
    unit: 'CX',
    quantity: 500,
    price: new Prisma.Decimal('241.8000'),
    supplier: 'Papelaria Central Distribuidora LTDA',
    ataNumber: 'ARP 004/2026',
    validUntil: new Date('2026-11-30'),
  },
];

async function main() {
  console.log('Limpando a tabela ata_items...');
  await prisma.ataItem.deleteMany();

  console.log(`Inserindo ${items.length} itens de ata...`);
  for (const item of items) {
    const created = await prisma.ataItem.create({ data: item });
    console.log(`  [${created.id}] ${created.title} - R$ ${created.price.toFixed(2)}`);
  }

  const total = await prisma.ataItem.count();
  console.log(`\nSeed concluido. Total de itens no banco: ${total}`);
}

main()
  .catch((error) => {
    console.error('Falha ao executar o seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
