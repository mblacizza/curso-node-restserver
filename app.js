//Llamo a las variables de entorno
require('dotenv').config();
//Importo la clase de servidor de express
const Server = require('./models/server');
//Creo mi servidor de express
const server = new Server();

server.listen();

