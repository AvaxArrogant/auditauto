const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const body = JSON.parse(event.body || '{}');
  const registration = body.registration;

  const clientId = process.env.VITE_DVLA_MOT_CLIENT_ID;
  const clientSecret = process.env.VITE_DVLA_MOT_CLIENT_SECRET;
  const apiKey = process.env.VITE_DVLA_MOT_API_KEY;
  const scopeUrl = process.env.VITE_DVLA_MOT_SCOPE_URL;
  const tokenUrl = process.env.VITE_DVLA_MOT_TOKEN_URL;
  const motHistoryApiBaseUrl = process.env.VITE_DVLA_MOT_HISTORY_API_BASE_URL;

  if (!registration) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing registration number' })
    };
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

    return {
      statusCode: 200,
      body: JSON.stringify(motResponse.data)
    };
  } catch (error) {
    if (error.response) {
      return {
        statusCode: error.response.status,
        body: JSON.stringify({ error: error.response.data })
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: error.message })
    };
  }
};
