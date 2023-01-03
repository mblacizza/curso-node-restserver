const express = require('express')
const cors = require('cors');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.usuariosPath = '/api/usuarios';

        //Aqui van los Middlewares
        this.middlewares();        
        //Rutas de mi App
        this.routes();
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
