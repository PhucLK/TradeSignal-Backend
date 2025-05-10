import express from 'express';

const router = express.Router();
// Get all signals with pagination
router.get('/', async (req, res) => {
  return 'OK';
});

export default router;