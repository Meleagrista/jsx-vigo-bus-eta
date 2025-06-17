import { Handler } from '@netlify/functions';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Linea } from '../../src/views/models/Linea';

const LINEAS_URL = 'https://www.vitrasa.es/lineas-y-horarios/todas-las-lineas';

export const handler: Handler = async () => {
  try {
    const response = await axios.get(LINEAS_URL);
    const html = response.data;
    const $ = cheerio.load(html);

    const scriptTags = $('script').toArray();
    let jsonRaw = '';

    for (const tag of scriptTags) {
      const script = $(tag).html() || '';
      const match = script.match(/const jsonLineas = (\[.*?\]);/s);
      if (match) {
        jsonRaw = match[1];
        break;
      }
    }

    if (!jsonRaw) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'jsonLineas not found' }),
      };
    }

    const parsed: any[] = JSON.parse(jsonRaw);

    const lineas = parsed
      .filter((l) => l.idBusLine && l.descBusLine && l.color)
      .map((l) => {
        const id = l.idBusSAE;
        const color = l.color;
        
        const normalizedDesc = (l.descBusLine || '').replace(/ *\/ */g, ' / ');
        const stops = normalizedDesc.split(/\s*[–-]\s*/).map(s => s.trim());
        let start, end;

        if (stops.length === 1) {
          start = stops[0];
          end = '';
        } else if (stops.length > 2) {
          start = stops[0];
          end = stops[stops.length - 1];
        } else {
          [start, end] = stops;
        }

        return new Linea(id, start || '', end || '', color);
      });

    return {
      statusCode: 200,
      body: JSON.stringify(lineas),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};