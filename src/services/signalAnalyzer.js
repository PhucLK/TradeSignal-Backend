import Signal from '../models/Signal.js';
import SignalStats from '../models/SignalStats.js';

const analyzeSignals = async () => {
  console.log('Analyzing signals...');
  
  // try {
  //   // Get all active signals
  //   const signals = await Signal.find({ status: 'ACTIVE' });
    
  //   // Group signals by coin, timeframe, and signalType
  //   const groupedSignals = signals.reduce((acc, signal) => {
  //     const key = `${signal.coin}-${signal.timeframe}-${signal.signalType}`;
  //     if (!acc[key]) {
  //       acc[key] = {
  //         count: 0,
  //         totalStrength: 0,
  //         totalPrice: 0
  //       };
  //     }
  //     acc[key].count++;
  //     acc[key].totalStrength += signal.strength;
  //     acc[key].totalPrice += signal.price;
  //     return acc;
  //   }, {});

  //   // Update or create stats for each group
  //   for (const [key, data] of Object.entries(groupedSignals)) {
  //     const [coin, timeframe, signalType] = key.split('-');
  //     const averageStrength = data.totalStrength / data.count;
  //     const averagePrice = data.totalPrice / data.count;
      
  //     await SignalStats.findOneAndUpdate(
  //       { coin, timeframe, signalType },
  //       {
  //         count: data.count,
  //         successRate: averageStrength,
  //         averagePrice,
  //         lastUpdated: new Date()
  //       },
  //       { upsert: true, new: true }
  //     );
  //   }

  //   console.log('Signal analysis completed successfully');
  // } catch (error) {
  //   console.error('Error analyzing signals:', error);
  // }
};

export default {
  analyzeSignals
}; 