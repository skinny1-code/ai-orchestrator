/**
 * AI ORCHESTRATOR BACKEND
 * Serverless function that calls all 4 AI APIs
 * Runs on Vercel's edge network
 */

export default async function handler(req, res) {
  // Enable CORS (allow frontend to call this)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problem, apiKeys } = req.body;

    // Validate input
    if (!problem || !apiKeys) {
      return res.status(400).json({ error: 'Missing problem or API keys' });
    }

    console.log('Orchestrating decision for:', problem.substring(0, 50) + '...');

    // Call all 4 AIs in parallel (faster!)
    const [gpt4, claude, gemini, perplexity] = await Promise.allSettled([
      callOpenAI(problem, apiKeys.openai),
      callAnthropic(problem, apiKeys.anthropic),
      callGoogle(problem, apiKeys.google),
      callPerplexity(problem, apiKeys.perplexity)
    ]);

    // Build response object
    const responses = {
      gpt4: gpt4.status === 'fulfilled' ? gpt4.value : `Error: ${gpt4.reason.message}`,
      claude: claude.status === 'fulfilled' ? claude.value : `Error: ${claude.reason.message}`,
      gemini: gemini.status === 'fulfilled' ? gemini.value : `Error: ${gemini.reason.message}`,
      perplexity: perplexity.status === 'fulfilled' ? perplexity.value : `Error: ${perplexity.reason.message}`
    };

    return res.status(200).json({
      success: true,
      responses
    });

  } catch (error) {
    console.error('Orchestration error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}

/**
 * CALL OPENAI GPT-4
 */
async function callOpenAI(problem, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant providing concise, actionable advice for decision-making.'
        },
        {
          role: 'user',
          content: problem
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * CALL ANTHROPIC CLAUDE
 */
async function callAnthropic(problem, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: problem
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Anthropic error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * CALL GOOGLE GEMINI
 */
async function callGoogle(problem, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: problem
              }
            ]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Google error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * CALL PERPLEXITY
 */
async function callPerplexity(problem, apiKey) {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'user',
          content: problem
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Perplexity error: ${error.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
