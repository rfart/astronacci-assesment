import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  authController.handleOAuthSuccess
);

// Facebook OAuth routes
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/failure' }),
  authController.handleOAuthSuccess
);

// Auth failure route
router.get('/failure', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Authentication failed',
  });
});

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/membership', authenticateToken, authController.updateMembership);
router.post('/logout', authController.logout);

export default router;
