import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authenticateToken } from '../auth.js';
import * as contactService from '../services/contactService.js';

const router = express.Router();

router.use(authenticateToken);

// GET /api/contacts
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
      const result = await contactService.getContacts(req.user.tenantId, page, limit, search);

      res.json(result);
    } catch (error) {
      console.error('Get contacts error:', error);
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  }
);

// POST /api/contacts
router.post(
  '/',
  [
    body('firstName').notEmpty().trim().escape(),
    body('lastName').notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('phone').optional().trim(),
    body('jobTitle').optional().trim().escape(),
    body('department').optional().trim().escape(),
    body('companyId').optional().isUUID(),
    body('isPrimaryContact').optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const contact = await contactService.createContact(
        req.user.tenantId,
        req.user.userId,
        req.body
      );

      res.status(201).json(contact);
    } catch (error) {
      console.error('Create contact error:', error);
      res.status(500).json({ error: 'Failed to create contact' });
    }
  }
);

// GET /api/contacts/:id
router.get(
  '/:id',
  [param('id').isUUID()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const contact = await contactService.getContactById(req.user.tenantId, req.params.id);

      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      res.json(contact);
    } catch (error) {
      console.error('Get contact error:', error);
      res.status(500).json({ error: 'Failed to fetch contact' });
    }
  }
);

// PUT /api/contacts/:id
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('firstName').optional().trim().escape(),
    body('lastName').optional().trim().escape(),
    body('email').optional().isEmail().normalizeEmail(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const contact = await contactService.updateContact(req.user.tenantId, req.params.id, req.body);

      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      res.json(contact);
    } catch (error) {
      console.error('Update contact error:', error);
      res.status(500).json({ error: 'Failed to update contact' });
    }
  }
);

// DELETE /api/contacts/:id
router.delete(
  '/:id',
  [param('id').isUUID()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const deleted = await contactService.deleteContact(req.user.tenantId, req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete contact error:', error);
      res.status(500).json({ error: 'Failed to delete contact' });
    }
  }
);

// GET /api/contacts/company/:companyId
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
      const result = await contactService.getContactsByCompany(
        req.user.tenantId,
        req.params.companyId,
        page,
        limit
      );

      res.json(result);
    } catch (error) {
      console.error('Get company contacts error:', error);
      res.status(500).json({ error: 'Failed to fetch company contacts' });
    }
  }
);

export default router;
