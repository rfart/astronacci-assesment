import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth authentication
 *     tags: [Authentication]
 *     description: Redirects to Google OAuth consent screen
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */
// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     tags: [Authentication]
 *     description: Processes Google OAuth callback and returns JWT token
 *     responses:
 *       302:
 *         description: Redirect to frontend with JWT token
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/api/auth/failure',
    session: false 
  }),
  authController.handleOAuthSuccess
);

/**
 * @swagger
 * /api/auth/facebook:
 *   get:
 *     summary: Initiate Facebook OAuth authentication
 *     tags: [Authentication]
 *     description: Redirects to Facebook OAuth consent screen
 *     responses:
 *       302:
 *         description: Redirect to Facebook OAuth
 */
// Facebook OAuth routes
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

/**
 * @swagger
 * /api/auth/facebook/callback:
 *   get:
 *     summary: Handle Facebook OAuth callback
 *     tags: [Authentication]
 *     description: Processes Facebook OAuth callback and returns JWT token
 *     responses:
 *       302:
 *         description: Redirect to frontend with JWT token
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/facebook/callback',
  passport.authenticate('facebook', { 
    failureRedirect: '/api/auth/failure',
    session: false 
  }),
  authController.handleOAuthSuccess
);

/**
 * @swagger
 * /api/auth/failure:
 *   get:
 *     summary: Authentication failure endpoint
 *     tags: [Authentication]
 *     description: Returns error when OAuth authentication fails
 *     responses:
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Auth failure route
router.get('/failure', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Authentication failed',
  });
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);

/**
 * @swagger
 * /api/auth/membership:
 *   put:
 *     summary: Update user membership tier
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - membershipType
 *             properties:
 *               membershipType:
 *                 type: string
 *                 enum: [TYPE_A, TYPE_B, TYPE_C]
 *                 description: New membership tier
 *     responses:
 *       200:
 *         description: Membership updated successfully
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
 *         description: Invalid membership type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/membership', authenticateToken, authController.updateMembership);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
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
 *                   example: "Logout successful"
 */
router.post('/logout', authController.logout);

export default router;
