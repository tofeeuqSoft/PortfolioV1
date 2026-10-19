import { Router } from 'express';
import { listProjects, getProjectBySlug } from '../controllers/projectController.js';
import { createCrudController } from '../utils/crudController.js';
import { requireAuth } from '../middleware/auth.js';
import Project from '../models/Project.js';

const router = Router();
const crud = createCrudController(Project, { sort: { order: 1, createdAt: -1 } });

router.get('/', listProjects);
router.post('/', requireAuth, crud.create);
router.get('/:slug', getProjectBySlug);
router.put('/:id', requireAuth, crud.update);
router.delete('/:id', requireAuth, crud.remove);

export default router;
