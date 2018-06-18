const _ = require('lodash')
const nodemailer = require('nodemailer')
function sendCustumerEmail(req, res, next) {
  var dt = new Date()
  var ho = '0'
  var mi = '0'
  if (dt.getHours() < 9){
    ho = '0'
  } else {
    ho = ''
  }
  if (dt.getMinutes() < 9){
    mi = '0'
  } else {
    mi = ''
  }
  var strDt = dt.getDate() + '/' + dt.getMonth()+1 + '/' + dt.getFullYear() + ' às '+ ho + dt.getHours() + ':' + mi + dt.getMinutes()
  const output = `
  <div style="padding-left:15px; padding-top:12px; padding-bottom:12px; border-style:solid; border: 2px solid #0097fc;">
  	<table>
  		<tr>
  			<td><img src="https://digpront.com/assets/imgs/LogoDigPront2.png"/></td>
  			<td><h1> Digital Prontuário</h1></td>
  		</tr>
  	</table>
    Você possuí uma nova mensagem...
    <br><br>
    <h3>Detalhes da mensagem</h3>
    <ul>
      <li>Cliente: ${req.body.nome}</li>
      <li>Contato: ${req.body.email}</li>
      <li>Horário: ${strDt}</li>
    </ul>
    <h3>Título</h3>
    <p>${req.body.titulo}</p>
    <h3>Mensagem</h3>
    <p>${req.body.mensagem}</p>
    <br>
   </div>
    <style>
      div {
        background-image: url('https://digpront.com/assets/imgs/backgroundLogin2.jpg');
        background-repeat: no-repeat;
        background-position: center top;
        background-attachment: fixed;
        background-color: transparent !important;
        font-family: Arial;
        text-align: justify;
        text-justify: inter-word;
        margin-bottom: 20px;
        border-radius: 15px 50px;
        shadow: 5px 8px 15px #a0a0a0;
      }
      p {
        padding-left:20px;
        text-align: justify;
        text-justify: inter-word;
      }
    </style>
  `
  console.log(output)

  let transporter = nodemailer.createTransport({
          host: 'smtp.umbler.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
              user: 'contato@digpront.com', // generated ethereal user
              pass: 'Hidden@123'  // generated ethereal password
          }
          ,
          tls:{
            rejectUnauthorizes:false
          }
      });

      // setup email data with unicode symbols
      let mailOptions = {
          from: `"Contato Digpront" <contato@digpront.com>`, // sender address
          to: `contato@digpront.com, ${req.body.email}`, // list of receivers
          subject: `Novo Contato / Dúvidas de: ${req.body.email} `, // Subject line
          text: 'Contato Digpront!', // plain text body
          html: output // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              res.status(500).json({errors: [error]})
          }
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          res.json({ msg: 'E-mail enviado com sucesso!' })
      });
}

module.exports = { sendCustumerEmail }
