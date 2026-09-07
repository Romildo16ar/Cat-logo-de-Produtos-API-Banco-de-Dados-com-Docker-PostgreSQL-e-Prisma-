import { Router } from 'express';
import * as controller from '../controllers/ata-item.controller';

export const ataItemRoutes = Router();

ataItemRoutes.get('/', controller.list);
ataItemRoutes.get('/:id', controller.getById);
ataItemRoutes.post('/', controller.create);
ataItemRoutes.put('/:id', controller.update);
ataItemRoutes.delete('/:id', controller.remove);
