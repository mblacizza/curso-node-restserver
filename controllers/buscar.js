const { response, request } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'roles',
    'productos'
]

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            //Si el usuario existe devuelvo el arreglo si no devuelvo un arreglo vacio
            results: (usuario) ? [usuario] : []
        });
    }

    //Asi defino una expresion regular
    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });
}

const buscarCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({    
            results: (categoria) ? [categoria] : []
        });
    }

     //Asi defino una expresion regular
     const regex = new RegExp(termino, 'i');

     const categorias = await Categoria.find({ nombre: regex, estado: true });
 
     res.json({
         results: categorias
     });
}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({    
            results: (producto) ? [producto] : []
        });
    }

     //Asi defino una expresion regular
     const regex = new RegExp(termino, 'i');

     const productos = await Producto.find({ nombre: regex, estado: true }).populate('categoria','nombre');
 
     res.json({
         results: productos
     });
}

const buscar = (req = request, res = response) => {
    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
    }
}

module.exports = {
    buscar
}