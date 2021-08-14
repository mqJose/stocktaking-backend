import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {ks} from '../keys/config-file';
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');
@injectable({scope: BindingScope.TRANSIENT})
export class NotificationsService {
  constructor(/* Add @inject to inject parameters */) {}


  /**
   * Send Notification by email
   *
   * @param {string} to
   * @param {string} subject
   * @param {string} content
   * @memberof NotificationsService
   */
  public sendNotificationByEmail(to: string, subject: string, content: string) {
    sgMail.setApiKey(ks.SENDGRID_API_KEY)
    const msg = {
      to, // Change to your recipient
      from: ks.emailFrom, // Change to your verified sender
      subject,
      html: content,
    }
    sgMail
      .send(msg)
      .then(() => console.log(`Email sent to ${to}`))
      .catch(() => console.error)
  }

  /**
   * Send Notification by SMS
   *
   * @param {string} to : is a phone
   * @param {string} content
   * @memberof NotificationsService
   */
  public sendNotificationBySms(to: string, content: string) {
    const accountSid = ks.TWILIO_SID; // Your Account SID from www.twilio.com/console
    const authToken = ks.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

    const client = new twilio(accountSid, authToken);

    client.messages.create({
      body: content,
      to, // phone
      from: ks.twilioPhone
    })
      .then(() => console.log(`SMS sent to ${to}`))
      .catch(() => console.error)
  }
}
