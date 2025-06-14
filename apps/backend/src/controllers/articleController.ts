import { Request, Response, NextFunction } from 'express';
import { Article } from "../models/Article";
import { MembershipTier, MEMBERSHIP_LIMITS } from '@astronacci/shared';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export class ArticleController {
  // Helper method to build search query
  private buildQuery(category?: string, search?: string): any {
    const query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    return query;
  }

  // Get all articles - no membership filtering on listings
  public getArticles = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 10, category, search } = req.query;
      const user = req.user;

      const query = this.buildQuery(category as string, search as string);
      const totalAvailable = await Article.countDocuments(query);
      
      const skip = (Number(page) - 1) * Number(limit);
      const articles = await Article.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const response: any = {
        success: true,
        data: articles,
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
        const dailyLimit = MEMBERSHIP_LIMITS[userMembership].articles;
        const todayUsage = user.getTodayAccess('article');
        
        response.membershipStatus = {
          tier: userMembership,
          dailyLimit: dailyLimit === -1 ? 'unlimited' : dailyLimit,
          dailyUsed: todayUsage,
          dailyRemaining: dailyLimit === -1 ? 'unlimited' : Math.max(0, dailyLimit - todayUsage),
          message: dailyLimit === -1 
            ? 'Unlimited article access' 
            : `${todayUsage}/${dailyLimit} daily articles accessed`
        };
      }

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  // Get single article with daily limit checking
  public getArticle = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = req.user;

      const article = await Article.findById(id);

      if (!article) {
        res.status(404).json({
          success: false,
          message: 'Article not found',
        });
        return;
      }

      // Check daily access limit for non-admin users
      if (user && user.role !== 'admin') {
        const accessCheck = user.canAccessContentDetail('article', id);
        
        if (!accessCheck.canAccess) {
          res.status(403).json({
            success: false,
            message: accessCheck.reason,
            code: 'DAILY_LIMIT_REACHED'
          });
          return;
        }

        // Record the access (only counts if it's the first time today)
        await user.recordContentAccess('article', id);
      }

      res.json({
        success: true,
        data: article,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create article (Admin/CMS)
  public createArticle = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const articleData = {
        ...req.body,
        author: req.user?._id?.toString() ?? req.user?.name ?? 'Unknown',
      };

      const article = new Article(articleData);
      await article.save();

      res.status(201).json({
        success: true,
        data: article,
        message: 'Article created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Update article
  public updateArticle = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const article = await Article.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!article) {
        res.status(404).json({
          success: false,
          message: 'Article not found',
        });
        return;
      }

      res.json({
        success: true,
        data: article,
        message: 'Article updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete article
  public deleteArticle = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const article = await Article.findByIdAndDelete(id);

      if (!article) {
        res.status(404).json({
          success: false,
          message: 'Article not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Article deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const articleController = new ArticleController();
