const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");


const login = async (req, res = response) => {

    const { correo, password } = req.body;
    try {

        //verificar si esxiste el correo
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario/Contraseña incorrectos - correo'
            })
        }

        //Verificar usuario activo
        if (usuario.estado === false) {
            return res.status(400).json({
                msg: 'Usuario/Contraseña incorrectos - estado'
            })
        }

        //Verificar la contraseña
        const validaPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validaPassword) {
            return res.status(400).json({
                msg: 'Usuario/Contraseña incorrectos - password'
            })
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    login
}