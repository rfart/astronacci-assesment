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

  // Helper method to calculate membership limits
  private calculateMembershipLimits(user: any, totalAvailable: number, page: number, limit: number) {
    if (!user || user.role === 'admin') {
      return { effectiveLimit: limit, hasMoreContent: false, membershipMessage: null };
    }

    const userMembership = (user.membershipTier as MembershipTier) ?? MembershipTier.TYPE_A;
    const membershipLimit = MEMBERSHIP_LIMITS[userMembership].videos;
    
    if (membershipLimit === -1) {
      return { effectiveLimit: limit, hasMoreContent: false, membershipMessage: null };
    }

    // For listing, limit the number of videos they can see based on their tier
    const requestedStart = (page - 1) * limit;
    
    // If requesting beyond their membership limit
    if (requestedStart >= membershipLimit) {
      return { 
        effectiveLimit: 0, 
        hasReachedLimit: true,
        membershipLimit,
        used: user.videosWatched,
        totalAvailable 
      };
    }
    
    // Calculate how many videos they can see on this page
    const remainingInLimit = membershipLimit - requestedStart;
    const effectiveLimit = Math.min(limit, remainingInLimit);
    
    const hasMoreContent = totalAvailable > membershipLimit;
    const membershipMessage = hasMoreContent 
      ? `You can access ${membershipLimit} videos with ${userMembership} membership. More videos available with upgrade.`
      : null;
    
    return { effectiveLimit, hasMoreContent, membershipMessage, membershipLimit, used: user.videosWatched };
  }

  // Get all videos with membership filtering
  public getVideos = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 10, category, search } = req.query;
      const user = req.user;

      const query = this.buildQuery(category as string, search as string);
      const totalAvailable = await Video.countDocuments(query);
      
      const limitResult = this.calculateMembershipLimits(user, totalAvailable, Number(page), Number(limit));
      
      // Handle case where user has reached limit
      if ('hasReachedLimit' in limitResult) {
        const userMembership = (user.membershipTier as MembershipTier) ?? MembershipTier.TYPE_A;
        res.json({
          success: true,
          data: [],
          pagination: { page: Number(page), limit: Number(limit), total: 0, pages: 0 },
          membershipLimit: {
            hasReachedLimit: true,
            limit: limitResult.membershipLimit,
            used: limitResult.used,
            totalAvailable: limitResult.totalAvailable,
            message: `You have reached your ${limitResult.membershipLimit}-video limit for ${userMembership} membership. Upgrade to access more content.`
          }
        });
        return;
      }

      const skip = (Number(page) - 1) * Number(limit);
      const videos = await Video.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limitResult.effectiveLimit);

      // Calculate pagination total
      let paginationTotal = totalAvailable;
      if (user && user.role !== 'admin') {
        const userMembership = (user.membershipTier as MembershipTier) ?? MembershipTier.TYPE_A;
        const membershipLimit = MEMBERSHIP_LIMITS[userMembership].videos;
        if (membershipLimit !== -1) {
          paginationTotal = Math.min(totalAvailable, membershipLimit);
        }
      }

      const response: any = {
        success: true,
        data: videos,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: paginationTotal,
          pages: Math.ceil(paginationTotal / Number(limit)),
        },
      };

      // Add membership info if needed
      if (user && user.role !== 'admin' && (limitResult.hasMoreContent || limitResult.membershipMessage)) {
        const userMembership = (user.membershipTier as MembershipTier) ?? MembershipTier.TYPE_A;
        const membershipLimit = MEMBERSHIP_LIMITS[userMembership].videos;
        
        response.membershipLimit = {
          hasReachedLimit: false,
          limit: membershipLimit,
          used: user.videosWatched,
          totalAvailable,
          hasMoreContent: limitResult.hasMoreContent,
          message: limitResult.membershipMessage
        };
      }

      res.json(response);
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
