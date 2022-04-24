const Pool = require('pg').Pool;
const config = require('./config');
const pool = new Pool({
    user: config.database.user,
    host: config.database.host,
    database: config.database.database,
    password: config.database.password,
    port: config.database.port,
})


const getUsers = (req,res) =>{
    pool.query("SELECT * FROM users",(error,result) =>{
        if(error){
            throw error;
        }
        res.status(200).json(result.rows)
    })
}

const insertUser = (req,res) => {
    var nombres = req.body["nombres"];
    var telefono = req.body["telefono"];
    var correo = req.body["correo"];
    var direccion = req.body["direccion"].replace(";"," ");
    var empresa = req.body["empresa"];
    var movil = req.body["movil"];
    var web = req.body["web"];
    pool.query(`INSERT INTO users (nombres,telefono,correo,direccion,empresa,web,movil) VALUES ('${nombres}',${telefono},'${correo}','${direccion}','${empresa}','${web}','${movil}')`,(error,result)=>{
        if(error){
            throw error;
        }
        res.status(200).json({"message":"insert was done"});
    })
}
module.exports = {
    getUsers,
    insertUser
}