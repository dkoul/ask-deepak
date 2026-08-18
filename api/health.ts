import { getHealthResult, jsonResponse } from '../server/httpApi';

export function GET() {
  return jsonResponse(getHealthResult());
}

export default {
  fetch() {
    return GET();
  },
};
