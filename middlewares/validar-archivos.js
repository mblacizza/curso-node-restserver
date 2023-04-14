
const validarArchivos = (req ,res, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo){             
        return res.status(400).send({ msg: 'No se enviaron archivos para subir' });
    }
    return next();
}

module.exports = { validarArchivos }