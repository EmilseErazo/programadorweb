var express = require('express');
var router = express.Router();
var usuariosModel = require('./../../models/usuariosModel');

router.get('/', function (req, res, next)  {
    req.session.destroy();
    res.render('admin/login', {
      layout: 'admin/layout'      
    });
  });

  router.post('/', async (req, res, next) => {
    try {
        console.log(req);
        var usuario = req.body.usuario;
        var password = req.body.password;

        var data = await usuariosModel.getUserByUsernameAndPassword(usuario, password);


        if (data !=undefined) {
            req.session.id=data.id;
            req.session.nombre=data.usuario;                
            res.redirect('/admin/presupuestos');            
        } else {
            res.render('admin/login', {
                layout: 'admin/layout',
                error: true
            });
        } //cierre else 

    } catch (error) {
        console.log(error);
    }
  });

  module.exports = router;