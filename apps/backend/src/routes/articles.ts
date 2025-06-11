import { Router } from 'express';
import { ArticleController } from '../controllers/articleController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();
const articleController = new ArticleController();

// Public routes
router.get('/', articleController.getArticles);
router.get('/:id', articleController.getArticle);

// Protected routes (Admin/CMS)
router.post('/', 
  authenticateToken, 
  authorizeRole(['admin', 'editor']), 
  articleController.createArticle
);

router.put('/:id', 
  authenticateToken, 
  authorizeRole(['admin', 'editor']), 
  articleController.updateArticle
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRole(['admin']), 
  articleController.deleteArticle
);

export default router;
