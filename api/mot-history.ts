                                                                                                                                                                                                                                                                                                                                           import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    registration,
    clientId = process.env.VITE_DVLA_MOT_CLIENT_ID,
    clientSecret = process.env.VITE_DVLA_MOT_CLIENT_SECRET,
    apiKey = process.env.VITE_DVLA_MOT_API_KEY,
    scopeUrl = process.env.VITE_DVLA_MOT_SCOPE_URL,
    tokenUrl = process.env.VITE_DVLA_MOT_TOKEN_URL,
    motHistoryApiBaseUrl = process.env.VITE_DVLA_MOT_HISTORY_API_BASE_URL
  } = req.body;

  if (!registration) {
    return res.status(400).json({ error: 'Missing registration number' });
  }

  try {
    // Get OAuth token
    const tokenData = new URLSearchParams();
    tokenData.append('grant_type', 'client_credentials');
    tokenData.append('client_id', clientId);
    tokenData.append('client_secret', clientSecret);
    tokenData.append('scope', scopeUrl);

    const tokenResponse = await axios.post(tokenUrl, tokenData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 10000
    });
    const accessToken = tokenResponse.data.access_token;

    // Call MOT History API
    const motResponse = await axios.get(
      `${motHistoryApiBaseUrl}/${registration.replace(/\s+/g, '').toUpperCase()}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000
      }
    );

    return res.status(200).json(motResponse.data);
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({ error: error.response.data });
    }
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
