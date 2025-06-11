import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// Protected routes (Admin only)
router.get('/', 
  authenticateToken, 
  authorizeRole(['admin']), 
  userController.getUsers
);

router.get('/stats', 
  authenticateToken, 
  authorizeRole(['admin']), 
  userController.getUserStats
);

router.get('/:id', 
  authenticateToken, 
  authorizeRole(['admin']), 
  userController.getUser
);

router.put('/:id/role', 
  authenticateToken, 
  authorizeRole(['admin']), 
  userController.updateUserRole
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRole(['admin']), 
  userController.deleteUser
);

export default router;
