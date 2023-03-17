const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole, 
    tieneRol
} = require('../middlewares');


const { esRolValido, mailExiste, idExiste } = require('../helpers/db-validators');

const { usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    UsuariosPatch } = require('../controllers/usuarios');


const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    //Aqui defino los Middlewares para validar la info a actualizar
    check('id', 'No es un id valido de MongoDB').isMongoId(),
    check('id').custom( idExiste ),
    check('rol').custom( esRolValido ),
    validarCampos
], usuariosPut);

router.post('/', [
    //Aqui defino los Middlewares para validar la info a insertar
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('password', 'El password debe ser de mas de 6 letras').isLength({ min: 6 }),    
    check('rol').custom( esRolValido ),
    check('correo','El correo ingresado no es valido').isEmail(),
    check('correo').custom( mailExiste ),    
    validarCampos
], usuariosPost);

router.delete('/:id', [
    //Aqui defino los Middlewares para validar la info a actualizar
    validarJWT,
    //esAdminRole,
    tieneRol('ADMIN','USER'),    
    check('id', 'No es un id valido de MongoDB').isMongoId(),
    check('id').custom( idExiste ),  
    validarCampos
], usuariosDelete);

router.patch('/', UsuariosPatch);

module.exports = router;