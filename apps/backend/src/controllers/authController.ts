import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from "../models/User";
import { MembershipTier, UserRole } from '@astronacci/shared';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface LoginRequest {
  email: string;
  password: string;
}

export class AuthController {
  // Generate JWT token
  private generateToken(userId: string): string {
    return jwt.sign({ userId: userId }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  }

  // OAuth success callback
  public handleOAuthSuccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as any;
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Authentication failed - no user found'
        });
        return;
      }

      if (!user._id) {
        res.status(401).json({
          success: false,
          error: 'Authentication failed - invalid user data'
        });
        return;
      }

      const token = this.generateToken(user._id);
      
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('OAuth success handler error:', error);
      res.status(500).json({
        success: false,
        error: 'Authentication processing failed'
      });
    }
  };

  // Get current user profile
  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await User.findById((req.user as any)?._id).select('-password');
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update user membership
  public updateMembership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { membershipTier } = req.body;
      
      if (!Object.values(MembershipTier).includes(membershipTier)) {
        res.status(400).json({
          success: false,
          message: 'Invalid membership type',
        });
        return;
      }

      const user = await User.findByIdAndUpdate(
        (req.user as any)?._id,
        { 
          membershipTier,
          membershipStartDate: new Date(),
        },
        { new: true }
      ).select('-password');

      res.json({
        success: true,
        data: user,
        message: 'Membership updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Logout user
  public logout = async (req: Request, res: Response): Promise<void> => {
    req.logout((err) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: 'Error logging out',
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    });
  };

  // Register with email and password
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password, role }: RegisterRequest = req.body;

      // Validation
      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Name, email, and password are required'
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
        return;
      }

      // Create new user
      const userData = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        socialProvider: 'local' as const,
        membershipTier: MembershipTier.TYPE_A,
        role: role || UserRole.USER,
        isActive: true
      };

      const user = new User(userData);
      await user.save();

      // Generate token
      const token = this.generateToken((user._id as any).toString());

      // Return user data without password
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: userResponse,
          token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      next(error);
    }
  };

  // Register admin with email and password (special endpoint)
  public registerAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password, adminSecret }: RegisterRequest & { adminSecret: string } = req.body;

      // Check admin secret (simple protection mechanism)
      const requiredAdminSecret = process.env.ADMIN_REGISTRATION_SECRET || 'astronacci-admin-2024';
      if (adminSecret !== requiredAdminSecret) {
        res.status(403).json({
          success: false,
          message: 'Invalid admin registration secret'
        });
        return;
      }

      // Validation
      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Name, email, and password are required'
        });
        return;
      }

      if (password.length < 8) {
        res.status(400).json({
          success: false,
          message: 'Admin password must be at least 8 characters long'
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
        return;
      }

      // Create new admin user with unique socialId for local admin
      const adminData = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        socialProvider: 'local' as const,
        // Don't set socialId for local users to avoid index conflicts
        membershipTier: MembershipTier.TYPE_C, // Admin gets unlimited access
        role: UserRole.ADMIN,
        isActive: true
      };

      const adminUser = new User(adminData);
      await adminUser.save();

      // Generate token
      const token = this.generateToken((adminUser._id as any).toString());

      // Return user data without password
      const userResponse = adminUser.toJSON();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        message: 'Admin user registered successfully',
        data: {
          user: userResponse,
          token
        }
      });
    } catch (error) {
      console.error('Admin registration error:', error);
      next(error);
    }
  };

  // Login with email and password
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password }: LoginRequest = req.body;

      // Validation
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      // Find user by email
      const user = await User.findOne({ 
        email: email.toLowerCase(),
        socialProvider: 'local',
        isActive: true
      });

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      // Generate token
      const token = this.generateToken((user._id as any).toString());

      // Return user data without password
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      next(error);
    }
  };

  // Link Google account to existing local account or login with Google
  public linkOrLoginWithGoogle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const googleUser = req.user as any;
      
      if (!googleUser) {
        res.status(401).json({
          success: false,
          error: 'Google authentication failed - no user found'
        });
        return;
      }

      // Try to find existing local account with same email
      const existingLocalUser = await User.findOne({ 
        email: googleUser.email,
        socialProvider: 'local'
      });

      let user;
      
      if (existingLocalUser) {
        // Link Google account to existing local user
        existingLocalUser.socialId = googleUser.socialId;
        // Don't change socialProvider, keep it as 'local' for primary auth
        await existingLocalUser.save();
        user = existingLocalUser;
      } else {
        // Use the Google user created by passport
        user = googleUser;
      }

      const token = this.generateToken((user._id as any).toString());
      
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&linked=${existingLocalUser ? 'true' : 'false'}`);
    } catch (error) {
      console.error('Google link/login error:', error);
      res.status(500).json({
        success: false,
        error: 'Authentication processing failed'
      });
    }
  };
}
