import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { MembershipType } from '@astronacci/shared';

export class AuthController {
  // Generate JWT token
  private generateToken(userId: string): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  }

  // OAuth success callback
  public handleOAuthSuccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as any;
      const token = this.generateToken(user._id);
      
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
      next(error);
    }
  };

  // Get current user profile
  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await User.findById(req.user?.id).select('-password');
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
      const { membershipType } = req.body;
      
      if (!Object.values(MembershipType).includes(membershipType)) {
        res.status(400).json({
          success: false,
          message: 'Invalid membership type',
        });
        return;
      }

      const user = await User.findByIdAndUpdate(
        req.user?.id,
        { 
          membershipType,
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
}
