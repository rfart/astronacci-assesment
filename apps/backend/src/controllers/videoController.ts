import { Request, Response, NextFunction } from 'express';
import Video from '../models/Video';
import { MembershipType } from '@astronacci/shared';
import { membershipLimits } from '@astronacci/shared';

export class VideoController {
  // Get all videos with membership filtering
  public getVideos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 10, category, search } = req.query;
      const user = req.user;

      // Build query
      const query: any = { isPublished: true };
      
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

      // Apply membership limits
      let videoLimit = membershipLimits[MembershipType.TYPE_A].videos;
      if (user) {
        const userMembership = user.membershipType || MembershipType.TYPE_A;
        videoLimit = membershipLimits[userMembership].videos;
      }

      const skip = (Number(page) - 1) * Number(limit);
      const queryLimit = videoLimit === -1 ? Number(limit) : Math.min(Number(limit), videoLimit - skip);

      if (queryLimit <= 0) {
        res.json({
          success: true,
          data: [],
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: 0,
            pages: 0,
          },
          message: 'Membership limit reached',
        });
        return;
      }

      const videos = await Video.find(query)
        .populate('category', 'name')
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(queryLimit);

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
  public getVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = req.user;

      const video = await Video.findById(id)
        .populate('category', 'name')
        .populate('author', 'name email');

      if (!video || !video.isPublished) {
        res.status(404).json({
          success: false,
          message: 'Video not found',
        });
        return;
      }

      // Check membership access
      if (user) {
        const userMembership = user.membershipType || MembershipType.TYPE_A;
        const limit = membershipLimits[userMembership].videos;
        
        if (limit !== -1) {
          // Check if user has viewed this many videos
          const viewedCount = await Video.countDocuments({
            _id: { $ne: id },
            'views.user': user.id,
          });

          if (viewedCount >= limit) {
            res.status(403).json({
              success: false,
              message: 'Membership limit reached. Please upgrade your membership.',
            });
            return;
          }
        }

        // Add view
        if (!video.views.some((view: any) => view.user.toString() === user.id)) {
          video.views.push({ user: user.id, viewedAt: new Date() });
          await video.save();
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
  public createVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const videoData = {
        ...req.body,
        author: req.user?.id,
      };

      const video = new Video(videoData);
      await video.save();

      const populatedVideo = await Video.findById(video._id)
        .populate('category', 'name')
        .populate('author', 'name email');

      res.status(201).json({
        success: true,
        data: populatedVideo,
        message: 'Video created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Update video
  public updateVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const video = await Video.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      ).populate('category', 'name').populate('author', 'name email');

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
  public deleteVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
