const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        require: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'El password es obligatorio']
    },
    img: {
        type: String        
    },
    rol: {
        type: String,
        require: true,
        emun: ['ADMIN','USER']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Voy a sobreescribir un metodo, para lo cual la redefino como funcion normal no de flecha ya que utilizo this
UsuarioSchema.methods.toJSON = function(){
    //Desestructuro para quitar __v y password, lo otro lo almaceno en usuario lo devuelvo tal cual viene
    const {__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario',UsuarioSchema);