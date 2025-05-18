import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new formidable.IncomingForm({
    multiples: true,
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao fazer upload das imagens' });
    }

    const fotosCasal: string[] = [];
    if (files.fotosCasal) {
      const fotos = Array.isArray(files.fotosCasal) ? files.fotosCasal : [files.fotosCasal];
      for (const foto of fotos) {
        const fileName = path.basename(foto.filepath);
        fotosCasal.push(`/uploads/${fileName}`);
      }
    }

    const submission_id = uuidv4();
    // Aqui você pode salvar os dados em um banco ou arquivo se quiser
    console.log('Novo site criado com os dados:', {
      submission_id,
      ...fields,
      fotosCasal,
    });

    return res.status(200).json({ submission_id, fotosCasal });
  });
}
