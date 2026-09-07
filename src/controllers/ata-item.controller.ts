import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { serializeAtaItem } from '../utils/serialize';
import { HttpError } from '../utils/http-error';
import { parseId, validateAtaItem } from '../validators/ata-item.validator';

/** GET /products - lista todos os itens de ata. */
export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await prisma.ataItem.findMany({ orderBy: { id: 'asc' } });
    res.json({ count: items.length, data: items.map(serializeAtaItem) });
  } catch (error) {
    next(error);
  }
}

/** GET /products/:id - busca um item por id (404 quando nao encontrado). */
export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id);
    const item = await prisma.ataItem.findUnique({ where: { id } });

    if (!item) {
      throw HttpError.notFound(`Nenhum item de ata encontrado com o id ${id}.`);
    }

    res.json({ data: serializeAtaItem(item) });
  } catch (error) {
    next(error);
  }
}

/** POST /products - cria um item. */
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = validateAtaItem(req.body);
    const item = await prisma.ataItem.create({ data });
    res.status(201).json({ data: serializeAtaItem(item) });
  } catch (error) {
    next(error);
  }
}

/** PUT /products/:id - atualiza um item existente. */
export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id);
    const data = validateAtaItem(req.body);

    const exists = await prisma.ataItem.findUnique({ where: { id } });
    if (!exists) {
      throw HttpError.notFound(`Nenhum item de ata encontrado com o id ${id}.`);
    }

    const item = await prisma.ataItem.update({ where: { id }, data });
    res.json({ data: serializeAtaItem(item) });
  } catch (error) {
    next(error);
  }
}

/** DELETE /products/:id - remove um item. */
export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id);

    const exists = await prisma.ataItem.findUnique({ where: { id } });
    if (!exists) {
      throw HttpError.notFound(`Nenhum item de ata encontrado com o id ${id}.`);
    }

    await prisma.ataItem.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
