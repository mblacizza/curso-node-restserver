const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({   
    nombre: {
        type: String,
        require: [true,'El nombre es obligatorio'],
        unique: true   
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    //Aqui usuario hace referencia a un objeto del Schemma Usario
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

//Voy a sobreescribir un metodo, para lo cual la redefino como funcion normal no de flecha ya que utilizo this
CategoriaSchema.methods.toJSON = function(){
    //Desestructuro para quitar __v y password, lo otro lo almaceno en data lo devuelvo tal cual viene
    const {__v, ...data} = this.toObject();   
    return data;
}

module.exports = model('Categoria',CategoriaSchema);