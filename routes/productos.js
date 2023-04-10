const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, tieneRol } = require('../middlewares');
const { crearProducto, 
        obtenerProductos, 
        obtenerProducto,
        actualizarProducto,
        borrarProducto } = require('../controllers/productos');

const { categoriaExiste, productoExiste } = require('../helpers/db-validators');

const router = Router();

//Crear nuevo producto - Privado (cualquiera con token valido)
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,    
    check('idCategoria', 'No es un id valido de MongoDB').isMongoId(),
    validarCampos,
    check('idCategoria').custom(categoriaExiste),
    validarCampos
], crearProducto);

//Obtener todos los productos - Publico
router.get('/', obtenerProductos);

//Obtener un producto x id - Publico
router.get('/:id', [
    check('id', 'No es un id valido de MongoDB').isMongoId(),
    validarCampos,
    check('id').custom(productoExiste),
    validarCampos
], obtenerProducto);

//Actualizar una producto x id - Privado (cualquiera con token valido)
router.put('/:id', [    
    validarJWT,    
    check('id', 'No es un id valido de MongoDB').isMongoId(),
    validarCampos,
    check('id').custom(productoExiste),  
    validarCampos
], actualizarProducto );

//Borrar un producto x id - Privado (ADMIN)
router.delete('/:id', [    
    validarJWT,
    tieneRol('ADMIN'),   
    validarCampos,
    check('id', 'No es un id valido de MongoDB').isMongoId(),
    validarCampos,
    check('id').custom(productoExiste),   
    validarCampos
], borrarProducto );

module.exports = router;