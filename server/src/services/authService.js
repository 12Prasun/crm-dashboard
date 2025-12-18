import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db.js';
import { generateToken } from '../auth.js';

export const registerUser = async (tenantName, email, password, firstName, lastName) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create tenant
    const tenantId = uuidv4();
    const tenantResult = await client.query(
      'INSERT INTO tenants (id, name, domain) VALUES ($1, $2, $3) RETURNING *',
      [tenantId, tenantName, tenantName.toLowerCase().replace(/\s+/g, '-')]
    );

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    const userResult = await client.query(
      `INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5, $6, 'admin')
       RETURNING id, tenant_id, email, first_name, last_name, role`,
      [userId, tenantId, email, hashedPassword, firstName, lastName]
    );

    const user = userResult.rows[0];
    const token = generateToken({ userId: user.id, tenantId: user.tenant_id, email: user.email });

    await client.query('COMMIT');

    return { user, token };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const loginUser = async (email, password) => {
  const result = await pool.query(
    `SELECT id, tenant_id, email, password_hash, first_name, last_name, is_active
     FROM users WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];

  if (!user.is_active) {
    throw new Error('User account is disabled');
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({
    userId: user.id,
    tenantId: user.tenant_id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
    },
    token,
  };
};

export const getUserById = async (userId, tenantId) => {
  const result = await pool.query(
    `SELECT id, tenant_id, email, first_name, last_name, role, is_active
     FROM users WHERE id = $1 AND tenant_id = $2`,
    [userId, tenantId]
  );

  return result.rows[0];
};
