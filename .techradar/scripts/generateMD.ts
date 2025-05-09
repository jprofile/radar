const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const dayjs = require('dayjs');

// const inputCsv = '/home/jsanjose/appdataplatform/radar/Análisis Radares Fase 2 - Cross.2.csv'; // Reemplaza por tu CSV real
const inputCsv = process.argv[2];

const cuadrantesMap: Record<string, string> = {
  'Techniques': 'methods-and-patterns',
  'Methods & Patterns': 'methods-and-patterns',
  'Platforms': 'platforms-and-operations',
  'Platforms & Operations': 'platforms-and-operations',
  'Languages and Frameworks': 'languages-and-frameworks',
  'Languages & Frameworks': 'languages-and-frameworks',
  'Tools': 'tools',
};

const cuadrantesValidos = ['Adopted', 'Adopt', 'Trial', 'Assess', 'Hold'];

function limpiarNombreArchivo(nombre: string): string {
  return nombre.replace(/[\\/:"*?<>|]+/g, '');
}

function crearMdPorFila(row: any, carpetaDestino: string) {
  const titulo = row['Blip'].trim();
  const ring = row['Adoption Level Mutua'].trim().toLowerCase();
  const originalQuadrant = row['Quadrant'].trim();
  const quadrant = cuadrantesMap[originalQuadrant] || 'tools';
  const tags = [row['Original Radar'].trim()];

  if (!cuadrantesMap[originalQuadrant]) {
    tags.push('Error Revisar');
  }

  const descripcion = row['Key Insights'] ? row['Key Insights'].trim() : '';

  const contenido = `---
title: "${titulo}"
ring: ${ring}
quadrant: ${quadrant}
tags: [${tags.map((tag) => `"${tag}"`).join(', ')}]
---

${descripcion}
`;

  const nombreArchivo = limpiarNombreArchivo(titulo) + '.md';
  const rutaArchivo = path.join(carpetaDestino, nombreArchivo);

  fs.writeFileSync(rutaArchivo, contenido, 'utf8');
  console.log(`✅ Archivo generado: ${rutaArchivo}`);
}

async function procesarCsv() {
  const today = dayjs().format('YYYY-MM-DD');
  const carpetaDestino = path.join(process.cwd(), 'data/radar', today);
  if (!fs.existsSync(carpetaDestino)) {
    fs.mkdirSync(carpetaDestino);
  }

  const parser = fs.createReadStream(inputCsv).pipe(parse({ columns: true, trim: true }));

  let totalArchivos = 0;

  for await (const row of parser) {
    const radarValido = ['ThoughtWorks', 'Mutua Madrileña'].includes(row['Original Radar'].trim());
    const adopcionValida = cuadrantesValidos.includes(row['Adoption Level Mutua'].trim());

    if (!radarValido || !adopcionValida) continue;

    if (row['Adoption Level'] === 'Adopted') row['Adoption Level'] = 'Adopt';
    if (row['Adoption Level Mutua'] === 'Adopted') row['Adoption Level Mutua'] = 'Adopt';

    crearMdPorFila(row, carpetaDestino);
    totalArchivos++;
  }

  console.log(`\n${totalArchivos} archivos generados en la carpeta: ${carpetaDestino}`);
}

procesarCsv().catch((err) => console.error('❌ Error:', err));
