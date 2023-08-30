var pool = require('./bd');

async function getPresupuestos() {
        var query = 'select * from presupuestos';
        var rows = await pool.query(query);
        return rows;

    }

async function deletePresupuestoById(id) {
        var query = 'delete  from presupuestos where id = ? ';
        var rows = await pool.query(query, [id]);
        return rows;
    }



    async function insertPresupuesto(obj) {
        try {
        var query = 'insert into presupuestos set ? ';
        var rows = await pool.query(query, [obj]);
        return rows;
            } catch (error) {
                console.log(error);
                throw error;
            }
    }

    async function getPresupuestoById(id) {
        var query = 'select * from presupuestos where id = ? ';
        var rows = await pool.query(query, [id]);
        return rows[0];
    }
    //para modificar > que actualice esos campos por el id//*
    async function modificarPresupuestoById(obj, id) {
        try {
            var query = 'update presupuestos set ? where id=?';
            var rows = await pool.query(query, [obj, id]);
            return rows;
                } catch (error) {
                    console.log(error);
                    throw error;
                }
        } //.cierra modificar update//
      


module.exports = { getPresupuestos, deletePresupuestoById, insertPresupuesto, getPresupuestoById, modificarPresupuestoById }

