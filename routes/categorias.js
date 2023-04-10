const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, tieneRol } = require('../middlewares');
const { crearCategoria,
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria,
        borrarCategoria} = require('../controllers/categorias');
const { categoriaExiste } = require('../helpers/db-validators');

const router = Router();

//Obtener todas las categorias - Publico
router.get('/', obtenerCategorias);

//Obtener una categoria x id - Publico
router.get('/:id', [
    check('id', 'No es un id valido de MongoDB').isMongoId(),
    validarCampos,
    check('id').custom(categoriaExiste),
    validarCampos
], obtenerCategoria);

//Crear nueva categoria - Privado (cualquiera con token valido)
router.post('/', [    
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria );

//Actualizar una categoria x id - Privado (cualquiera con token valido)
router.put('/:id', [    
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
    validarCampos,
    check('id', 'No es un id valido de MongoDB').isMongoId(),
    validarCampos,
    check('id').custom(categoriaExiste),   
    validarCampos
], actualizarCategoria );

//Borrar una categoria x id - Privado (ADMIN)
router.delete('/:id', [    
    validarJWT,
    tieneRol('ADMIN'),   
    validarCampos,
    check('id', 'No es un id valido de MongoDB').isMongoId(),
    validarCampos,
    check('id').custom(categoriaExiste),   
    validarCampos
], borrarCategoria );

module.exports = router;