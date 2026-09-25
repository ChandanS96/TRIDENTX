import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.yftmfadudaqssqvhnhta',
  password: 'T$*FxVa.:dT6RZr',
  ssl: { rejectUnauthorized: false }
});

// Demo fallback data
const mockUsers = new Map();
const mockScans = [];

export const query = async (text: string, params?: any[]) => {
  try {
    return await pool.query(text, params);
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
        id, user_id: params![0], url: params![1], normalized_url: params![2], hostname: params![3],
        trust_score: params![4], risk_level: params![5], created_at: new Date().toISOString()
      };
      mockScans.push(scan);
      return { rows: [scan] };
    }
    
    if (query.includes('select id, url, normalized_url, hostname, trust_score, risk_level, created_at from scans')) {
      const userScans = mockScans.filter(s => s.user_id === params![0]).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return { rows: userScans };
    }
    
    return { rows: [] };
  }
};

