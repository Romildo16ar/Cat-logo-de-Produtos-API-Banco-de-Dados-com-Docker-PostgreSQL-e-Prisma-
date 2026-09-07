import type { AtaItem } from '@prisma/client';

/** Formato do item de ata devolvido pela API. */
export interface AtaItemResponse {
  id: number;
  title: string;
  description: string;
  unit: string;
  quantity: number;
  price: string;
  totalValue: string;
  supplier: string;
  ataNumber: string;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Converte o registro do Prisma para JSON.
 *
 * `price` e um Decimal e vira string na resposta: serializar como Number
 * reintroduziria o erro de ponto flutuante que o Decimal existe para evitar.
 */
export function serializeAtaItem(item: AtaItem): AtaItemResponse {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    unit: item.unit,
    quantity: item.quantity,
    price: item.price.toFixed(2),
    totalValue: item.price.mul(item.quantity).toFixed(2),
    supplier: item.supplier,
    ataNumber: item.ataNumber,
    validUntil: item.validUntil.toISOString().slice(0, 10),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}
