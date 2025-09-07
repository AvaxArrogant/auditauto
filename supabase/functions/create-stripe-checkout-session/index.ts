import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      return new Response(JSON.stringify({
        error: 'Configuration error',
        message: 'STRIPE_SECRET_KEY is not set in environment variables'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const bodyText = await req.text();
    if (!bodyText || bodyText.trim() === '') {
      return new Response(JSON.stringify({
        error: 'Empty request body',
        message: 'Request body is empty. Please provide the required parameters.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(bodyText);
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Invalid JSON',
        message: 'Request body is not valid JSON: ' + (error instanceof Error ? error.message : String(error))
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const {
      amount,
      productName,
      quantity = 1,
      customerEmail,
      submission_id,
      service_level = 'standard',
      productType = 'dispute_letter',
      paymentMethods = ['card'] // Optional frontend-controlled list
    } = parsedBody;

    if (!amount || !productName || !submission_id) {
      return new Response(JSON.stringify({
        error: 'Missing required fields',
        message: 'amount, productName, and submission_id are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const amountInPence = Math.round(amount * 100);
    const stripeUrl = 'https://api.stripe.com/v1/checkout/sessions';
    const formData = new URLSearchParams();

    // Validate payment methods
    const validMethods = ['card', 'klarna', 'ideal', 'afterpay_clearpay', 'bancontact', 'alipay', 'giropay', 'p24'];
    const methodsToUse = paymentMethods.filter((m: string) => validMethods.includes(m));
    if (methodsToUse.length === 0) methodsToUse.push('card');

    for (const method of methodsToUse) {
      formData.append('payment_method_types[]', method);
    }

    formData.append('mode', 'payment');
    formData.append('success_url', `${Deno.env.get('SITE_URL') || 'https://autoaudit.net'}/success?session_id={CHECKOUT_SESSION_ID}&product_type=${productType}`);
    formData.append('cancel_url', `${Deno.env.get('SITE_URL') || 'https://autoaudit.net'}/dispute-letters`);
    if (customerEmail) formData.append('customer_email', customerEmail);
    formData.append('line_items[0][quantity]', quantity.toString());
    formData.append('line_items[0][price_data][currency]', 'gbp');
    formData.append('line_items[0][price_data][unit_amount]', amountInPence.toString());
    formData.append('line_items[0][price_data][product_data][name]', productName);
    formData.append('metadata[submission_id]', submission_id);
    formData.append('metadata[service_level]', service_level);
    formData.append('metadata[product_type]', productType);

    const response = await fetch(stripeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({
        error: 'Stripe API error',
        message: errorData.error?.message || 'Failed to create checkout session',
        details: errorData
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const session = await response.json();
    return new Response(JSON.stringify({
      success: true,
      sessionId: session.id,
      url: session.url
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
