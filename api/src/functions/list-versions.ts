import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { promises as fs } from 'fs';
import path from 'path';

app.http('list-versions', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (_req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const radarDir = path.resolve(__dirname, '../../../.techradar/data/radar');
      const files = await fs.readdir(radarDir);
      return {
        jsonBody: files,
      };
    } catch (error: any) {
  return {
    status: 500,
    jsonBody: {
      error: 'No se pudo leer el directorio',
      message: error.message,
      stack: error.stack,
    },
  };
}

  },
});
