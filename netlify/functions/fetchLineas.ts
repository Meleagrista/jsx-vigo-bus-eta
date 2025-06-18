import { Handler } from '@netlify/functions';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Linea } from '../../src/views/models/lineas/Linea';

const LINEAS_URL = 'https://www.vitrasa.es/lineas-y-horarios/todas-las-lineas';

export const handler: Handler = async () => {
  try {
    // Fetch the HTML content of the Vitrasa lines page
    const response = await axios.get(LINEAS_URL);
    const html = response.data;

    // Load the HTML into cheerio for parsing
    const $ = cheerio.load(html);

    // Look through all <script> tags to find the embedded JSON data
    const scriptTags = $('script').toArray();
    let jsonRaw = '';

    for (const tag of scriptTags) {
      const script = $(tag).html() || '';

      // Search for the variable assignment: const jsonLineas = [...]
      const match = script.match(/const jsonLineas = (\[.*?\]);/s);
      if (match) {
        jsonRaw = match[1]; // Extract just the array content
        break;
      }
    }

    // If we couldn't find the JSON definition, return an error
    if (!jsonRaw) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'jsonLineas not found' }),
      };
    }

    // Parse the raw JSON string into JavaScript objects
    const parsed: any[] = JSON.parse(jsonRaw);

    // Convert each raw line into a Linea instance
    const lineas = parsed
      .filter((l) => l.idBusLine && l.descBusLine && l.color) // Ensure required fields exist
      .map((l) => {

        const id = l.idBusSAE;
        const code = l.idBusLine;
        const color = l.color;

        // Normalize route description
        const normalizedDesc = (l.descBusLine || '').replace(/ *\/ */g, ' / ');
        const stops = normalizedDesc.split(/\s*[–-]\s*/).map(s => s.trim());

        let start, end;

        // Handle cases with unusual formatting or missing end stop
        if (stops.length === 1) {
          start = stops[0];
          end = '';
        } else if (stops.length > 2) {
          start = stops[0];
          end = stops[stops.length - 1];
        } else {
          [start, end] = stops;
        }

        // Create a Linea object for use in the frontend
        return new Linea(id, code, start || '', end || '', color);
      });

    // Return the serialized list of lines as JSON
    return {
      statusCode: 200,
      body: JSON.stringify(lineas),
    };
  } catch (err: any) {
    // Handle errors gracefully
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};