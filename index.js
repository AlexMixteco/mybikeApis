const express= require ('express');
const app = express();
app.use(express.json());
const cors = require ('cors');
app.use (cors());

const mongo= require ('./connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = process.env.SECRET_KEY;
const { usuarios, dispositivos, rutas, posiciones } = require('./connection');

// --------- USUARIOS ---------
app.get("/api/usuarios/todos", async (req, res) => {
  try {
    const data = await usuarios.find({});
    res.json(data);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

app.get("/api/usuarios/:id", async (req, res) => {
  try {
    const data = await usuarios.findById(req.params.id);
    res.json(data);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

app.post("/api/usuarios/insertar", async (req, res) => {
  try {
    const data = req.body;
    const newUser = await usuarios.create(data);
    res.json(newUser);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

app.put("/api/usuarios/actualizar/:id", async (req, res) => {
  try {
    const resultado = await usuarios.updateOne({ _id: req.params.id }, { $set: req.body });
    res.json(resultado);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

app.delete("/api/usuarios/eliminar/:id", async (req, res) => {
  try {
    const resultado = await usuarios.deleteOne({ _id: req.params.id });
    res.json(resultado);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

// --------- DISPOSITIVOS ---------
app.get("/api/dispositivos/todos", async (req, res) => {
  try {
    const data = await dispositivos.find({});
    res.json(data);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

app.get("/api/dispositivos/:id", async (req, res) => {
  try {
    const data = await dispositivos.findById(req.params.id);
    res.json(data);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

app.post("/api/dispositivos/insertar", async (req, res) => {
  try {
    const newDisp = await dispositivos.create(req.body);
    res.json(newDisp);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

app.put("/api/dispositivos/actualizar/:id", async (req, res) => {
  try {
    const resultado = await dispositivos.updateOne({ _id: req.params.id }, { $set: req.body });
    res.json(resultado);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

app.delete("/api/dispositivos/eliminar/:id", async (req, res) => {
  try {
    const resultado = await dispositivos.deleteOne({ _id: req.params.id });
    res.json(resultado);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

// --------- RUTAS ---------
app.post("/api/rutas/iniciar", async (req, res) => {
  try {
    const { usuarioId, dispositivoId } = req.body;
    const nuevaRuta = await rutas.create({
      usuarioId,
      dispositivoId,
      estado: "activa",
      fechaInicio: new Date(),
      fechaFin: null
    });
    res.json(nuevaRuta);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

app.put("/api/rutas/finalizar/:id", async (req, res) => {
  try {
    const rutaActualizada = await rutas.updateOne(
      { _id: req.params.id },
      { $set: { estado: "finalizada", fechaFin: new Date() } }
    );
    res.json(rutaActualizada);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

app.get("/api/rutas/usuario/:usuarioId", async (req, res) => {
  try {
    const rutasUsuario = await rutas.find({ usuarioId: req.params.usuarioId }).sort({ fechaInicio: -1 });
    res.json(rutasUsuario);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

// --------- POSICIONES ---------
app.post("/api/posiciones/insertar", async (req, res) => {
  try {
    const { rutaId, lat, lng, impacto, timestamp } = req.body;
    const nuevaPosicion = await posiciones.create({
      rutaId,
      lat,
      lng,
      impacto,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });
    res.json(nuevaPosicion);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

app.post("/api/posiciones", async (req, res) => {
  try {
    const { rutaId, lat, lng, impacto, timestamp } = req.body;
    const nuevaPosicion = await posiciones.create({
      rutaId,
      lat,
      lng,
      impacto,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });
    res.json(nuevaPosicion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/posiciones/ruta/:rutaId", async (req, res) => {
  try {
    const posicionesRuta = await posiciones.find({ rutaId: req.params.rutaId }).sort({ timestamp: 1 });
    res.json(posicionesRuta);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

app.get("/api/rutas/activa/:usuarioId", async (req, res) => {
  try {
    const rutaActiva = await rutas.findOne({
      usuarioId: req.params.usuarioId,
      estado: "activa"
    });
    if (!rutaActiva) return res.status(404).json({ error: "No hay ruta activa" });
    res.json(rutaActiva);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------- EVENTOS ---------
app.post("/api/eventos/insertar", async (req, res) => {
  try {
    const { rutaId, lat, lng, tipo, timestamp } = req.body;
    const nuevoEvento = await posiciones.create({
      rutaId,
      lat,
      lng,
      impacto: tipo === "impacto",
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });
    res.json(nuevoEvento);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

// --------- LOGIN ---------
app.post("/api/login", async (req, res) => {
  try {
    const { correo, contrasenia } = req.body;
    const usuario = await usuarios.findOne({ email: correo });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const isMatch = contrasenia === usuario.password;

    if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: usuario._id, correo: usuario.email }, SECRET_KEY, { expiresIn: "2h" });
    res.json({ token, usuarioId: usuario._id, correo: usuario.email });
  } catch (err) { console.error(err); res.status(500).json({ message: "Error del servidor" }); }
});

// --------- INICIAR SERVIDOR ---------
const PORT = 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));