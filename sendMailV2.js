// api/sendMailV2.js
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // debug: show headers in Vercel logs (REMOVE in production)
    console.log('Incoming headers:', req.headers);

    // read the new secret env var
    const SECRET = process.env.API_SECRET_V2 || null;

    if (!SECRET) {
      console.error('Missing API_SECRET_V2 in environment.');
      return res.status(500).json({ error: 'Server misconfigured - no secret (API_SECRET_V2)' });
    }

    // Accept common header keys but prioritize x-api-key
    const incoming =
      req.headers['x-api-key'] ||
      req.headers['x-api_key'] ||
      req.headers['authorization'] ||
      req.headers['x-vercel-key'] ||
      req.headers['x-api-secret'] ||
      req.headers['x-vercel-secret'] ||
      null;

    console.log('Key candidate:', incoming);

    if (!incoming || (incoming !== SECRET && incoming !== `Bearer ${SECRET}`)) {
      console.warn('Forbidden - invalid secret header', { incoming });
      return res.status(403).json({ error: 'Forbidden - invalid secret header' });
    }

    // parse body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!body || !body.to || !body.subject) {
      return res.status(400).json({ error: 'Missing to/subject in payload' });
    }

    // TODO: put actual sending logic here (SMTP, nodemailer, etc.)
    // For now we mock success
    console.log('Accepted send request for', body.to);

    return res.status(200).json({ success: true, info: 'Mock send OK (sendMailV2)' });
  } catch (err) {
    console.error('Handler error', err);
    return res.status(500).json({ error: 'server error', detail: String(err) });
  }
}
