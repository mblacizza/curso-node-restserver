const { response } = require('express');

const usuariosGet = (req, res = response) => {
//http://localhost:8080/api/usuarios?q=hola&nombre=miguel&apikey=121121
    const {q, nombre, apikey, page ='1'} = req.query;

    res.json({
        msg: 'get API - Controller',
        q,
        nombre,
        apikey,
        page
  });
}

const usuariosPut = (req, res = response) => {
//http://localhost:8080/api/usuarios/10
    const id = req.params.id;

    res.json({
        msg: 'put API - Controller',
        id: id
  });
}

const usuariosPost = (req, res = response) => {
    const { nombre , edad } = req.body;
    res.json({
        msg: 'post API Controller',
        nombre: nombre,
        edad: edad
  });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - Controller'
  });
}

const UsuariosPatch = (req, res = response) => {
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