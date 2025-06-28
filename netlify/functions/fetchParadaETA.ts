import { Handler } from "@netlify/functions";
import axios from "axios";

interface ETAResponse {
  idBusLine: string;
  desBusLine: string;
  minutesArrive: number;
}

interface AggregatedBusETA {
  id: string;
  name: string;
  color: string;
  arrivals: number[];
}

const BASE_URL = "https://www.vitrasa.es/detalleparada";
const DEFAULT_COLOR = "#6666ff";

const params = {
  "p_p_id": "com_ado_portlet_parada_AdoParadaPortlet_INSTANCE_e3K3ns9GxruP",
  "p_p_lifecycle": "2",
  "p_p_state": "normal",
  "p_p_mode": "view",
  "p_p_cacheability": "cacheLevelPage",
  "_com_ado_portlet_parada_AdoParadaPortlet_INSTANCE_e3K3ns9GxruP_cmd": "getETAS",
};

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const stopId = body.stopId;

    if (!stopId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing stopId" }),
      };
    }

    const formData = new URLSearchParams();
    formData.append(
      "_com_ado_portlet_parada_AdoParadaPortlet_INSTANCE_e3K3ns9GxruP_busStopID",
      stopId
    );

    const response = await axios.post(BASE_URL, formData, { params });
    const data = response.data;

    const entries: ETAResponse[] = data?.jsontraffics2 ?? [];

    const grouped: Record<string, AggregatedBusETA> = {};

    for (const entry of entries) {
      const { idBusLine, desBusLine, minutesArrive } = entry;

      if (!grouped[idBusLine]) {
        grouped[idBusLine] = {
          id: idBusLine,
          name: desBusLine,
          color: DEFAULT_COLOR,
          arrivals: [],
        };
      }

      grouped[idBusLine].arrivals.push(minutesArrive);
    }

    const result: AggregatedBusETA[] = Object.values(grouped).map((bus) => ({
      ...bus,
      arrivals: bus.arrivals.sort((a, b) => a - b), // Optional: sort times ascending
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};