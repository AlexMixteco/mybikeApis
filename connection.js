const mongoose = require("mongoose");
const { string } = require("yup");
require('dotenv').config();


const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl);


const usersSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
  telefono: String,
  tipo: String, 
}, { versionKey: false });


const dispositivosSchema = new mongoose.Schema({         
  usuarioId: String,
  nombre: String,    
}, { versionKey: false });


const rutasSchema = new mongoose.Schema({
  usuarioId: String, 
  dispositivoId: String,
  estado: String,
  fechaInicio: Date,
  fechaFin: Date,
}, { versionKey: false });

const posicionesSchema = new mongoose.Schema({
    rutaId: String,
    lat:Number,
    lng:Number,
    impacto: Boolean,
    timestamp: { type: Date, default: Date.now }
}, { versionKey: false });
 

module.exports = {
  usuarios: mongoose.model("usuarios", usersSchema),
  dispositivos: mongoose.model("dispositivos", dispositivosSchema),
  rutas: mongoose.model("rutas", rutasSchema),
  posiciones: mongoose.model("posiciones", posicionesSchema),
};
