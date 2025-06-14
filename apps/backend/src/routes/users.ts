import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, editor, admin]
 *         description: Filter by role
 *       - in: query
 *         name: membershipType
 *         schema:
 *           type: string
 *           enum: [TYPE_A, TYPE_B, TYPE_C]
 *         description: Filter by membership type
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
// Protected routes (Admin only)
router.get('/', 
  authenticateToken, 
  authorizeRole(['admin']), 
  userController.getUsers
);

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Get user statistics (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: number
 *                     activeUsers:
 *                       type: number
 *                     usersByRole:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: number
 *                         editor:
 *                           type: number
 *                         admin:
 *                           type: number
 *                     usersByMembership:
 *                       type: object
 *                       properties:
 *                         TYPE_A:
 *                           type: number
 *                         TYPE_B:
 *                           type: number
 *                         TYPE_C:
 *                           type: number
 *                     newUsersThisMonth:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/stats', 
  authenticateToken, 
  authorizeRole(['admin']), 
  userController.getUserStatsAdmin
);

/**
 * @swagger
 * /api/users/my-stats:
 *   get:
 *     summary: Get current user's creation stats and limits
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         membershipTier:
 *                           type: string
 *                         role:
 *                           type: string
 *                     created:
 *                       type: object
 *                       properties:
 *                         articles:
 *                           type: number
 *                         videos:
 *                           type: number
 *                     limits:
 *                       type: object
 *                       properties:
 *                         articles:
 *                           type: number
 *                         videos:
 *                           type: number
 *                     remaining:
 *                       type: object
 *                       properties:
 *                         articles:
 *                           type: number
 *                         videos:
 *                           type: number
 *                     canCreateMore:
 *                       type: object
 *                       properties:
 *                         articles:
 *                           type: boolean
 *                         videos:
 *                           type: boolean
 *       401:
 *         description: Unauthorized
 */
router.get('/my-stats', 
  authenticateToken, 
  userController.getMyStats
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: User not found
 */
router.get('/:id', 
  authenticateToken, 
  authorizeRole(['admin']), 
  userController.getUser
);

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     summary: Update user role (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, editor, admin]
 *                 description: New user role
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid role
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: User not found
 */
router.put('/:id/role', 
  authenticateToken, 
  authorizeRole(['admin']), 
  userController.updateUserRole
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: User not found
 */
router.delete('/:id', 
  authenticateToken, 
  authorizeRole(['admin']), 
  userController.deleteUser
);

export default router;
