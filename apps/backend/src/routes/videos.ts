import { Router } from 'express';
import { VideoController } from '../controllers/videoController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();
const videoController = new VideoController();

// Public routes
router.get('/', videoController.getVideos);
router.get('/:id', videoController.getVideo);

// Protected routes (Admin/CMS)
router.post('/', 
  authenticateToken, 
  authorizeRole(['admin', 'editor']), 
  videoController.createVideo
);

router.put('/:id', 
  authenticateToken, 
  authorizeRole(['admin', 'editor']), 
  videoController.updateVideo
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRole(['admin']), 
  videoController.deleteVideo
);

export default router;
