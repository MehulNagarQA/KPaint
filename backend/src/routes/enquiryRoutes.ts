import { Router } from 'express';
import { submitEnquiry } from '../controllers/enquiryController';

const router = Router();

router.post('/', submitEnquiry);

export default router;
