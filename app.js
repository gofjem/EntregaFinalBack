import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import viewRouter from './routes/views.router.js'
import { Server } from 'socket.io';
import http from 'http';
import mongoose from 'mongoose'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connect to server and connect to  database 
mongoose.connect('mongodb://localhost:27017/ecommerce', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Set up handlebars
app.engine('handlebars', handlebars({
  defaultLayout:'main',
  extname: '.hbs',
  partialsDir: `${__dirname}/views/partials`
}));
app.set('view engine', 'handlebars');

// Set up routes
app.use('/', viewRouter);

// Set up socket.io
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado...');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  socket.on('chat message', (msg) => {
    console.log(`Message from ${socket.id}: ${msg}`);
    io.emit('chat message', msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server corriendo en el puerto ${PORT}`);
});





