import { Router } from 'express';
import { createCrudController } from '../utils/crudController.js';
import { requireAuth } from '../middleware/auth.js';
import Skill from '../models/Skill.js';
import Education from '../models/Education.js';
import Training from '../models/Training.js';
import Testimonial from '../models/Testimonial.js';
import Service from '../models/Service.js';
import { listSkills } from '../controllers/skillController.js';

function contentRouter(Model, sort, listController) {
  const router = Router();
  const crud = createCrudController(Model, { sort });
  router.get('/', listController || crud.list);
  router.post('/', requireAuth, crud.create);
  router.get('/:id', crud.getOne);
  router.put('/:id', requireAuth, crud.update);
  router.delete('/:id', requireAuth, crud.remove);
  return router;
}

export const skillsRouter = contentRouter(Skill, { category: 1, order: 1 }, listSkills);
export const educationRouter = contentRouter(Education, { order: 1 });
export const trainingRouter = contentRouter(Training, { order: 1 });
export const testimonialsRouter = contentRouter(Testimonial, { order: 1, createdAt: -1 });
export const servicesRouter = contentRouter(Service, { order: 1 });
