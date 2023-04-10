const { response, request } = require('express');
const { Producto } = require('../models');

const crearProducto = async (req = request, res = response) => {
    //Lo extraigo y lo paso a mayuscula para almacenarlo
    const nombre = req.body.nombre.toUpperCase();

    //Voy a controlar que no exista en la DB
    const productoDB = await Producto.findOne({ nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El Producto ${nombre} ya existe en la DB`
        });
    }

    //Generar la Data a grabar en DB
    const data = {
        nombre,
        usuario: req.usuario._id,
        precio: req.body.precio,
        categoria: req.body.idCategoria,
        descripcion: req.body.descripcion
    }

    //Preparo para guardar
    const producto = new Producto(data);

    //Grabo fisicamente la data
    await producto.save();

    res.status(201).json(producto);
}

// obtenerProductos - paginado - total de productos - populate mongoose
const obtenerProductos = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    //Con esta linea selecciono solo los usuarios con estado activo
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        //Con esta linea cuento todas las categorias
        Producto.countDocuments(query),
        //Con esta linea listo todas las categorias
        Producto.find(query)
            .limit(Number(limite))
            .skip(Number(desde))
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ])

    res.json({ total, productos: productos });
}

// obtenerCategoria - populate
const obtenerProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate([{ path: 'usuario', select: 'nombre' },
        { path: 'categoria', select: 'nombre' }]);

    res.json(producto);
}

const actualizarProducto = async (req = request, res=response) =>{
    const { id } = req.params;
    //Desestructurando aqui elijo lo que no quiero actualizar
    const { _id, estado, ...data } = req.body;

    if( data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;
    
    //Voy a controlar que no exista en la DB    
    const productoDB = await Producto.findOne( {nombre: data.nombre } );

    if (productoDB) {
        return res.status(400).json({
            msg: `El Producto ${data.nombre} ya existe en la DB`
        });
    }

    //Actualizo con la nueva data
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true }).populate([{ path: 'usuario', select: 'nombre' },
    { path: 'categoria', select: 'nombre' }]);

    res.json(producto);

}

const borrarProducto = async (req = request, res = response) => {
    const { id } = req.params;

    //Actualizo el estado a false {new: true} hace que devuelva el registro actualizado
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true }).populate([{ path: 'usuario', select: 'nombre' },
    { path: 'categoria', select: 'nombre' }]);

    res.json(producto);

}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}