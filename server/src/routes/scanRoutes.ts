import { Router } from 'express';
import { query } from '../db';
import { authenticate, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const result = await query(
      'SELECT id, url, normalized_url, hostname, trust_score, risk_level, created_at FROM scans WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user?.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Fetch scans error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM scans WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Scan not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Fetch scan error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM scans WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user?.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Scan not found' });
    }
    
    res.json({ success: true, message: 'Scan deleted' });
  } catch (error) {
    console.error('Delete scan error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
