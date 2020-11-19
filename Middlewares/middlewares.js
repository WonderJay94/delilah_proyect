const {db} = require('../configDB');
const jwt = require('jsonwebtoken');
const {APP_SIGN} = require('../utils/constants');
const { send } = require('process');

function verify(req, res, next){
    const {username, password} = req.body;
    db.query(`SELECT id, usuario, contrasena, rol FROM delilah.usuarios WHERE usuario = '${username}' OR correo = '${username}'`, {type: db.QueryTypes.SELECT})
    .then(resDB =>{
        const pass = resDB[0].contrasena;
        const usuario = resDB[0].usuario;
        console.log(usuario);
        if(!usuario || pass != password){
            return res.status(400).send('El usuario y/o contraseña son incorrectos');
        }
        return next();
        
    }).catch(e =>{
        res.status(400).send('El usuario y/o contraseña son incorrectos');
    })
        
}
function auth (req, res, next){
    const {headers: {authorization}} = req;
    const token = authorization && authorization.split(' ').pop();
    if(!token){
        return res.status(400).type('text').send('Error de autorización');
    }else{
        jwt.verify(token, APP_SIGN, (err, user) =>{
            if(err) return send.status(403).type('text').send('Solicitud denegada');
            req.user = user;
            return next();
        })
    }
}
function admin (req, res, next){
    const {headers: {authorization}} = req;
    const token = authorization && authorization.split(' ').pop();
    if(!token){
        return res.status(400).type('text').send('Error de autorización');
    }else{
        jwt.verify(token, APP_SIGN, (err, user) =>{
            if(err) return res.status(403).type('text').send('Solicitud denegada');
            if(user.rol != 'admin') return res.status(400).type('text').send('No cuenta con permisos suficientes');
            req.user = user;
            return next();
        })
    }

}

module.exports = {
    verify,
    auth,
    admin
}