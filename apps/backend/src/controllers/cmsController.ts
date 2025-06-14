import { Request, Response, NextFunction } from 'express';
import { Article } from "../models/Article";
import { Video } from "../models/Video";
import { User } from "../models/User";
import { Category } from "../models/Category";

export class CMSController {
  // Get dashboard statistics
  public getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [
        totalArticles,
        totalVideos,
        totalUsers,
        totalCategories,
        publishedArticles,
        publishedVideos,
        recentArticles,
        recentVideos,
        topCategories
      ] = await Promise.all([
        Article.countDocuments(),
        Video.countDocuments(),
        User.countDocuments(),
        Category.countDocuments(),
        Article.countDocuments({ isPublished: true }),
        Video.countDocuments({ isPublished: true }),
        Article.find()
          .sort({ createdAt: -1 })
          .limit(5),
        Video.find()
          .sort({ createdAt: -1 })
          .limit(5),
        Category.aggregate([
          {
            $lookup: {
              from: 'articles',
              localField: '_id',
              foreignField: 'category',
              as: 'articles'
            }
          },
          {
            $lookup: {
              from: 'videos',
              localField: '_id',
              foreignField: 'category',
              as: 'videos'
            }
          },
          {
            $addFields: {
              totalContent: { $add: [{ $size: '$articles' }, { $size: '$videos' }] }
            }
          },
          {
            $sort: { totalContent: -1 }
          },
          {
            $limit: 5
          },
          {
            $project: {
              name: 1,
              totalContent: 1,
              articles: { $size: '$articles' },
              videos: { $size: '$videos' }
            }
          }
        ])
      ]);

      res.json({
        success: true,
        data: {
          statistics: {
            totalArticles,
            totalVideos,
            totalUsers,
            totalCategories,
            publishedArticles,
            publishedVideos,
          },
          recentContent: {
            articles: recentArticles,
            videos: recentVideos,
          },
          topCategories,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Get content analytics
  public getContentAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { period = '7' } = req.query;
      const days = parseInt(period as string);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [articleViews, videoViews, contentByDate] = await Promise.all([
        Article.aggregate([
          {
            $unwind: '$views'
          },
          {
            $match: {
              'views.viewedAt': { $gte: startDate }
            }
          },
          {
            $group: {
              _id: '$_id',
              title: { $first: '$title' },
              views: { $sum: 1 }
            }
          },
          {
            $sort: { views: -1 }
          },
          {
            $limit: 10
          }
        ]),
        Video.aggregate([
          {
            $unwind: '$views'
          },
          {
            $match: {
              'views.viewedAt': { $gte: startDate }
            }
          },
          {
            $group: {
              _id: '$_id',
              title: { $first: '$title' },
              views: { $sum: 1 }
            }
          },
          {
            $sort: { views: -1 }
          },
          {
            $limit: 10
          }
        ]),
        Article.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
              },
              articles: { $sum: 1 }
            }
          },
          {
            $sort: { _id: 1 }
          }
        ])
      ]);

      res.json({
        success: true,
        data: {
          topArticles: articleViews,
          topVideos: videoViews,
          contentCreationTrend: contentByDate,
          period: `${days} days`,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Bulk operations
  public bulkUpdateContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { type, ids, action, data } = req.body;

      if (!['article', 'video'].includes(type) || !Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid bulk operation parameters',
        });
        return;
      }

      const Model = type === 'article' ? Article : Video;
      let result;

      switch (action) {
        case 'publish':
          result = await Model.updateMany(
            { _id: { $in: ids } },
            { isPublished: true }
          );
          break;
        case 'unpublish':
          result = await Model.updateMany(
            { _id: { $in: ids } },
            { isPublished: false }
          );
          break;
        case 'delete':
          result = await (Model as any).deleteMany({ _id: { $in: ids } });
          break;
        case 'update':
          if (!data) {
            res.status(400).json({
              success: false,
              message: 'Update data is required',
            });
            return;
          }
          result = await Model.updateMany(
            { _id: { $in: ids } },
            data
          );
          break;
        default:
          res.status(400).json({
            success: false,
            message: 'Invalid action',
          });
          return;
      }

      res.json({
        success: true,
        data: result,
        message: `Bulk ${action} completed successfully`,
      });
    } catch (error) {
      next(error);
    }
  };
}
