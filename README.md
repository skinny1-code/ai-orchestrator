# 🚀 AI Orchestrator

Multi-AI decision engine that queries **GPT-4**, **Claude**, **Gemini**, and **Perplexity** simultaneously to help you make better decisions.

## 🎯 What It Does

Ask any question or describe any problem. The AI Orchestrator will:
1. Send your question to all 4 major AI models
2. Collect their responses in parallel
3. Display all perspectives side-by-side
4. Help you make an informed decision

## 🛠️ Tech Stack

- **Frontend**: Pure HTML/CSS/JavaScript (no frameworks)
- **Backend**: Vercel Serverless Functions (Node.js)
- **APIs**: OpenAI, Anthropic, Google, Perplexity

## 📦 Project Structure

```
ai-orchestrator/
├── index.html          # Frontend UI
├── api/
│   └── orchestrate.js  # Backend serverless function
├── package.json        # Dependencies
├── vercel.json         # Vercel configuration
└── README.md           # This file
```

## 🚀 Deploy Your Own

### 1. Fork This Repo

Click the "Fork" button at the top right

### 2. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR-USERNAME/ai-orchestrator)

### 3. Add Environment Variables (Optional)

In Vercel dashboard → Settings → Environment Variables:

```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
PERPLEXITY_API_KEY=pplx-...
```

*Note: API keys can also be entered directly in the UI*

### 4. Done!

Your app is now live at `https://your-app.vercel.app`

## 🔑 Getting API Keys

- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/
- **Google**: https://makersuite.google.com/app/apikey
- **Perplexity**: https://www.perplexity.ai/settings/api

## 💡 Usage

1. Open your deployed app
2. Click "Configure API Keys"
3. Paste your 4 API keys
4. Enter your problem/question
5. Click "Orchestrate Decision"
6. Get 4 AI perspectives instantly!

## 🔒 Security

- API keys are stored in browser localStorage (never sent to any server except official AI APIs)
- All API calls go through your own serverless function
- No data is logged or stored anywhere

## 📝 License

MIT - Feel free to use this for anything

## 👤 Author

Built by **Raw**

---

**Questions?** Open an issue on GitHub
