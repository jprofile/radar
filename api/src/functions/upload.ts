import { app } from '@azure/functions';
import Busboy from 'busboy';
import { createWriteStream, mkdirSync } from 'fs';
import { exec } from 'child_process';
import path from 'path';
import os from 'os';

app.http('upload', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const contentType = request.headers.get('content-type') || '';

    if (!contentType.startsWith('multipart/form-data')) {
      return { status: 400, body: 'Expected multipart/form-data' };
    }

    const headers = Object.fromEntries(request.headers.entries());
    const tempDir = path.join(os.tmpdir(), 'uploads');
    mkdirSync(tempDir, { recursive: true });

    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve) => {
      const busboy = Busboy({
        headers: headers as { [key: string]: string }
      });

      let uploadedFilePath = '';

      busboy.on('file', (_fieldname: string, file: any, info: { filename: string }) => {
        const extension = path.extname(info.filename ?? '') || '.csv';
        const safeName = `upload-${Date.now()}${extension}`;
        uploadedFilePath = path.join(tempDir, safeName); // 🟢 actualiza la variable externa correctamente

        context.log(`📥 Guardando archivo: ${uploadedFilePath}`);

        const writeStream = createWriteStream(uploadedFilePath);
        file.pipe(writeStream);
      });

      busboy.on('finish', () => {
        context.log(`✅ Busboy finalizado`);

        if (!uploadedFilePath) {
          context.warn(`⚠️ No se recibió ningún archivo`);
          return resolve({ status: 400, jsonBody: { message: 'No se recibió ningún archivo' } });
        }

        const scriptPath = path.resolve(__dirname, '../../scripts/generateMD.ts');
        context.log(`🚀 Ejecutando script: ${scriptPath}`);

        exec(`npx ts-node ${scriptPath} ${uploadedFilePath}`, (error, stdout, stderr) => {
          if (error) {
            context.error(`❌ Error al ejecutar script: ${error.message}`);
            return resolve({ status: 500, jsonBody: { message: 'Error al ejecutar generateMd' } });
          }

          context.log(`stdout: ${stdout}`);
          context.log(`stderr: ${stderr}`);
          return resolve({ status: 200, jsonBody: { message: 'Script ejecutado correctamente' } });
        });
      });

      context.log('➡️ Iniciando parseo del buffer con busboy...');
      (busboy as any).end(buffer);
    });
  }
});
