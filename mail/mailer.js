
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'

 const adminEmail = 'vovanviet14112002@gmail.com'
 const adminPassword = 'Vovanviet14@'

 const mailHost = 'smtp.gmail.com'
 const mailPort = 587
 
 const sendMail = (to, subject, template , context) => {
   
   const transporter = nodemailer.createTransport({
     host: mailHost,
     port: mailPort,
     secure: false,
     auth: {
       user: adminEmail,
       pass: adminPassword
     }
   })
   
   const handlebarsOptions = {
       viewEngine:{
           extName: '.handlebars',
           partialsDir: path.resolve('./mail/template'),
           defaultLayout: false,
       },
       viewPath: path.resolve('./mail/template'),
       extName: '.handlebars',
   }

   transporter.use('compile' , hbs(handlebarsOptions))

   const options = {
     from: adminEmail, 
     to: to, 
     subject: subject, 
     template : template, 
     context : context
   }
 
   
   return transporter.sendMail(options)
 }
 
export default sendMail