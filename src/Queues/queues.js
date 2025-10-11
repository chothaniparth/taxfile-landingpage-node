import {Queue} from 'bullmq'
import connection from './Redis.js'

export const notificationQueue = new Queue('notificationQueue', {connection});
export const emailQueue = new Queue('emailQueue ', {connection});
export const whatsappQueue = new Queue('whatsappQueue', {connection});