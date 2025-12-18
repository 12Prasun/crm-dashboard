import { v4 as uuidv4 } from 'uuid';
import pool from '../db.js';

export const createCompany = async (tenantId, userId, companyData) => {
  const {
    name,
    industry,
    website,
    phone,
    email,
    address,
    city,
    state,
    country,
    postalCode,
    employeeCount,
    annualRevenue,
  } = companyData;

  const id = uuidv4();

  const result = await pool.query(
    `INSERT INTO companies
     (id, tenant_id, name, industry, website, phone, email, address, city, state, country, postal_code, employee_count, annual_revenue, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING *`,
    [id, tenantId, name, industry, website, phone, email, address, city, state, country, postalCode, employeeCount, annualRevenue, userId]
  );

  return result.rows[0];
};

export const getCompanies = async (tenantId, page = 1, limit = 20, search = '') => {
  const offset = (page - 1) * limit;
  const searchPattern = search ? `%${search}%` : '%';

  const result = await pool.query(
    `SELECT * FROM companies
     WHERE tenant_id = $1 AND (name ILIKE $2 OR industry ILIKE $2)
     ORDER BY created_at DESC
     LIMIT $3 OFFSET $4`,
    [tenantId, searchPattern, limit, offset]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM companies WHERE tenant_id = $1 AND (name ILIKE $2 OR industry ILIKE $2)`,
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

export const getCompanyById = async (tenantId, companyId) => {
  const result = await pool.query(
    'SELECT * FROM companies WHERE id = $1 AND tenant_id = $2',
    [companyId, tenantId]
  );

  return result.rows[0];
};

export const updateCompany = async (tenantId, companyId, updateData) => {
  const fields = [];
  const values = [tenantId, companyId];
  let paramCount = 2;

  Object.entries(updateData).forEach(([key, value]) => {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    fields.push(`${dbKey} = $${paramCount + 1}`);
    values.push(value);
    paramCount++;
  });

  const query = `UPDATE companies SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
                 WHERE tenant_id = $1 AND id = $2
                 RETURNING *`;

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const deleteCompany = async (tenantId, companyId) => {
  const result = await pool.query(
    'DELETE FROM companies WHERE id = $1 AND tenant_id = $2 RETURNING id',
    [companyId, tenantId]
  );

  return result.rows[0];
};
