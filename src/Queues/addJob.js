import {notificationQueue } from './queues.js'

export const sendMarketingNotification = async(users) => {
  for (const user of users) {
    await notificationQueue.add('marketing', {
      userId: user.id,
      name: user.name,
      token: user.firebaseToken,
      message: `Hey, check out our new offers!`
    });
  }
}
