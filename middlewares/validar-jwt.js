const { response, request } = require('express');
const jwt = require('jsonwebtoken');
///const usuario = require('../models/usuario');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    
    const token = req.header('x-token');
    
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        //leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if (!usuario){
            return res.status(401).json({
                msg: "Token invalido - usuario inexistente"
            })
        }

        //Verifico si el uid es Admin (asi lo haria yo MFB)
        //if( usuario.rol !== 'ADMIN' ){
          //  return res.status(401).json({
            //    msg: `Token invalido - el usuario ${usuario.nombre} no es Administrador`
            //})
        //}

        //Verifico si el uid esta vigente (estado true)
        if( !usuario.estado ){
            return res.status(401).json({
                msg: "Token invalido - usuario con estado false"
            });
        }


        req.usuario = usuario;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token invalido'
        })

    }
}

module.exports = {
    validarJWT
}