import { v4 as uuidv4 } from 'uuid';
import pool from '../db.js';

export const createDeal = async (tenantId, userId, dealData) => {
  const {
    title,
    description,
    value,
    currency,
    status,
    probability,
    expectedCloseDate,
    companyId,
    contactId,
    ownerId,
  } = dealData;

  const id = uuidv4();

  const result = await pool.query(
    `INSERT INTO deals
     (id, tenant_id, title, description, value, currency, status, probability, expected_close_date, company_id, contact_id, owner_id, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING *`,
    [id, tenantId, title, description, value, currency || 'USD', status || 'open', probability || 0, expectedCloseDate, companyId, contactId, ownerId || userId, userId]
  );

  return result.rows[0];
};

export const getDeals = async (tenantId, page = 1, limit = 20, filters = {}) => {
  const offset = (page - 1) * limit;
  const { status, minValue, maxValue } = filters;

  let query = 'SELECT * FROM deals WHERE tenant_id = $1';
  const params = [tenantId];

  if (status) {
    query += ` AND status = $${params.length + 1}`;
    params.push(status);
  }

  if (minValue) {
    query += ` AND value >= $${params.length + 1}`;
    params.push(minValue);
  }

  if (maxValue) {
    query += ` AND value <= $${params.length + 1}`;
    params.push(maxValue);
  }

  query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);

  const result = await pool.query(query, params);

  const countQuery = 'SELECT COUNT(*) FROM deals WHERE tenant_id = $1' + 
    (status ? ` AND status = $2` : '') +
    (minValue ? ` AND value >= $${status ? 3 : 2}` : '') +
    (maxValue ? ` AND value <= $${status ? (minValue ? 4 : 3) : (minValue ? 3 : 2)}` : '');
  
  const countParams = [tenantId];
  if (status) countParams.push(status);
  if (minValue) countParams.push(minValue);
  if (maxValue) countParams.push(maxValue);

  const countResult = await pool.query(countQuery, countParams);

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

export const getDealById = async (tenantId, dealId) => {
  const result = await pool.query(
    'SELECT * FROM deals WHERE id = $1 AND tenant_id = $2',
    [dealId, tenantId]
  );

  return result.rows[0];
};

export const getDealsByCompany = async (tenantId, companyId, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  const result = await pool.query(
    `SELECT * FROM deals
     WHERE tenant_id = $1 AND company_id = $2
     ORDER BY created_at DESC
     LIMIT $3 OFFSET $4`,
    [tenantId, companyId, limit, offset]
  );

  const countResult = await pool.query(
    'SELECT COUNT(*) FROM deals WHERE tenant_id = $1 AND company_id = $2',
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

export const updateDeal = async (tenantId, dealId, updateData) => {
  const fields = [];
  const values = [tenantId, dealId];
  let paramCount = 2;

  Object.entries(updateData).forEach(([key, value]) => {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    fields.push(`${dbKey} = $${paramCount + 1}`);
    values.push(value);
    paramCount++;
  });

  const query = `UPDATE deals SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
                 WHERE tenant_id = $1 AND id = $2
                 RETURNING *`;

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const deleteDeal = async (tenantId, dealId) => {
  const result = await pool.query(
    'DELETE FROM deals WHERE id = $1 AND tenant_id = $2 RETURNING id',
    [dealId, tenantId]
  );

  return result.rows[0];
};
