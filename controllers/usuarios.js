const { response, request } = require('express');

//npm para encriptar el password
const bcryptjs = require('bcryptjs');

//Lo ponemos en mayuscula para crear una instancia del modelo
const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    //Con esta linea selecciono solo los usuarios con estado activo
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        //Con esta linea cuento todos los usuarios
        Usuario.countDocuments(query),
        //Con esta linea listo todos los usuarios
        Usuario.find(query)
            .limit(Number(limite))
            .skip(Number(desde))
    ])

    res.json({ total, usuarios });
}

const usuariosPut = async (req = request, res = response) => {
    const { id } = req.params;
    //Desestructurando aqui elijo lo que no quiero actualizar
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO validar id contra bd

    if (password) {
        //Encriptar el Password
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }
    //Aqui actualizo pero solo lo que quedo en el resto
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosPost = async (req = request, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Encriptar el Password
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);

    //Aqui guardo los datos en Mongo
    await usuario.save();

    res.json({
        msg: 'post API Controller',
        usuario
    });
}

const usuariosDelete = async (req = request, res = response) => {

    const { id } = req.params;
       
    //Aqui borro cambiando el estado
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});    

    res.json(usuario);
}

const UsuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - Controller'
    });
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    UsuariosPatch
}