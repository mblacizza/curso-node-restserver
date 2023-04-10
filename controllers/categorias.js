const { response, request } = require('express');
const { Categoria } = require('../models');

// obtenerCategorias - paginado - total de categorias - populate mongoose
const obtenerCategorias = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    //Con esta linea selecciono solo los usuarios con estado activo
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        //Con esta linea cuento todas las categorias
        Categoria.countDocuments(query),
        //Con esta linea listo todas las categorias
        Categoria.find(query)
            .limit(Number(limite))
            .skip(Number(desde))
            .populate('usuario', 'nombre')
    ])

    res.json({ total, categorias });
}

// obtenerCategoria - populate
const obtenerCategoria = async (req = request, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario','nombre');

    res.json(categoria);
}

const crearCategoria = async (req = request, res = response) => {
    //Lo extraigo y lo paso a mayuscula para almacenarlo
    const nombre = req.body.nombre.toUpperCase();
    //Voy a controlar que no exista en la DB
    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe en la DB`
        });
    }

    //Generar la Data a grabar en DB
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    //Preparo para guardar
    const categoria = new Categoria(data);
    //Grabo fisicamente la data
    await categoria.save();

    res.status(201).json(categoria);
}

const actualizarCategoria = async (req = request, res = response) => {
    const { id } = req.params;

    //Lo extraigo y lo paso a mayuscula para almacenarlo
    const nombre = req.body.nombre.toUpperCase();

    //Voy a controlar que no exista en la DB
    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe en la DB`
        });
    }

    //Generar la Data para actualizar en DB
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    //Actualizo con la nueva data
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true }).populate('usuario', 'nombre');

    res.json(categoria);

}

const borrarCategoria = async (req = request, res = response) => {
    const { id } = req.params;

    //Actualizo el estado a false {new: true} hace que devuelva el registro actualizado
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true }).populate('usuario', 'nombre');

    res.json(categoria);

}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}