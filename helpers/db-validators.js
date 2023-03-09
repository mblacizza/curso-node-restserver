const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no existe en la BD`)
    }
}

const mailExiste = async (correo = '') => {
    const existeMail = await Usuario.findOne({ correo });
    if (existeMail) {
        throw new Error(`El correo ${correo} ya esta registrado en la BD`)
    }
}

const idExiste = async (id) => {
    const ExisteId = await Usuario.findById( id );
    if (!ExisteId) {
        throw new Error(`El id ${id} no esta registrado en la BD`)
    }
}

module.exports = {esRolValido, mailExiste, idExiste}