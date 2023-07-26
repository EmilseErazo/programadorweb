var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', async (req, res, next) => {

  console.log(req.body) //capturando datos?

  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var cel = req.body.cel;
  var mensaje = req.body.mensaje;

  var obj = {
    to: 'emilsesilvana@gmail.com',
    subject: 'CONTACTO WEB',
    html: nombre + " " + apellido + " Se contacto atraves de la web : " + email + ". <br> realizo el siguiente comentario : " + mensaje + ". <br> su cel es : "
      + cel
  }
  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS

    }
  }); // cierra transport


  var info = await transport.sendMail(obj);

  res.render('index', {
    message: 'Mensaje enviado correctamente',

  });

});




module.exports = router;
