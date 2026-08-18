import { clientIpFromRequest, jsonResponse, processChat } from '../server/httpApi';

export async function POST(request: Request) {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  return jsonResponse(await processChat(body, clientIpFromRequest(request)));
}
