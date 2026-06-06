// AI Tutor controller — uses Pollinations.ai (free, no key needed)
// To upgrade to OpenAI, set OPENAI_API_KEY in your .env

const DEFAULT_SYSTEM_PROMPT = `You are EduStar's AI tutor — a knowledgeable, encouraging, and patient academic assistant for African students from Grade 1 through Form 6.

Your role:
- Explain curriculum topics clearly, adapting your language to the student's grade level
- Support curricula including ZIMSEC (Zimbabwe), ECZ (Zambia), WAEC/NECO (Nigeria), KCSE/CBC (Kenya), NECTA (Tanzania), UNEB (Uganda), WASSCE (Ghana), CAPS/NSC (South Africa), and REB (Rwanda)
- Break down complex topics with examples relevant to African contexts
- Encourage students warmly when they struggle

Guidelines:
- Use clear, simple language appropriate for the student's grade
- Include worked examples where helpful
- Do NOT answer questions unrelated to education
- Keep responses under 600 words unless truly necessary
- Always end with a short encouraging note or a follow-up question`;

const askTutor = async (req, res) => {
    const { messages, system } = req.body;

    if (!messages || messages.length === 0) {
        return res.status(400).json({ ok: false, error: 'No messages provided' });
    }

    const systemPrompt = system || DEFAULT_SYSTEM_PROMPT;

    // Sanitize messages
    const cleanMessages = messages
        .filter(m => m.role && m.content && typeof m.content === 'string')
        .map(m => ({
            role: ['user', 'assistant'].includes(m.role) ? m.role : 'user',
            content: m.content.replace(/<[^>]*>/g, '').trim().substring(0, 4000)
        }));

    if (cleanMessages.length === 0) {
        return res.status(400).json({ ok: false, error: 'Invalid message format' });
    }

    try {
        // Try OpenAI first if key is set
        if (process.env.OPENAI_API_KEY) {
            const result = await callOpenAI(cleanMessages, systemPrompt);
            if (result) return res.json({ ok: true, content: [{ type: 'text', text: result }] });
        }

        // Fall back to Pollinations (free)
        const result = await callPollinations(cleanMessages, systemPrompt);
        if (result) return res.json({ ok: true, content: [{ type: 'text', text: result }] });

        res.status(503).json({ ok: false, error: 'AI service temporarily unavailable. Please try again.' });
    } catch (error) {
        console.error('AI tutor error:', error);
        res.status(500).json({ ok: false, error: 'Something went wrong. Please try again.' });
    }
};

async function callOpenAI(messages, system) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            max_tokens: 1200,
            messages: [{ role: 'system', content: system }, ...messages]
        }),
        signal: AbortSignal.timeout(25000)
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
}

async function callPollinations(messages, system) {
    const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'openai',
            messages: [{ role: 'system', content: system }, ...messages],
            seed: 42,
            private: true
        }),
        signal: AbortSignal.timeout(30000)
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
}

export { askTutor };
