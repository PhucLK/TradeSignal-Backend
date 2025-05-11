import Token from '../models/Token.js';
import express from 'express';


const router = express.Router();
// Endpoint to register token
router.post('/', async (req, res) => {
    console.log('Registering token');
    console.log(req.body);
    
  const { token, userId } = req.body;
  if (!token) return res.status(400).send('Token required');
  await Token.findOneAndUpdate({ userId }, { token }, { upsert: true });
  res.send('Token saved');
});

export default router;