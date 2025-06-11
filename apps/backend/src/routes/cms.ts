import { Router } from 'express';
import { CMSController } from '../controllers/cmsController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();
const cmsController = new CMSController();

// All CMS routes require admin or editor role
router.get('/dashboard', 
  authenticateToken, 
  authorizeRole(['admin', 'editor']), 
  cmsController.getDashboardStats
);

router.get('/analytics', 
  authenticateToken, 
  authorizeRole(['admin', 'editor']), 
  cmsController.getContentAnalytics
);

router.post('/bulk', 
  authenticateToken, 
  authorizeRole(['admin', 'editor']), 
  cmsController.bulkUpdateContent
);

export default router;
