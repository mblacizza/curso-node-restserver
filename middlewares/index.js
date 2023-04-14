const validarArchivos = require('../middlewares/validar-archivos');
const validaCampos = require('../middlewares/validar-campos');
const validaJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');

module.exports ={
    ...validarArchivos,
    ...validaCampos,
    ...validaJWT,
    ...validaRoles
}