const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Pasta onde os sites serão salvos (ajuste conforme desejar)
const SITES_DIR = path.join(__dirname, 'sites');

// Cria pasta sites e temp_uploads se não existir
if (!fs.existsSync(SITES_DIR)) fs.mkdirSync(SITES_DIR);
if (!fs.existsSync(path.join(__dirname, 'temp_uploads')))
  fs.mkdirSync(path.join(__dirname, 'temp_uploads'));

// Configuração Multer para receber os arquivos fotosCasal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Cria pasta temporária para uploads
    cb(null, path.join(__dirname, 'temp_uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});
const upload = multer({ storage });

// Endpoint para criar site
app.post('/api/create-site', upload.array('fotosCasal'), (req, res) => {
  try {
    const { siteId, coupleName, relationshipDate, loveDeclaration, createdAt } = req.body;
    if (!siteId) return res.status(400).json({ error: 'siteId é obrigatório' });

    // Cria pasta do site se não existir
    const siteFolder = path.join(SITES_DIR, siteId);
    if (!fs.existsSync(siteFolder)) fs.mkdirSync(siteFolder);

    // Salva as fotos no siteFolder
    req.files.forEach((file, index) => {
      const destPath = path.join(siteFolder, file.originalname);
      fs.renameSync(file.path, destPath); // move do temp para a pasta final
    });

    // Cria um arquivo index.html simples usando os dados enviados
    const htmlContent = `
      <html>
      <head><title>Site de ${coupleName}</title></head>
      <body>
        <h1>Casal: ${coupleName}</h1>
        <p>Data do relacionamento: ${relationshipDate}</p>
        <p>Declaração de amor: ${loveDeclaration}</p>
        <p>Criado em: ${createdAt}</p>
        <div>
          ${req.files
            .map(
              (file) =>
                `<img src="./${file.originalname}" alt="Foto do casal" style="max-width:200px;margin:10px"/>`
            )
            .join('')}
        </div>
      </body>
      </html>
    `;

    // Salva o HTML no siteFolder
    fs.writeFileSync(path.join(siteFolder, 'index.html'), htmlContent);

    // Retorna um submission_id (pode ser o siteId mesmo)
    return res.json({ submission_id: siteId });
  } catch (err) {
    console.error('Erro no backend:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Cria pasta public/uploads se não existir
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Endpoint para upload de imagens públicas
app.post('/api/upload', multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '_' + file.originalname);
    },
  })
}).array('fotosCasal'), (req, res) => {
  try {
    // Gera URLs públicas para cada imagem
    const urls = req.files.map(file => '/uploads/' + path.basename(file.path));
    return res.json({ urls });
  } catch (err) {
    console.error('Erro no upload:', err);
    return res.status(500).json({ error: 'Erro ao fazer upload das imagens' });
  }
});

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
