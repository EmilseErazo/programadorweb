var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var presupuestosModel = require('../models/presupuestosModel');
var cloudinary = require('cloudinary').v2;
var util = require('util');



router.get('/', async function (req, res, next) {

  var presupuestos = await presupuestosModel.getPresupuestos();
  presupuestos = presupuestos.splice(0,50);
  presupuestos = presupuestos.map(presupuesto => {
     if (presupuesto.img_id) {
        const imagen = cloudinary.url(presupuesto.img_id, {
           width: 100,
           height: 100,
           crop: 'fill'
        });
        return {
           ...presupuesto,
           imagen
        }
     } else {
        return {
           ...presupuesto,
           imagen: '/images/noimage.jpg'
        }
     }
  });

  res.render('index', {
    presupuestos
  });

});

/* GET home page. */
//router.get('/', async function(req, res, next) {

  //  var presupuestos = await presupuestosModel.getPresupuestos();
   //var presupuestos = presupuestos.splice(0,5);
 // res.render('index', {
//presupuestos
  //});
//});

router.post('/', async (req, res, next) => {

  //console.log(req.body) // estoy capturando datos?¿

  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var cel = req.body.cel;
  var mensaje = req.body.mensaje;

  var obj = {
    to: 'emilsesilvana@gmail.com',
    subject: 'CONTACTO WEB',
    html: nombre + ' ' + apellido + ' se contacto a traves de la web y quiere mas informacion a este correo: '  + email + ' . <br> Ademas, hizo este comentario : ' + mensaje
      + ' .<br> Su cel es: ' + cel
  } //cierre var obj

  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  }); //cierra transport

  var info = await transport.sendMail(obj);

  res.render('index' , {
    message: 'Mensaje enviado correctamente'
  });
});

module.exports = router;
