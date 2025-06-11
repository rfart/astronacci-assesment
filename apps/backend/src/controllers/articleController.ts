import { Request, Response, NextFunction } from 'express';
import Article from '../models/Article';
import { MembershipType, ContentType } from '@astronacci/shared';
import { membershipLimits } from '@astronacci/shared';

export class ArticleController {
  // Get all articles with membership filtering
  public getArticles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
          { content: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search as string, 'i')] } }
        ];
      }

      // Apply membership limits
      let articleLimit = membershipLimits[MembershipType.TYPE_A].articles;
      if (user) {
        const userMembership = user.membershipType || MembershipType.TYPE_A;
        articleLimit = membershipLimits[userMembership].articles;
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
        .populate('category', 'name')
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(queryLimit)
        .select(user ? undefined : '-content'); // Hide content for non-authenticated users

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
  public getArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = req.user;

      const article = await Article.findById(id)
        .populate('category', 'name')
        .populate('author', 'name email');

      if (!article || !article.isPublished) {
        res.status(404).json({
          success: false,
          message: 'Article not found',
        });
        return;
      }

      // Check membership access
      if (user) {
        const userMembership = user.membershipType || MembershipType.TYPE_A;
        const limit = membershipLimits[userMembership].articles;
        
        if (limit !== -1) {
          // Check if user has viewed this many articles
          const viewedCount = await Article.countDocuments({
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
        if (!article.views.some((view: any) => view.user.toString() === user.id)) {
          article.views.push({ user: user.id, viewedAt: new Date() });
          await article.save();
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
  public createArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const articleData = {
        ...req.body,
        author: req.user?.id,
      };

      const article = new Article(articleData);
      await article.save();

      const populatedArticle = await Article.findById(article._id)
        .populate('category', 'name')
        .populate('author', 'name email');

      res.status(201).json({
        success: true,
        data: populatedArticle,
        message: 'Article created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Update article
  public updateArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const article = await Article.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      ).populate('category', 'name').populate('author', 'name email');

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
  public deleteArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
