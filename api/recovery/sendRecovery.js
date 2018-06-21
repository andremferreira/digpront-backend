const nodemailer = require('nodemailer')
function sendRecovery(email, recoveryPass) {
  let dt = new Date()
  let ho = '0'
  let mi = '0'
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
  let strDt = dt.getDate() + '/' + dt.getMonth()+1 + '/' + dt.getFullYear() + ' às '+ ho + dt.getHours() + ':' + mi + dt.getMinutes()
  const output = `
  <div style="padding-left:15px; padding-top:12px; padding-bottom:12px; border-style:solid; border: 2px solid #0097fc;">
  	<table>
  		<tr>
  			<td><img src="https://digpront.com/assets/imgs/LogoDigPront2.png"/></td>
  			<td><h1> Digital Prontuário</h1></td>
  		</tr>
  	</table>
    <table>
      <tr>
        <td style="vertical-align:center;"><img src="https://digpront.com/assets/imgs/recovery.png" style="widht:32px; height:32px;"/></td>
        <td><h3>Procedimento de resgate de senha...</h3></td>
      </tr>
    </table>
    <p>Acesse o link abaixo para acessar a página de modificação de senha.</p>
    <p><a href="https://digpront.com/auth.html#!?recoveryPass=${recoveryPass}">https://digpront.com/auth.html#!?recoveryPass=${recoveryPass}</a></p>
    <h4>Obs.: Este link somente ficará ativo durante o período de uma hora apartir do envio: ${strDt}</h4>
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
      h4 {
        color: #0130ff;
        padding-left:20px;
      }
    </style>
  `
  console.log(output)

  let transporter = nodemailer.createTransport({
          host: 'smtp.umbler.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
              user: 'recuperacaodesenha@digpront.com', // generated ethereal user
              pass: 'Hidden@123'  // generated ethereal password
          }
          ,
          tls:{
            rejectUnauthorizes:false
          }
      });

      // setup email data with unicode symbols
      let mailOptions = {
          from: `"Recuperação de senha - Digital Prontuário!" <recuperacaodesenha@digpront.com>`, // sender address
          to: `${email}`, // list of receivers
          subject: `Digital Prontuário - Solicitação de alteração de senha.`, // Subject line
          text: 'Resgate de Senha!', // plain text body
          html: output // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              res.status(500).json({errors: [error]})
          }
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          // res.json({ msg: 'E-mail enviado com sucesso!' })
      });
}

module.exports = { sendRecovery }
