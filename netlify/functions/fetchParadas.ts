import { Handler } from "@netlify/functions";
import axios from "axios";
import { Parada } from "../../src/views/models/paradas/Parada";

const BASE_URL = "https://www.vitrasa.es/lineas-y-horarios/todas-las-lineas";
const DEFAULT_COLOR = "#6666ff";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const idBusLine = body.idBusLine;

    if (!idBusLine) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing idBusLine" }),
      };
    }

    const params = {
      "p_p_id": "mx_com_ado_all_lines_web_AllLinesPortlet_INSTANCE_zDp1QpJtQsKA",
      "p_p_lifecycle": "2",
      "p_p_state": "normal",
      "p_p_mode": "view",
      "p_p_cacheability": "cacheLevelPage",
    };

    const formData = new URLSearchParams();
    formData.append("idBusLine", idBusLine);

    const response = await axios.post(BASE_URL, formData, { params });
    const json = response.data;

    const features = json.outTrip?.features;
    if (!Array.isArray(features) || features.length <= 1) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Invalid or empty features list" }),
      };
    }

    const stops = features.slice(1).map((feature: any) => {
      const props = feature.properties;
      const name: string = props.desBusStop;
      const id: string = props.idBusStop;
      const linesRaw: string[] = props.busLineCrossing || [];
      const lines = linesRaw.map((lineNum) => ({ num: lineNum, color: DEFAULT_COLOR}));
      return new Parada(id, id, name, lines);
    });

    console.log(`[fetchParadas] Fetched ${stops.length} stops for idBusLine=${idBusLine}`);

    return {
      statusCode: 200,
      body: JSON.stringify(stops),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};