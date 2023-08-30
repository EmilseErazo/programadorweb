var express = require('express');
var router = express.Router();
var presupuestosModel = require('./../../models/presupuestosModel');

var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);

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

   res.render('admin/presupuestos', {
      layout: 'admin/layout',
      persona: req.session.nombre,
      presupuestos
   });

});

/*Para eliminar una novedad*/
router.get('/eliminar/:id', async (req, res, next) => {
   var id = req.params.id;

   await presupuestosModel.deletePresupuestoById(id);
   res.redirect('/admin/presupuestos')

}); //cierra get de eliminar


router.get('/agregar', async (req, res, next) => {
   res.render('admin/agregar', { //agregar.hbs (esta dentro del admin)
      layout: 'admin/layout'
   });
});

/*insertar la novedad>guarde en la BD y lo muestre en el listado*/

router.post('/agregar', async (req, res, next) => {
   try {
      var img_id = '';
      if (req.files && Object.keys(req.files).length > 0) {
         imagen = req.files.imagen;
         img_id = (await uploader(imagen.tempFilePath)).public_id;
      }

      if (req.body.titulo != '' && req.body.descripcion != '' &&
         req.body.descripcion != ' ') {
         await presupuestosModel.insertPresupuesto({
             ...req.body,
             img_id
         });

         res.redirect('/admin/presupuestos')
      } else {
         res.render('admin/agregar', {
            layout: 'admin/layout',
            error: true,
            message: 'Todos los campos son requeridos'
         })
      }
   } catch (error) {
      console.log(error)
      res.render('admin/agregar', {
         layout: 'admin/layout',
         error: true,
         message: 'No se cargo el presupuesto'
      });
   }
});

router.get('/modificar/:id', async (req, res, next) => {

   let id = req.params.id;
   let Presupuesto = await presupuestosModel.getPresupuestoById(id);
   res.render('admin/modificar', {
      layout: 'admin/layout',
      Presupuesto
   });
});

router.post('/modificar', async (req, res, next) => {
   try {
      let obj = {
         titulo: req.body.Titulo,
         descripcion: req.body.Descripcion,
         precio: req.body.Precio
      }
      await presupuestosModel.modificarPresupuestoById(obj, req.body.id);
      res.redirect('/admin/presupuestos');
   }
   catch (error) {
      console.log(error)
      res.render('admin/modificar', {
         layout: 'admin/layout',
         error: true,
         message: 'No se modifico el presupuesto'
      });
   }
});


module.exports = router;