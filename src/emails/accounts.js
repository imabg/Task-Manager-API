//const sendgridKey = Enter your Secret Key after Registration on SendGrid
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(sendgridKey);

const welcomeMail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'Enter a Valid Mail address',
    subject: `Welcome! ${name} to Task Manager`,
    text: 'Thanks for Register.',
    html:
      '<h1>Thanks for Registration</h1><br><p>Task manager API is created by<a href="https://abgoswami.netlify.com" target="_blank">Abhay Goswami</a></p>'
  });
};

const cancelationMail = email => {
  sgMail.send({
    to: email,
    from: 'abhaygoswami79265@gmail.com',
    subject: 'Sucessful Cancel your Subscription!',
    html: '<h2>Have, a good time.</h2><br><h2>See! you Soon.</h2>'
  });
};

module.exports = {
  welcomeMail,
  cancelationMail
};
