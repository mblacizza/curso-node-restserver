const { Categoria, Usuario, Producto } = require('../models');
const Role = require('../models/role');
//const Usuario = require('../models/usuario');

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

const categoriaExiste = async (id) => {
    const ExisteCategoria = await Categoria.findById( id );
    if (!ExisteCategoria) {
        throw new Error(`La Categoria ${id} no esta registrada en la BD`)
    }
}

const productoExiste = async (id) => {
    const ExisteProducto = await Producto.findById( id );
    if (!ExisteProducto) {
        throw new Error(`LEl Producto ${id} no esta registrado en la BD`)
    }
}

// Validar colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) =>{
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida`);
    }
    return true;
}


module.exports = {
    esRolValido, 
    mailExiste, 
    idExiste, 
    categoriaExiste, 
    productoExiste, 
    coleccionesPermitidas
}