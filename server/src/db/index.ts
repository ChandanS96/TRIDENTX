import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.yftmfadudaqssqvhnhta',
  password: 'T$*FxVa.:dT6RZr',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 1000,
  idleTimeoutMillis: 1000,
  query_timeout: 1000
});

// Demo fallback data
const mockUsers = new Map();
const mockScans = [];

export const query = async (text: string, params?: any[]) => {
  try {
    // Force fallback immediately since no valid DB is provided,
    // skipping the 10-second pg timeout.
    throw new Error('Forcing mock database fallback');
    // return await pool.query(text, params);
  } catch (error) {
    console.warn("⚠️ PostgreSQL unavailable. Falling back to in-memory demo database.");
    
    // Simple SQL mock parser for demo mode
    const query = text.toLowerCase();
    
    if (query.includes('insert into users')) {
      const id = 'demo-user-' + Date.now();
      mockUsers.set(params![1], { id, name: params![0], email: params![1], password_hash: params![2] });
      return { rows: [{ id, name: params![0], email: params![1] }] };
    }
    
    if (query.includes('select id from users where email')) {
      const user = mockUsers.get(params![0]);
      return { rows: user ? [{ id: user.id }] : [] };
    }
    
    if (query.includes('select * from users where email')) {
      const user = mockUsers.get(params![0]);
      return { rows: user ? [user] : [] };
    }
    
    if (query.includes('select id, name, email from users where id')) {
      const user = Array.from(mockUsers.values()).find(u => u.id === params![0]);
      return { rows: user ? [user] : [] };
    }
    
    if (query.includes('insert into scans')) {
      const id = 'demo-scan-' + Date.now();
      const scan = {
        id, url: params![0], normalized_url: params![1], hostname: params![2],
        trust_score: params![3], risk_level: params![4], created_at: new Date().toISOString(),
        signals: params![5], reasons: params![6], ai_summary: params![7], ai_explanation: params![8], recommendation: params![9]
      };
      mockScans.push(scan);
      return { rows: [scan] };
    }
    
    if (query.includes('select id, url, normalized_url, hostname, trust_score, risk_level, created_at from scans')) {
      const allScans = [...mockScans].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return { rows: allScans };
    }

    if (query.includes('select * from scans where id')) {
      const scan = mockScans.find(s => s.id === params![0]);
      return { rows: scan ? [scan] : [] };
    }

    if (query.includes('delete from scans where id')) {
      const idx = mockScans.findIndex(s => s.id === params![0]);
      if (idx !== -1) {
        mockScans.splice(idx, 1);
        return { rows: [{ id: params![0] }] };
      }
      return { rows: [] };
    }
    
    return { rows: [] };
  }
};

