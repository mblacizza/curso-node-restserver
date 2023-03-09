const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {
  //Aqui controlo los datos aplicando el express-validator antes de enviar el POST
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  next();
}

module.exports = {
  validarCampos
}