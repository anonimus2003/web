const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Multer para subir imágenes
const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Rutas
app.get('/', (req, res) => {
  db.query('SELECT * FROM proyectos', (err, results) => {
    if (err) throw err;
    res.render('index', { proyectos: results });
  });
});

app.post('/agregar', upload.single('imagen'), (req, res) => {
  const { titulo, descripcion, enlace, repositorio } = req.body;
  const imagen = req.file.filename;

  db.query(
      'INSERT INTO proyectos (titulo, descripcion, imagen, enlace, repositorio) VALUES (?, ?, ?, ?, ?)',
      [titulo, descripcion, imagen, enlace, repositorio],
      (err) => {
          if (err) throw err;
          res.status(200).send('Proyecto agregado');// ✅ 
      }
  );
});



  

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});


