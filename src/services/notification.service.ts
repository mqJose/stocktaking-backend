// const sgMail = require('@sendgrid/mail');
import sgMail from '@sendgrid/mail';
import {NotificationDatasource} from '../datasources/notification';
import {ks} from '../keys/config-file';
import {SmsNotification} from '../models';
import {EmailNotification} from '../models/email-notification.model';
const twilio = require('twilio');
export class NotificationService {

  async smsNotification(notification: SmsNotification): Promise<boolean> {
    try {
      const accountSid = NotificationDatasource.TWILIO_SID;
      const authToken = NotificationDatasource.TWILIO_AUTH_TOKEN;
      const client = twilio(accountSid, authToken);

      await client.messages
        .create({
          body: notification.body,
          from: ks.twilioPhone,
          to: notification.to
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((data: any)=>{
          console.log("hola case"+data);
        })
      return true;
    } catch (error) {
      return false;
    }
  }

  async mailNotification(notification: EmailNotification): Promise<boolean> {
    try {
      sgMail.setApiKey(ks.SENDGRID_API_KEY);
      const msg = {
        to: notification.to,
        from: ks.emailFrom,
        subject: notification.subject,
        text: notification.textBody,
        html: notification.htmlBody,
      };
      await sgMail.send(msg).then(() => true, () => false);
      return true;
    }
    catch (err) {
      return false;
    }
  }
}
