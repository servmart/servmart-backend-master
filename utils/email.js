const nodemailer = require('nodemailer');

const sendEmail = async options => {
    /*Transport service is used by node mailer to send emails, it takes service and auth object as parameters.
        here we are using gmail as our service 
        In Auth object , we specify our email and password
    */
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        secureConnection: false
    });
    /*
        In mail options we specify from and to address, subject and HTML content.
        In our case , we use our personal email as from and to address,
        Subject is Contact name and 
        html is our form details which we parsed using bodyParser.
    */
    const mailOptions = {
        from: 'servmartdemo@gmail.com',//mail coming from
        to: options.email,//mail going to
        subject: options.subject,
        html: options.message
    };
  
    /*  Here comes the important part, sendMail is the method which actually sends email, it takes mail options and
        call back as parameter 
    */

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        res.send('error') // if error occurs send error as response to client
        } else {
        console.log('Email sent: ' + info.response);
        res.send('Sent Successfully')//if mail is sent successfully send Sent successfully as response
        }
    }); 
};

module.exports = sendEmail;