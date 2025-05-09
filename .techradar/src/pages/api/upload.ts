import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { exec } from 'child_process';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al recibir el archivo' });
      return;
    }

    if (!files.file || files.file.length === 0) {
        res.status(400).json({ message: 'No se recibió ningún archivo' });
        return;
      }
      
    const file = files.file[0];
    const uploadedCsvPath = file.filepath;

    // 🚀 Ejecuta el script pasándole el path del CSV cargado
    const scriptPath = path.resolve(process.cwd(), 'scripts', 'generateMD.ts');


    exec(`ts-node ${scriptPath} ${uploadedCsvPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: 'Error al ejecutar generateMd' });
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      res.status(200).json({ message: 'Script ejecutado correctamente' });
    });
  });
}
