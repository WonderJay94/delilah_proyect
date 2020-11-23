const {db} = require('../configDB');
const jwt = require('jsonwebtoken');
const {APP_SIGN} = require('../utils/constants');
const {check, verify, auth, admin} = require('../Middlewares/middlewares');
const {getInfo, getTotal, addInfo} = require('../utils/functions');

const routes = (app) =>{
    // LOGIN
    // Endpoint login
    app.post('/api/login', verify, (req, res) =>{
        const {username, password} = req.body;
        db.query(`SELECT id, usuario, contrasena, rol FROM delilah.usuarios WHERE usuario = '${username}' OR correo = '${username}'`, {type: db.QueryTypes.SELECT})
        .then(resDB =>{
            const user = resDB[0];
            const token = jwt.sign(user, APP_SIGN);
            res.status(200).type('text').send(`Su token de acceso es ${token}`);
        }).catch(e => {
            res.status(400).send('Error de acceso');
        });
        
    })
    // USERS
    // Endpoint view all users
    app.get('/api/usuarios', admin, (req, res) =>{
        db.query('SELECT * FROM delilah.usuarios', {type: db.QueryTypes.SELECT})
        .then(resDB =>{
            res.status(200);
            res.json(resDB);
        }).catch(err=>{
            console.error(err);
            res.status(400).send('No se pueden mostrar los usuarios, intentelo nuevamente');
        });
    });
    // Endpoint view user info
    app.get('/api/cuenta', auth, (req, res) => {
        const user = req.user;
        const id = user.id;
        db.query(`SELECT * FROM delilah.usuarios WHERE id = '${id}'`, {type: db.QueryTypes.SELECT})
        .then(resDB => {
            const user = resDB[0];
            res.status(200).json(user);
        }).catch(e => {
            res.status(400).send('Error, intentelo nuevamente');
        })
        
    });
    // Endpoint register new user
    app.post('/api/usuarios/registrar',check, (req, res) => {
        const {username, nombreCompleto, correo, telefono, direccion, contrasena} = req.body;

        db.query(`INSERT INTO delilah.usuarios VALUES(null, '${username}', '${nombreCompleto}', '${correo}', '${telefono}', '${direccion}', '${contrasena}', 'usuario')`)
        .then(resDB => {
            res.status(200).send('Se ha agregado el usuario con exito');
        }).catch(e => {
            res.status(400).send('No se ha podido agregar el usuario, por favor intentelo nuevamente');
        });
    });
    // PRODUCTOS
    // Endpoint view all products or by id
    app.get('/api/productos/:id?', (req, res) =>{
        const id = req.params.id;
        const general ='SELECT * FROM delilah.productos';
        const query = id ? `${general} WHERE id = ${id}` : general;
        db.query(query, {type: db.QueryTypes.SELECT})
        .then(resDB =>{
            if(resDB.length){
                res.status(200).json(resDB);
            }else{
                res.status(400).json({ error: 'ID no encontrado' });
            } 
        }).catch(err=>{
            console.error(err);
            res.status(400).send(err);
        });
    });
    // Endpoint register new product
    app.post('/api/productos/registrar', admin, check, (req, res) => {
        const {nombre, descripcion, precio, imagen} = req.body;
        
        db.query(`INSERT INTO delilah.productos VALUES(null, '${nombre}', '${descripcion}', ${precio}, '${imagen}')`)
        .then(resDB => {
            res.status(200).send('Se ha agregado el producto con exito');
        }).catch(e => {
            res.status(400).send('No se ha podido agregar el producto, por favor intentelo nuevamente');
        })
    });
    // Endpoint delete product
    app.delete('/api/productos/:id', admin, (req, res) =>{
        const id = req.params.id;
        db.query(`DELETE FROM delilah.productos WHERE id = '${id}'`)
        .then(resDB => {
            if(resDB.length){
                res.status(200).json('Producto eliminado con exito');
            }else{
                res.status(400).json({ error: 'ID no encontrado' });
            } 
        }).catch(e => {
            res.status(400).send('No se ha podido eliminar el producto, por favor intentelo nuevamente');
        })
    });
    // Endpoint update product
    app.put('/api/productos/:id', admin, (req, res) => {
        const id = req.params.id;
        const body = req.body;
        let update = '';
    
        for(const property in body){
            update += `${property} = '${body[property]}',`;
        }
        update = update.slice(0,-1);
        
        db.query(`UPDATE delilah.productos SET ${update} WHERE id = ${id}`)
        .then(resDB => {
            if(resDB[0].affectedRows>0){
                res.status(200).send('Producto actualizado con exito');
            }else{
                res.status(400).send('No se ha podido actualizar el producto, por favor intentelo nuevamente');
            }
        }).catch(e => {
            res.status(400).send('No se ha podido actualizar el producto, por favor intentelo nuevamente');
        })
    });
    // PEDIDOS
    // Endpoint view all pedidos or by id
    app.get('/api/pedidos/:id?', auth, (req, res) =>{
        const {id, rol} = req.user;
        const idP = req.params.id;
        const general ='SELECT pedidos.id, estado, DATE_FORMAT(hora, "%h:%i%p") AS hora, total, metodo, usuarios.direccion, id_usuario FROM delilah.pedidos INNER JOIN delilah.usuarios ON usuarios.id = pedidos.id_usuario';
        const query = idP ? `${general} WHERE pedidos.id = ${idP} AND estado <> 'eliminado'` : general;
        if(rol == 'admin'){
            db.query(query, {type: db.QueryTypes.SELECT})
            .then(async resDB =>{
                if(resDB.length){
                    let pedido = await getInfo(resDB);
                    res.status(200).json(pedido);
                }else{
                    res.status(400).json({ error: 'ID no encontrado' });
                } 
            }).catch(err=>{
                console.error(err);
                res.status(400).send(err);
            });
        }else{
            db.query(`${general} WHERE pedidos.id_usuario = ${id} AND estado <> 'eliminado'`, {type: db.QueryTypes.SELECT})
            .then(async resDB => {
                    if (resDB.length) {
                        let pedido = await getInfo(resDB);
                        res.status(200).json(pedido);
                    } else {
                        res.status(400).json({ error: 'ID no encontrado o no cuenta con ningún pedido' });
                    }
                }).catch(err=>{
                console.error(err);
                res.status(400).send(err);
            });
        }
        
    });
    // Endpoint create new pedido
    app.post('/api/pedidos/nuevo', auth, async (req, res) => {
        const {id} = req.user;
        const {metodo, pedido} = req.body;
        const hora = new Date().toISOString().slice(0, 19).replace('T', ' ');//JS to MySQL Datetime
        const total = await getTotal(pedido);

        db.query(`INSERT INTO delilah.pedidos VALUES(null, 'nuevo', '${hora}', '${total}', '${metodo}', '${id}')`)
        .then(resDB => {
            const idP = resDB[0];
            addInfo(idP, pedido);
            res.status(200).send('Pedido creado con exito');
        }).catch(e =>{
            res.status(400).send('No se pudo generar el pedido, por favor intentelo nuevamente');
        })
        
    });
    // Endpoint update pedido
    app.put('/api/pedidos/:id', admin, (req, res) => {
        const idP = req.params.id;
        const body = req.body;
        const size = Object.keys(body).length;
        
        if(size != 1){
            console.log('error');
            res.status(400).send('Por favor ingrese unicamente el estado que quiere actualizar');
        }else{
            let update = `estado = '${body.estado}'`;
            db.query(`UPDATE delilah.pedidos SET ${update} WHERE id = ${idP}`)
            .then(resDB => {
                if(resDB[0].affectedRows>0){
                    res.status(200).send('Pedido actualizado con exito');
                }else{
                    res.status(400).send('No se ha podido actualizar el pedido, por favor por favor verifique el id e intentelo nuevamente');
                }
            }).catch(e => {
                res.status(400).send('No se ha podido actualizar el pedido, por favor verifique el id e intentelo nuevamente');
            })
        }
    });

    // Endpoint delete pedido
    app.delete('/api/pedidos/:id', admin, (req, res) => {
        const idP = req.params.id;
        db.query(`UPDATE delilah.pedidos SET estado = 'eliminado' WHERE id = ${idP}`)
        .then(resDB => {
            res.status(200).send('Pedido eliminado con exito');
        }).catch(e => {
            res.status(400).send('El pedido no se pudo eliminar, por favor intentelo nuevamente');
        })
    })
}
module.exports = routes;