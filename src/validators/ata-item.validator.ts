import { Prisma } from '@prisma/client';
import { HttpError } from '../utils/http-error';

export interface AtaItemInput {
  title: string;
  description: string;
  unit: string;
  quantity: number;
  price: Prisma.Decimal;
  supplier: string;
  ataNumber: string;
  validUntil: Date;
}

const MAX_LENGTHS = { title: 160, unit: 20, supplier: 160, ataNumber: 40 } as const;

function requireString(
  body: Record<string, unknown>,
  field: keyof typeof MAX_LENGTHS | 'description',
  errors: string[],
): string {
  const value = body[field];
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(`"${field}" e obrigatorio e deve ser um texto nao vazio.`);
    return '';
  }
  const trimmed = value.trim();
  const max = field === 'description' ? undefined : MAX_LENGTHS[field];
  if (max !== undefined && trimmed.length > max) {
    errors.push(`"${field}" deve ter no maximo ${max} caracteres.`);
  }
  return trimmed;
}

/** Valida o corpo de POST/PUT e devolve os dados ja normalizados. */
export function validateAtaItem(body: unknown): AtaItemInput {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw HttpError.badRequest('O corpo da requisicao deve ser um objeto JSON.');
  }

  const data = body as Record<string, unknown>;
  const errors: string[] = [];

  const title = requireString(data, 'title', errors);
  const description = requireString(data, 'description', errors);
  const unit = requireString(data, 'unit', errors);
  const supplier = requireString(data, 'supplier', errors);
  const ataNumber = requireString(data, 'ataNumber', errors);

  const quantity = Number(data['quantity']);
  if (!Number.isInteger(quantity) || quantity < 0) {
    errors.push('"quantity" e obrigatorio e deve ser um inteiro maior ou igual a zero.');
  }

  let price = new Prisma.Decimal(0);
  const rawPrice = data['price'];
  if (typeof rawPrice !== 'string' && typeof rawPrice !== 'number') {
    errors.push('"price" e obrigatorio (envie como string, ex.: "4890.50", para preservar a precisao).');
  } else {
    try {
      price = new Prisma.Decimal(rawPrice);
      if (price.isNegative()) errors.push('"price" nao pode ser negativo.');
    } catch {
      errors.push('"price" deve ser um valor decimal valido, ex.: "4890.50".');
    }
  }

  const rawValidUntil = data['validUntil'];
  const validUntil = new Date(String(rawValidUntil));
  if (typeof rawValidUntil !== 'string' || Number.isNaN(validUntil.getTime())) {
    errors.push('"validUntil" e obrigatorio e deve ser uma data ISO, ex.: "2026-12-31".');
  }

  if (errors.length > 0) {
    throw HttpError.badRequest('Dados invalidos na requisicao.', errors);
  }

  return { title, description, unit, quantity, price, supplier, ataNumber, validUntil };
}

/** Converte o parametro de rota `:id` em inteiro, rejeitando valores invalidos. */
export function parseId(raw: string | undefined): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw HttpError.badRequest(`O id "${raw}" e invalido: informe um numero inteiro positivo.`);
  }
  return id;
}
