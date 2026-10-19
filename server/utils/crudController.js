import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Builds a standard CRUD controller for a Mongoose model.
 */
export function createCrudController(Model, { sort = { order: 1, createdAt: -1 } } = {}) {
  return {
    list: asyncHandler(async (req, res) => {
      const docs = await Model.find().sort(sort);
      res.json({ success: true, data: docs });
    }),

    getOne: asyncHandler(async (req, res) => {
      const doc = await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: doc });
    }),

    create: asyncHandler(async (req, res) => {
      const doc = await Model.create(req.body);
      res.status(201).json({ success: true, data: doc, message: 'Created' });
    }),

    update: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: doc, message: 'Updated' });
    }),

    remove: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: doc, message: 'Deleted' });
    }),
  };
}
