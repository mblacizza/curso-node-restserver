const fs = require('fs');
const path = require('path');

const cloudinary = require('cloudinary').v2

const { response, request } = require('express');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async (req = request, res = response) => {
    try {
        const extensionesValidas = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];
        const nombre = await subirArchivo(req.files, extensionesValidas, 'imagenes');

        res.json({ nombre })
    } catch (msg) {
        res.status(400).json({ msg })
    }

}
//Esta es si utilizo un servidor local
const actualizarImagen = async (req = request, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe usuario con id ${id}` });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe producto con id ${id}` });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esta opcion...' })
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        //Borro la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const extensionesValidas = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];
    modelo.img = await subirArchivo(req.files, extensionesValidas, coleccion);

    await modelo.save();

    res.json({ modelo });
}

const actualizarImagenCloudinary = async (req = request, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe usuario con id ${id}` });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe producto con id ${id}` });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esta opcion...' })
    }

    //Limpiar imagenes previas de Cloudinary
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');

        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;

    await modelo.save();

    res.json({ modelo });
}

const mostrarImagen = async (req = request, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe usuario con id ${id}` });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe producto con id ${id}` });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esta opcion...' })
    }
    let pathImagen = path.join(__dirname, '../assets', 'no-image.jpg');
    //Buscar la imagen
    if (modelo.img) {
        pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    res.sendFile(pathImagen);
}

const mostrarImagenCloudinary = async (req = request, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe usuario con id ${id}` });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe producto con id ${id}` });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esta opcion...' })
    }
    let pathImagen = path.join(__dirname, '../assets', 'no-image.jpg');
    //Buscar la imagen
    if (modelo.img) {        
        return res.redirect(modelo.img);
    }
    
    res.sendFile(pathImagen);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen,
    mostrarImagenCloudinary
}