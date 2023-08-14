const PushNotificationService = require("./push-notification-service");
const pushNotificationService = new PushNotificationService();

function sendScheduledNotification(fcmToken, pushPayload) {
  pushNotificationService.sendNotification(fcmToken, pushPayload);
}

module.exports = sendScheduledNotification;
