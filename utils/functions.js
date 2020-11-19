const {db} = require('../configDB');

function check(values){
    for(let i=0; i<values.length; i++){
        if(!values[i]){
            res.status(400).send('Error: Por favor ingrese la información en los campos correspondientes');
        }
    }
}

async function getInfo(data){
    const info = [];
    for(let i = 0; i < data.length; i++) {
        const pedido = data[i];
        const details = await getDetails(pedido.id);
        let inf = {
            id: pedido.id,
            estado: pedido.estado,
            hora: pedido.hora,
            descripcion: details.trim(),
            pago: {
                metodo: pedido.metodo,
                total: pedido.total
            },
            direccion: pedido.direccion,
            usuario: pedido.id_usuario
        };
        info.push(inf);        
    };
    return info;
}

async function getDetails(idP){
    const qu = await db.query(`SELECT infopedido.id_pedido, productos.descripcion, infopedido.cantidad FROM delilah.infopedido INNER JOIN delilah.productos ON infopedido.id_producto = productos.id WHERE id_pedido = ${idP}`, {type: db.QueryTypes.SELECT})
    .then(resDB =>{
        let details = '';
        resDB.forEach(item => {
            details += item.cantidad + "x" + item.descripcion + " ";
        });
        return details;
    }).catch(e => {
        res.status(400).send('Error, intentalo nuevamente');
    });
    return qu;
}

async function getTotal(pedido){
    let total = 0;
    for(let i = 0; i<pedido.length; i++){
        const idP = pedido[i].id_producto;
        const cant = pedido[i].cantidad;

        const value = await db.query(`SELECT precio FROM delilah.productos WHERE id = ${idP}`,{type: db.QueryTypes.SELECT})
        .then( resDB =>{
            let p = resDB[0].precio;
            return p;
        }).catch(e => {
            res.status(400).send('Error, intentalo nuevamente');
        });
        total += value * cant;
    }
    return total;
}

function addInfo(idP, pedido){
    for(let i = 0; i<pedido.length; i++){
        const idPr = pedido[i].id_producto;
        const cant = pedido[i].cantidad;
        db.query(`INSERT INTO delilah.infopedido VALUES(null, '${idP}', '${idPr}', '${cant}')`)
        .then(resDB => {
            console.log('Success: informacion del pedido agregada');
        }).catch(e => {
            console.log(e);
        });
    }
}
module.exports = {
    check,
    getInfo,
    getTotal,
    addInfo
}