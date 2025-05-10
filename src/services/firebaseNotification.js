import admin from 'firebase-admin';

// Function to send a push notification
export const sendPushNotification = async () => {
    const message = {
      notification: {
        'title': 'Crypto Alert',
        'body': 'Buy BTC now!',
      },
      token: process.env.JWT_SECRET,
    };
    
    // Send a message to the device corresponding to the provided
    // registration token.
    messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  
    try {
      await admin.messaging().send(message);
      console.log('Push notification sent successfully');
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw new Error('Failed to send push notification');
    }
  };