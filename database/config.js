const mongoose = require('mongoose');

const dbConnection = async() =>{
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGODB_CNN,() => {        
            console.log('Bd online');
        });
    } catch (error) {
        console.log(error);
        throw new Error('Error al inicializar la DB');
    }
}

module.exports={
    dbConnection
}