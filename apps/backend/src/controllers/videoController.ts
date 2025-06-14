import { Request, Response, NextFunction } from 'express';
import { Video } from '../models/Video';
import { MembershipTier, MEMBERSHIP_LIMITS } from '@astronacci/shared';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export class VideoController {
  // Get all videos with membership filtering
  public getVideos = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 10, category, search } = req.query;
      const user = req.user;

      // Build query
      const query: any = {};
      
      if (category) {
        query.category = category;
      }
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search as string, 'i')] } }
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);

      const videos = await Video.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Video.countDocuments(query);

      res.json({
        success: true,
        data: videos,
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

  // Get single video
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

      // Check membership access
      if (user) {
        const userMembership = (user.membershipTier as MembershipTier) ?? MembershipTier.TYPE_A;
        const limit = MEMBERSHIP_LIMITS[userMembership].videos;
        
        if (limit !== -1 && user.videosWatched >= limit) {
          res.status(403).json({
            success: false,
            message: 'Membership limit reached. Please upgrade your membership.',
          });
          return;
        }

        // Increment user's videos watched count if they can access content
        if (user.canAccessContent?.('video')) {
          await user.incrementUsage('video');
        }
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
      const videoData = {
        ...req.body,
        author: (req.user as any)?._id?.toString() ?? (req.user as any)?.name ?? 'Unknown',
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
