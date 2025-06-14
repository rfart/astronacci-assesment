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

  // Helper method to calculate membership limits
  private calculateMembershipLimits(user: any, totalAvailable: number, page: number, limit: number) {
    if (!user || user.role === 'admin') {
      return { effectiveLimit: limit, hasMoreContent: false, membershipMessage: null };
    }

    const userMembership = (user.membershipTier as MembershipTier) ?? MembershipTier.TYPE_A;
    const membershipLimit = MEMBERSHIP_LIMITS[userMembership].articles;
    
    if (membershipLimit === -1) {
      return { effectiveLimit: limit, hasMoreContent: false, membershipMessage: null };
    }

    // For listing, limit the number of articles they can see based on their tier
    const requestedStart = (page - 1) * limit;
    
    // If requesting beyond their membership limit
    if (requestedStart >= membershipLimit) {
      return { 
        effectiveLimit: 0, 
        hasReachedLimit: true,
        membershipLimit,
        used: user.articlesRead,
        totalAvailable 
      };
    }
    
    // Calculate how many articles they can see on this page
    const remainingInLimit = membershipLimit - requestedStart;
    const effectiveLimit = Math.min(limit, remainingInLimit);
    
    const hasMoreContent = totalAvailable > membershipLimit;
    const membershipMessage = hasMoreContent 
      ? `You can access ${membershipLimit} articles with ${userMembership} membership. ${totalAvailable - membershipLimit} more articles available with upgrade.`
      : null;
    
    return { effectiveLimit, hasMoreContent, membershipMessage, membershipLimit, used: user.articlesRead };
  }

  // Get all articles with membership filtering
  public getArticles = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 10, category, search } = req.query;
      const user = req.user;

      const query = this.buildQuery(category as string, search as string);
      const totalAvailable = await Article.countDocuments(query);
      
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
            message: `You have reached your ${limitResult.membershipLimit}-article limit for ${userMembership} membership. Upgrade to access more content.`
          }
        });
        return;
      }

      const skip = (Number(page) - 1) * Number(limit);
      const articles = await Article.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limitResult.effectiveLimit);

      // Calculate pagination total
      let paginationTotal = totalAvailable;
      if (user && user.role !== 'admin') {
        const userMembership = (user.membershipTier as MembershipTier) ?? MembershipTier.TYPE_A;
        const membershipLimit = MEMBERSHIP_LIMITS[userMembership].articles;
        if (membershipLimit !== -1) {
          paginationTotal = Math.min(totalAvailable, membershipLimit);
        }
      }

      const response: any = {
        success: true,
        data: articles,
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
        const membershipLimit = MEMBERSHIP_LIMITS[userMembership].articles;
        
        response.membershipLimit = {
          hasReachedLimit: false,
          limit: membershipLimit,
          used: user.articlesRead,
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
