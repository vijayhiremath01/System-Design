import { getAllProducts } from '../controller/product.controller.js';
import { Router } from 'express';

const router = Router();

router.get('/fruits' , getAllProducts);

export default router;