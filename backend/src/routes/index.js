import { Router } from 'express'
import reviewRoutes from './review.routes.js';
import repositoryRoutes from './repository.routes.js';

const router = Router();

router.use('/review', reviewRoutes);
router.use('/repository', repositoryRoutes);

export default router;