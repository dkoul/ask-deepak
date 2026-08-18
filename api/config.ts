import { getConfigResult, jsonResponse } from '../server/httpApi';

export function GET() {
  return jsonResponse(getConfigResult());
}

export default {
  fetch() {
    return GET();
  },
};
