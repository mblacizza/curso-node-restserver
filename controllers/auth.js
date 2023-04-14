const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async (req, res = response) => {

    const { correo, password } = req.body;
    try {

        //verificar si existe el correo
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

const googleSignIn = async( req, res = response) =>{
    const { id_token } = req.body;

    try {

        const {nombre, img, correo} = await googleVerify(id_token);
       
        //Primero voy a verificar si ya existe el correo en mi DB de Mongoose
        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //Tengo q crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                estado: true,
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save(); 
        }//Si ya existe se puede actualiza la data pero por ahora lo dejamos asi

        //SI el usuario en DB esta activo
        if (!usuario.estado){
            return res.status(401).json({
                msg: 'Usuario eliminado'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);
       
        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({            
            msg: 'El token de google no se pudo verificar'
        })
    }

        
}

module.exports = {
    login,
    googleSignIn
}