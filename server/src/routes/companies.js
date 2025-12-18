import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authenticateToken } from '../auth.js';
import * as companyService from '../services/companyService.js';

const router = express.Router();

// Middleware to attach tenant
router.use(authenticateToken);

// GET /api/companies
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { page = 1, limit = 20, search = '' } = req.query;
      const result = await companyService.getCompanies(req.user.tenantId, page, limit, search);

      res.json(result);
    } catch (error) {
      console.error('Get companies error:', error);
      res.status(500).json({ error: 'Failed to fetch companies' });
    }
  }
);

// POST /api/companies
router.post(
  '/',
  [
    body('name').notEmpty().trim().escape(),
    body('industry').optional().trim().escape(),
    body('website').optional().isURL(),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const company = await companyService.createCompany(
        req.user.tenantId,
        req.user.userId,
        req.body
      );

      res.status(201).json(company);
    } catch (error) {
      console.error('Create company error:', error);
      res.status(500).json({ error: 'Failed to create company' });
    }
  }
);

// GET /api/companies/:id
router.get(
  '/:id',
  [param('id').isUUID()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const company = await companyService.getCompanyById(req.user.tenantId, req.params.id);

      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      res.json(company);
    } catch (error) {
      console.error('Get company error:', error);
      res.status(500).json({ error: 'Failed to fetch company' });
    }
  }
);

// PUT /api/companies/:id
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('name').optional().trim().escape(),
    body('industry').optional().trim().escape(),
    body('website').optional().isURL(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const company = await companyService.updateCompany(req.user.tenantId, req.params.id, req.body);

      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      res.json(company);
    } catch (error) {
      console.error('Update company error:', error);
      res.status(500).json({ error: 'Failed to update company' });
    }
  }
);

// DELETE /api/companies/:id
router.delete(
  '/:id',
  [param('id').isUUID()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const deleted = await companyService.deleteCompany(req.user.tenantId, req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Company not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete company error:', error);
      res.status(500).json({ error: 'Failed to delete company' });
    }
  }
);

export default router;
