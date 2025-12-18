import { v4 as uuidv4 } from 'uuid';
import pool from '../db.js';

export const createContact = async (tenantId, userId, contactData) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    jobTitle,
    department,
    companyId,
    isPrimaryContact,
    notes,
  } = contactData;

  const id = uuidv4();

  const result = await pool.query(
    `INSERT INTO contacts
     (id, tenant_id, first_name, last_name, email, phone, job_title, department, company_id, is_primary_contact, notes, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
    [id, tenantId, firstName, lastName, email, phone, jobTitle, department, companyId, isPrimaryContact || false, notes, userId]
  );

  return result.rows[0];
};

export const getContacts = async (tenantId, page = 1, limit = 20, search = '') => {
  const offset = (page - 1) * limit;
  const searchPattern = search ? `%${search}%` : '%';

  const result = await pool.query(
    `SELECT * FROM contacts
     WHERE tenant_id = $1 AND (first_name ILIKE $2 OR last_name ILIKE $2 OR email ILIKE $2)
     ORDER BY created_at DESC
     LIMIT $3 OFFSET $4`,
    [tenantId, searchPattern, limit, offset]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM contacts WHERE tenant_id = $1 AND (first_name ILIKE $2 OR last_name ILIKE $2 OR email ILIKE $2)`,
    [tenantId, searchPattern]
  );

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total: parseInt(countResult.rows[0].count),
      pages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    },
  };
};

export const getContactById = async (tenantId, contactId) => {
  const result = await pool.query(
    'SELECT * FROM contacts WHERE id = $1 AND tenant_id = $2',
    [contactId, tenantId]
  );

  return result.rows[0];
};

export const getContactsByCompany = async (tenantId, companyId, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  const result = await pool.query(
    `SELECT * FROM contacts
     WHERE tenant_id = $1 AND company_id = $2
     ORDER BY is_primary_contact DESC, created_at DESC
     LIMIT $3 OFFSET $4`,
    [tenantId, companyId, limit, offset]
  );

  const countResult = await pool.query(
    'SELECT COUNT(*) FROM contacts WHERE tenant_id = $1 AND company_id = $2',
    [tenantId, companyId]
  );

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total: parseInt(countResult.rows[0].count),
      pages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    },
  };
};

export const updateContact = async (tenantId, contactId, updateData) => {
  const fields = [];
  const values = [tenantId, contactId];
  let paramCount = 2;

  Object.entries(updateData).forEach(([key, value]) => {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    fields.push(`${dbKey} = $${paramCount + 1}`);
    values.push(value);
    paramCount++;
  });

  const query = `UPDATE contacts SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
                 WHERE tenant_id = $1 AND id = $2
                 RETURNING *`;

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const deleteContact = async (tenantId, contactId) => {
  const result = await pool.query(
    'DELETE FROM contacts WHERE id = $1 AND tenant_id = $2 RETURNING id',
    [contactId, tenantId]
  );

  return result.rows[0];
};
