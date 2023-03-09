const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Conectar a DB Mongoose
        this.conectarDB();

        //Aqui van los Middlewares
        this.middlewares();        
        //Rutas de mi App
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //Utilizamo sel CORS para proteger el rest server
        this.app.use(cors());

        //Lectura y Parseo del Body
        this.app.use(express.json());

        //Posteo el dir publico
        this.app.use(express.static('public'));
    }

    routes(){
       this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen(){
        this.app.listen( this.port );
    }

}

module.exports = Server;