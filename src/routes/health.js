import express from 'express';

const router = express.Router();
// Get all signals with pagination
router.get('/', async (req, res) => {
  res.json({'Status': 'OK'});
});

export default router;