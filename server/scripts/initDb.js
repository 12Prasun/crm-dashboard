import pool from '../src/db.js';
import dotenv from 'dotenv';

dotenv.config();

const createTables = async () => {
  const client = await pool.connect();

  try {
    console.log('🔄 Creating database tables...');

    // Create tenants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tenants table created');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tenant_id, email)
      );
    `);
    console.log('✅ Users table created');

    // Create companies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        industry VARCHAR(100),
        website VARCHAR(255),
        phone VARCHAR(20),
        email VARCHAR(255),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        postal_code VARCHAR(20),
        employee_count INT,
        annual_revenue DECIMAL(15, 2),
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Companies table created');

    // Create contacts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        job_title VARCHAR(100),
        department VARCHAR(100),
        is_primary_contact BOOLEAN DEFAULT false,
        notes TEXT,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Contacts table created');

    // Create deals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS deals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        value DECIMAL(15, 2),
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(50) DEFAULT 'open',
        probability INT DEFAULT 0,
        expected_close_date DATE,
        owner_id UUID REFERENCES users(id),
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Deals table created');

    // Create activities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        entity_type VARCHAR(50),
        entity_id UUID,
        activity_type VARCHAR(50),
        description TEXT,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Activities table created');

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_companies_tenant_id ON companies(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_contacts_tenant_id ON contacts(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON contacts(company_id);
      CREATE INDEX IF NOT EXISTS idx_deals_tenant_id ON deals(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_deals_company_id ON deals(company_id);
      CREATE INDEX IF NOT EXISTS idx_activities_tenant_id ON activities(tenant_id);
    `);
    console.log('✅ Indexes created');

    console.log('✨ Database setup complete!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

createTables();
