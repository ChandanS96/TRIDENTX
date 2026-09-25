import { Router } from 'express';
import { analyzeWebsite } from '../controllers/analyzeController';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_replace_me';

// Optional auth middleware to attach user if logged in
const optionalAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      req.user = { id: decoded.id };
    } catch (error) {
      // ignore invalid token for optional auth
    }
  }
  next();
};

router.post('/', optionalAuth, analyzeWebsite);

export default router;
