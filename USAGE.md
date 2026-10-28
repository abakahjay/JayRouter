# Using JayRouter

Everything you can do with JayRouter: one API key that reaches free AI models from
several providers, picks the best one for each request, and switches to another
when one hits its limit.

| | Hosted | On your laptop |
|---|---|---|
| Dashboard | https://jayrouter.onrender.com | http://localhost:5173 (after `npm run dev`) |
| API base URL | `https://jayrouter.onrender.com/v1` | `http://localhost:3001/v1` |
| Interactive API docs | https://jayrouter.onrender.com/v1/docs | http://localhost:3001/v1/docs |

**Your unified key** (starts with `freellmapi-`) is on **Keys → Unified API key**.
Every example below uses it. Never paste it into a public place; regenerate it on
the same page if it leaks.

Hosted limits (set in `render.yaml` for the public demo): 10 API requests per
minute per IP, about 16k tokens per request. Your laptop copy has no such limits.

---

## 1. Chat with free models in the browser

- **Playground**: chat with any model or with `Auto`, set a system prompt,
  temperature, top-p and max tokens, and keep saved conversations.
- Each answer shows which model replied, how long it took, and how many
  providers were skipped before it ("3 fallbacks").

## 2. Call it from your own code (OpenAI-compatible)

Anything that works with the OpenAI API works with JayRouter: change the base URL
and the key.

```python
from openai import OpenAI

client = OpenAI(base_url="https://jayrouter.onrender.com/v1", api_key="freellmapi-...")
reply = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Explain recursion in one paragraph."}],
)
print(reply.choices[0].message.content)
```

```js
import OpenAI from "openai";
const client = new OpenAI({ baseURL: "https://jayrouter.onrender.com/v1", apiKey: "freellmapi-..." });
const reply = await client.chat.completions.create({
  model: "auto",
  messages: [{ role: "user", content: "Write a haiku about Accra." }],
});
```

```bash
curl https://jayrouter.onrender.com/v1/chat/completions \
  -H "Authorization: Bearer freellmapi-..." -H "Content-Type: application/json" \
  -d '{"model":"auto","messages":[{"role":"user","content":"Hi"}]}'
```

Works for: chatbots, website assistants, summarising, translating, extracting data
into JSON, classifying text, writing content, coding helpers, and any other
backend that needs an LLM, including the apps on your FullBackendd.

### Choosing a model

| `model` value | What it does |
|---|---|
| `auto` | Follows your fallback chain (Models page) |
| `auto:smart` | Prefers the most capable models |
| `auto:fast` | Prefers the fastest models |
| `auto:reliable` | Prefers the models with the best recent success rate |
| `auto:balanced` | Default mix of reliability, speed and intelligence |
| `auto:<profile>` | Uses a named routing profile you created on the dashboard (e.g. a `coding` profile gives you `auto:coding`) |
| `gemini-3.5-flash`, `gpt-oss-120b`, … | A specific model (exact ids are on the Models page) |
| `fusion` | Asks several models in parallel, then a judge merges one answer |

### What else the chat API supports

- **Streaming** (`"stream": true`): words appear as they are generated.
- **Tool / function calling**: let the model call your functions.
- **Structured output** (`response_format`): force valid JSON.
- **Vision**: send images along with the text (models that support it).
- **Google Search grounding** on Gemini models: answers backed by live search.
- **Text documents** on the Anthropic route (`/v1/messages`). PDF/DOCX files
  are refused; send their text instead.

## 3. Other API endpoints

| Endpoint | Use it for |
|---|---|
| `POST /v1/chat/completions` | OpenAI chat (most clients) |
| `POST /v1/responses` | OpenAI Responses API (Codex and newer SDKs) |
| `POST /v1/messages` | Anthropic/Claude format: Claude Code and Anthropic SDKs |
| `/v1beta/models/{model}:generateContent` | Native Gemini format: Gemini SDK and Gemini CLI |
| `POST /v1/embeddings` | Embeddings for search, RAG and recommendations (`model: "auto"`) |
| `POST /v1/images/generations` | Image generation (needs a media provider such as Pollinations or Hugging Face) |
| `POST /v1/videos/generations` | Short video generation (Pollinations or Hugging Face) |
| `POST /v1/audio/speech` | Text to speech (needs a media provider) |
| `GET /v1/models` | List the models you can use |
| `GET /v1/usage` | How much you have used this month |
| `/mcp` | MCP server, so ChatGPT and other MCP clients can call JayRouter |

Every response has an `X-Routed-Via` header naming the provider and model that
answered. If it fell over between providers, `X-Fallback-Trail` says which ones
failed and why.

Per-request headers:
- `X-FreeLLM-Cache: on` / `off`: reuse an identical earlier answer (when the cache is on).
- `X-FreeLLM-Compress: lossless` / `standard` / `aggressive`: shrink long prompts.

## 4. Coding agents on free models

Set up on your laptop already (they need `npm run dev` running in this folder,
because they talk to `localhost`):

| Command / tool | What it is |
|---|---|
| `claude-free` | Claude Code on the free models. Plain `claude` stays on your paid account. |
| `codex-free` | Codex on the free models. Plain `codex` is unchanged. |
| `opencode` | OpenCode terminal agent, default model `freellmapi/auto` |
| Continue (VS Code) | Autocomplete and chat in the editor |
| Kilo Code (VS Code) | Agent with an orchestrator mode |

To point one of them at the hosted copy instead, use `https://jayrouter.onrender.com`
as the URL. The **Agents** page lists 20 more tools (Aider, Goose, Crush, Roo
Code, Cline, Qwen Code, …) with a one-line setup command and the manual base
URL/key for each. Check what a setup command writes first with `--dry-run`:
several of them overwrite the tool's main config file.

Free models are good at everyday coding but noticeably weaker than real Claude or
GPT on hard multi-step work.

## 5. Manage providers and keys (Keys page)

- **Add more free providers** to get more capacity: Hugging Face, Zhipu (Z.ai),
  Ollama Cloud, SEA-LION, LongCat, NVIDIA (after phone verification), and more.
  34 providers are supported; add a key and its models join the pool.
- **Check all** tests every key; each shows healthy or what is wrong.
- Turn a key or a whole provider off without deleting it.
- **Monthly budgets** per key so you never exceed a free tier.
- **Client profiles**: extra API keys for different apps, each with its own
  system prompt that is always applied. Give each app its own key and revoke
  one without affecting the others.
- **Revocable URL tokens** (Keys → Agents) for tools that cannot send headers.
- **Outbound proxy** if a provider is blocked on your network.

## 6. Control routing (Models page)

- See the monthly free token budget: about 165M tokens across 32 models today,
  per model and per provider.
- Pick a strategy: Manual (drag to order), Balanced, Smartest, Fastest, Most
  reliable or Custom weights.
- Enable or disable individual models, look at each model's speed, reliability
  and context size, and set up Fusion, embeddings, search and the "Decision"
  model.

## 7. Watch what is happening

- **Analytics**: requests, tokens, latency and success rate per model and
  provider, plus recent calls.
- **Logs**: server warnings and errors.
- `GET /v1/usage` for the same numbers from code.

## 8. Your data and backups

- The hosted copy backs its database up to your FullBackendd (MongoDB) every
  minute, encrypted, and restores it on every restart. Your login, keys, unified
  key and history survive restarts and Render's sleep.
- Manual backups (save/restore a `.sql` file) are on **Keys → Unified API key →
  Backups**. Change your email and password from the ⋯ menu at the top right.
- Keep the `ENCRYPTION_KEY` (in `RENDER-SECRETS.local.txt`, never committed):
  without it the backups cannot be decrypted.

## 9. Run and deploy

| Task | How |
|---|---|
| Start on your laptop | `npm run dev` in this folder |
| Update the hosted copy | Commit and push to `main`; Render redeploys automatically |
| Restart the hosted copy | Render dashboard → jayrouter → Manual Deploy → Restart service |
| First request after idle | The free plan sleeps; the first visit can take about 50 seconds |

## 10. Ideas for projects

- A chat assistant on your portfolio that answers questions about your work.
- AI features in your existing apps through FullBackendd: crop advice in
  GhanaCropGuard, support replies in CleanBridge, product descriptions in
  SeedBridge.
- A WhatsApp or Telegram bot (OpenClaw and Hermes Agent on the Agents page can do
  this).
- Search over your own documents with embeddings (RAG).
- Batch jobs: summarise, translate or tag hundreds of texts at no cost.
- Compare models on the same prompt in the Playground before choosing one for an app.

---

JayRouter is based on [FreeLLMAPI](https://github.com/tashfeenahmed/freellmapi)
by Tashfeen Ahmed (MIT). The full upstream documentation is in [`docs/en`](docs/en/README.md).
