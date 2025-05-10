import Token from '../models/Token.js';
const express = require('express');
const app = express();
app.use(express.json());


const router = express.Router();
// Endpoint to register token
app.post('/', async (req, res) => {
  const { token, userId } = req.body;
  if (!token) return res.status(400).send('Token required');
  await Token.findOneAndUpdate({ userId }, { token }, { upsert: true });
  res.send('Token saved');
});

export default router;