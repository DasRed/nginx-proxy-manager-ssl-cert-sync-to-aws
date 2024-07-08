import 'dotenv/config';
import {CronJob} from 'cron';
import {handler} from './handler.js';

new CronJob('0 */10 * * * *', handler, null, true, null, null, true);
