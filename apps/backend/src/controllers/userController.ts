import { Request, Response, NextFunction } from 'express';
import { User } from "../models/User";

export class UserController {
  // Get all users (Admin only)
  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 10, search, membershipTier } = req.query;

      // Build query
      const query: any = {};
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (membershipTier) {
        query.membershipTier = membershipTier;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Get single user
  public getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const user = await User.findById(id).select('-password');

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

  // Update user role (Admin only)
  public updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { role } = req.body;

      const validRoles = ['user', 'editor', 'admin'];
      if (!validRoles.includes(role)) {
        res.status(400).json({
          success: false,
          message: 'Invalid role. Must be: user, editor, or admin'
        });
        return;
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      user.role = role;
      await user.save();

      res.json({
        success: true,
        message: `User role updated to ${role}`,
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          membershipTier: user.membershipTier
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete user (Admin only)
  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const user = await User.findByIdAndDelete(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Get user stats (Admin only)
  public getUserStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const totalUsers = await User.countDocuments();
      const membershipStats = await User.aggregate([
        {
          $group: {
            _id: '$membershipTier',
            count: { $sum: 1 }
          }
        }
      ]);

      const roleStats = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      res.json({
        success: true,
        data: {
          totalUsers,
          membershipStats,
          roleStats,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
