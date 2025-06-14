import { Request, Response, NextFunction } from 'express';
import { Video } from '../models/Video';
import { MembershipTier, MEMBERSHIP_LIMITS } from '@astronacci/shared';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export class VideoController {
  // Helper method to build search query
  private buildQuery(category?: string, search?: string): any {
    const query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    return query;
  }

  // Get all videos - no membership filtering on listings
  public getVideos = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 10, category, search } = req.query;
      const user = req.user;

      const query = this.buildQuery(category as string, search as string);
      const totalAvailable = await Video.countDocuments(query);
      
      const skip = (Number(page) - 1) * Number(limit);
      const videos = await Video.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const response: any = {
        success: true,
        data: videos,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalAvailable,
          pages: Math.ceil(totalAvailable / Number(limit)),
        },
      };

      // Add membership status info for frontend display
      if (user && user.role !== 'admin') {
        const userMembership = (user.membershipTier as MembershipTier) ?? MembershipTier.TYPE_A;
        const dailyLimit = MEMBERSHIP_LIMITS[userMembership].videos;
        const todayUsage = user.getTodayAccess('video');
        
        response.membershipStatus = {
          tier: userMembership,
          dailyLimit: dailyLimit === -1 ? 'unlimited' : dailyLimit,
          dailyUsed: todayUsage,
          dailyRemaining: dailyLimit === -1 ? 'unlimited' : Math.max(0, dailyLimit - todayUsage),
          message: dailyLimit === -1 
            ? 'Unlimited video access' 
            : `${todayUsage}/${dailyLimit} daily videos accessed`
        };
      }

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  // Get single video with daily limit checking
  public getVideo = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = req.user;

      const video = await Video.findById(id);

      if (!video) {
        res.status(404).json({
          success: false,
          message: 'Video not found',
        });
        return;
      }

      // Check daily access limit for non-admin users
      if (user && user.role !== 'admin') {
        const accessCheck = user.canAccessContentDetail('video', id);
        
        if (!accessCheck.canAccess) {
          res.status(403).json({
            success: false,
            message: accessCheck.reason,
            code: 'DAILY_LIMIT_REACHED'
          });
          return;
        }

        // Record the access (only counts if it's the first time today)
        await user.recordContentAccess('video', id);
      }

      res.json({
        success: true,
        data: video,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create video (Admin/CMS)
  public createVideo = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      const videoData = {
        ...req.body,
        author: user?._id?.toString() ?? user?.name ?? 'Unknown',
      };

      const video = new Video(videoData);
      await video.save();

      res.status(201).json({
        success: true,
        data: video,
        message: 'Video created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Update video
  public updateVideo = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const video = await Video.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!video) {
        res.status(404).json({
          success: false,
          message: 'Video not found',
        });
        return;
      }

      res.json({
        success: true,
        data: video,
        message: 'Video updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete video
  public deleteVideo = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const video = await Video.findByIdAndDelete(id);

      if (!video) {
        res.status(404).json({
          success: false,
          message: 'Video not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Video deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const videoController = new VideoController();
