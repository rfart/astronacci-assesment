import { Request, Response, NextFunction } from 'express';
import { Article } from "../models/Article";
import { MembershipTier, MEMBERSHIP_LIMITS } from '@astronacci/shared';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export class ArticleController {
  // Get all articles with membership filtering
  public getArticles = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
          { content: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search as string, 'i')] } }
        ];
      }

      // Apply membership limits
      let articleLimit = MEMBERSHIP_LIMITS[MembershipTier.TYPE_A].articles;
      if (user) {
        const userMembership = (user.membershipTier as MembershipTier) ?? MembershipTier.TYPE_A;
        articleLimit = MEMBERSHIP_LIMITS[userMembership].articles;
      }

      const skip = (Number(page) - 1) * Number(limit);
      const queryLimit = articleLimit === -1 ? Number(limit) : Math.min(Number(limit), articleLimit - skip);

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

      const articles = await Article.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(queryLimit);

      const total = await Article.countDocuments(query);

      res.json({
        success: true,
        data: articles,
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

  // Get single article
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

      // Check membership access
      if (user) {
        const userMembership = (user.membershipTier as MembershipTier) ?? MembershipTier.TYPE_A;
        const limit = MEMBERSHIP_LIMITS[userMembership].articles;
        
        if (limit !== -1 && user.articlesRead >= limit) {
          res.status(403).json({
            success: false,
            message: 'Membership limit reached. Please upgrade your membership.',
          });
          return;
        }

        // Increment user's articles read count if they can access content
        if (user.canAccessContent?.('article')) {
          await user.incrementUsage('article');
        }
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
