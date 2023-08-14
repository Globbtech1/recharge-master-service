const admin = require("firebase-admin");
// const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
const serviceAccount = require("./ufitsub-firebase-adminsdk-wc0gi-b51f550850.json");

console.log(serviceAccount);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

class PushNotificationService {
  
  async sendNotification(fcmToken, notification) {
    const message = {
      token: fcmToken,
      notification: {
        title: notification.title,
        body: notification.body,
      },
    };

    try {
      const response = await admin.messaging().send(message);
      console.log("Successfully sent message:", response);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  }
}

module.exports = PushNotificationService;
