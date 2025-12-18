import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authenticateToken } from '../auth.js';
import * as dealService from '../services/dealService.js';

const router = express.Router();

router.use(authenticateToken);

// GET /api/deals
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('status').optional().isIn(['open', 'won', 'lost', 'on-hold']),
    query('minValue').optional().isFloat({ min: 0 }).toFloat(),
    query('maxValue').optional().isFloat({ min: 0 }).toFloat(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { page = 1, limit = 20, status, minValue, maxValue } = req.query;
      const result = await dealService.getDeals(req.user.tenantId, page, limit, {
        status,
        minValue,
        maxValue,
      });

      res.json(result);
    } catch (error) {
      console.error('Get deals error:', error);
      res.status(500).json({ error: 'Failed to fetch deals' });
    }
  }
);

// POST /api/deals
router.post(
  '/',
  [
    body('title').notEmpty().trim().escape(),
    body('description').optional().trim(),
    body('value').optional().isFloat({ min: 0 }),
    body('currency').optional().isLength({ min: 3, max: 3 }),
    body('status').optional().isIn(['open', 'won', 'lost', 'on-hold']),
    body('probability').optional().isInt({ min: 0, max: 100 }),
    body('expectedCloseDate').optional().isISO8601(),
    body('companyId').notEmpty().isUUID(),
    body('contactId').optional().isUUID(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const deal = await dealService.createDeal(req.user.tenantId, req.user.userId, req.body);

      res.status(201).json(deal);
    } catch (error) {
      console.error('Create deal error:', error);
      res.status(500).json({ error: 'Failed to create deal' });
    }
  }
);

// GET /api/deals/:id
router.get(
  '/:id',
  [param('id').isUUID()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const deal = await dealService.getDealById(req.user.tenantId, req.params.id);

      if (!deal) {
        return res.status(404).json({ error: 'Deal not found' });
      }

      res.json(deal);
    } catch (error) {
      console.error('Get deal error:', error);
      res.status(500).json({ error: 'Failed to fetch deal' });
    }
  }
);

// PUT /api/deals/:id
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('title').optional().trim().escape(),
    body('status').optional().isIn(['open', 'won', 'lost', 'on-hold']),
    body('probability').optional().isInt({ min: 0, max: 100 }),
    body('value').optional().isFloat({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const deal = await dealService.updateDeal(req.user.tenantId, req.params.id, req.body);

      if (!deal) {
        return res.status(404).json({ error: 'Deal not found' });
      }

      res.json(deal);
    } catch (error) {
      console.error('Update deal error:', error);
      res.status(500).json({ error: 'Failed to update deal' });
    }
  }
);

// DELETE /api/deals/:id
router.delete(
  '/:id',
  [param('id').isUUID()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const deleted = await dealService.deleteDeal(req.user.tenantId, req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Deal not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete deal error:', error);
      res.status(500).json({ error: 'Failed to delete deal' });
    }
  }
);

// GET /api/deals/company/:companyId
router.get(
  '/company/:companyId',
  [
    param('companyId').isUUID(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { page = 1, limit = 20 } = req.query;
      const result = await dealService.getDealsByCompany(
        req.user.tenantId,
        req.params.companyId,
        page,
        limit
      );

      res.json(result);
    } catch (error) {
      console.error('Get company deals error:', error);
      res.status(500).json({ error: 'Failed to fetch company deals' });
    }
  }
);

export default router;
