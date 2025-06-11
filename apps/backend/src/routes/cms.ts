import { Router } from 'express';
import { CMSController } from '../controllers/cmsController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();
const cmsController = new CMSController();

/**
 * @swagger
 * /api/cms/dashboard:
 *   get:
 *     summary: Get CMS dashboard statistics
 *     tags: [CMS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalArticles:
 *                       type: number
 *                       description: Total number of articles
 *                     totalVideos:
 *                       type: number
 *                       description: Total number of videos
 *                     totalUsers:
 *                       type: number
 *                       description: Total number of users
 *                     totalCategories:
 *                       type: number
 *                       description: Total number of categories
 *                     publishedArticles:
 *                       type: number
 *                       description: Number of published articles
 *                     publishedVideos:
 *                       type: number
 *                       description: Number of published videos
 *                     newUsersToday:
 *                       type: number
 *                       description: New users registered today
 *                     newContentToday:
 *                       type: number
 *                       description: New content created today
 *                     popularContent:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           type:
 *                             type: string
 *                             enum: [article, video]
 *                           viewCount:
 *                             type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Editor only
 */
// All CMS routes require admin or editor role
router.get('/dashboard', 
  authenticateToken, 
  authorizeRole(['admin', 'editor']), 
  cmsController.getDashboardStats
);

/**
 * @swagger
 * /api/cms/analytics:
 *   get:
 *     summary: Get content analytics
 *     tags: [CMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics (YYYY-MM-DD)
 *       - in: query
 *         name: contentType
 *         schema:
 *           type: string
 *           enum: [article, video, all]
 *           default: all
 *         description: Type of content to analyze
 *     responses:
 *       200:
 *         description: Content analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     contentViews:
 *                       type: object
 *                       properties:
 *                         articles:
 *                           type: number
 *                         videos:
 *                           type: number
 *                         total:
 *                           type: number
 *                     viewsByDate:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                           views:
 *                             type: number
 *                     topContent:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           type:
 *                             type: string
 *                           viewCount:
 *                             type: number
 *                     categoryPerformance:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                           contentCount:
 *                             type: number
 *                           totalViews:
 *                             type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Editor only
 */
router.get('/analytics', 
  authenticateToken, 
  authorizeRole(['admin', 'editor']), 
  cmsController.getContentAnalytics
);

/**
 * @swagger
 * /api/cms/bulk:
 *   post:
 *     summary: Perform bulk operations on content
 *     tags: [CMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - operation
 *               - contentType
 *               - ids
 *             properties:
 *               operation:
 *                 type: string
 *                 enum: [publish, unpublish, delete, updateCategory]
 *                 description: Bulk operation to perform
 *               contentType:
 *                 type: string
 *                 enum: [article, video]
 *                 description: Type of content
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of content IDs
 *               categoryId:
 *                 type: string
 *                 description: New category ID (required for updateCategory operation)
 *     responses:
 *       200:
 *         description: Bulk operation completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Bulk operation completed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     processed:
 *                       type: number
 *                       description: Number of items processed
 *                     failed:
 *                       type: number
 *                       description: Number of items that failed
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [success, failed]
 *                           error:
 *                             type: string
 *       400:
 *         description: Invalid operation or missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Editor only
 */
router.post('/bulk', 
  authenticateToken, 
  authorizeRole(['admin', 'editor']), 
  cmsController.bulkUpdateContent
);

export default router;
