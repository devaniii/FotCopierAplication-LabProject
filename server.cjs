// server.cjs
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const vision = require('@google-cloud/vision');

const app = express();
app.use(cors());
app.use(express.json());

// Middleware para configurar headers COOP y COEP
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// Configuración de Multer para manejar archivos PDF
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configuración del cliente de Vision API
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'path/to/your/service-account-file.json', // Reemplaza con la ruta a tu archivo de clave JSON
});

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/fotCopierDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definir un esquema y modelo para los usuarios
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  commission: { type: String, required: true },
  legajo: { type: String, required: true }
});

const User = mongoose.model('User', userSchema, 'usersClient');

// Definir un esquema y modelo para los pedidos
const pedidoSchema = new mongoose.Schema({
  nombre: String,
  comision: String,
  legajo: String,
  nombreArchivo: String,
  cantidadHojas: Number,
  implementacionIA: Boolean,
  color: String,
  dobleFaz: Boolean,
  anillado: Boolean,
  cotizacion: String,
}, {
  versionKey: false,
});

const Pedido = mongoose.model('Pedido', pedidoSchema, 'pedidosOrder');

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ error: 'Acceso denegado. Token no proporcionado.' });

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Acceso denegado. Token inválido.' });
    req.userId = decoded.id;
    next();
  });
};

// Endpoint para registrar usuarios
app.post('/register', async (req, res) => {
  try {
    const { email, password, name, lastname, commission, legajo } = req.body;

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear una nueva instancia del modelo User
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      lastname,
      commission,
      legajo
    });

    // Guardar en la base de datos
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Endpoint para iniciar sesión
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario por email en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Generar un token JWT
    const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Endpoint para obtener datos de usuario protegido
app.get('/protected-route', verifyToken, async (req, res) => {
  try {
    // Obtener datos del usuario excluyendo la contraseña
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error en ruta protegida:', error);
    res.status(500).json({ error: 'Error en ruta protegida' });
  }
});

// Endpoint para crear un pedido con archivo PDF
app.post('/api/pedidos', upload.single('archivo'), verifyToken, async (req, res) => {
  try {
    const { nombre, comision, legajo, implementacionIA, color, dobleFaz, anillado, cotizacion } = req.body;
    const archivo = req.file;

    // Cargar el archivo PDF y contar las hojas localmente
    const pdfDoc = await PDFDocument.load(archivo.buffer);
    const totalPages = pdfDoc.getPageCount();

    // Enviar el archivo PDF a la API de Cloud Vision para contar las hojas
    const [result] = await client.documentTextDetection({ content: archivo.buffer });
    const totalHojas = result.fullTextAnnotation.pages.length;

    const nuevoPedido = new Pedido({
      nombre,
      comision,
      legajo,
      nombreArchivo: archivo.originalname,
      cantidadHojas: totalHojas,
      implementacionIA: implementacionIA === 'true',
      color,
      dobleFaz: dobleFaz === 'true',
      anillado: anillado === 'true',
      cotizacion,
    });

    await nuevoPedido.save();

    res.status(201).json(nuevoPedido);
  } catch (error) {
    console.error('Error al procesar el pedido:', error);
    res.status(500).json({ error: 'Error al procesar el pedido' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
