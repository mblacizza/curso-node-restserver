const { request } = require("express")


const esAdminRole = (req = request, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar rol sin validar token primero'
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN') {
        return res.status(401).json({
            msg: `El usuario ${nombre} no es Administrador`
        });
    }


    next();
}

const tieneRol = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar rol sin validar token primero'
            });
        }

        if( !roles.includes( req.usuario.rol )){
            return res.status(401).json({
                msg: `El rol de usuario ${req.usuario.nombre} no esta habilitado para borrar`
            });
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRol
}

