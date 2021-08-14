export namespace ks {
  export const AESKey = 'Pr0gR3s0@j0cdAv!d*';
  export const subjectEmail = 'Recuperar contrasenia por email';
  export const subjectSms = 'Recuperar contrasenia por sms';
  export const jwtKey = 'CLav3@JWT';
  export const expTimeJWT = (Date.now() / 1000) + (60 * 60 * 10);
  export const SENDGRID_API_KEY='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';
  export const emailFrom = 'willapp.foundation@gmail.com';
  export const TWILIO_SID='AC5dfd819b32f7da4305e8d95085001fb6';
  export const TWILIO_AUTH_TOKEN='ab5b492f3edc126ebef046bceca74704';
  export const twilioPhone = '+18582276244';
  export const nameField = "file";
  export const picturesFolder = "../../upload/pictures";
  export const picturesExtensions: string[] = ['.PNG', '.JPG', '.JPEG', '.SVG'];
  export const picturesFileSize = 2048 * 2048 * 1;
  export const documentsFolder = "../../upload/documents";
  export const documentsExtensions: string[] = ['.DOC', '.XLSX', '.PDF', '.DOCX', '.XLS', '.TXT'];
  export const documentsFileSize = 1024 * 1024 * 5;
}

export namespace PasswordKey {
  export const LENGTH = 12;
  export const NUMBERS = true;
  export const LOWERCASE = true;
  export const UPPERCASE = true;
  export const SYMBOLS = false;
}
