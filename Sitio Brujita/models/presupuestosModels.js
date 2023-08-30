var pool = require('./bd');

async function getPresupuestos() {
  
        var query = 'select * from presupuestos order by id desc';
        var rows = await pool.query(query);
        return rows;
     }


module.exports = { getPresupuestos }