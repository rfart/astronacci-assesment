import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();
const categoryController = new CategoryController();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

// Protected routes (Admin/Editor)
router.post('/', 
  authenticateToken, 
  authorizeRole(['admin', 'editor']), 
  categoryController.createCategory
);

router.put('/:id', 
  authenticateToken, 
  authorizeRole(['admin', 'editor']), 
  categoryController.updateCategory
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRole(['admin']), 
  categoryController.deleteCategory
);

export default router;
