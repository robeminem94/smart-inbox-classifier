# Smart Inbox Classifier

Smart Inbox Classifier is a practical AI automation web app that classifies incoming business messages, emails, and form submissions into useful categories. It analyzes a message with OpenAI, returns structured business context, suggests the next action, drafts a short reply, and stores saved results in a local inbox dashboard.

This project is designed as a portfolio-ready full-stack application that demonstrates AI-powered automation, API/webhook handling, TypeScript data modeling, dashboard UI, and practical business problem solving.

## Screenshots

Add screenshots here after running the app locally:

- Landing page
- Message analyzer
- Inbox dashboard
- Message detail page
- Webhook settings page

## Why this project matters

Many small businesses receive messages from different channels but do not have a structured process to prioritize them. This app demonstrates how AI can classify messages, suggest actions, generate replies, and support automation workflows.

Instead of treating every inbound message the same way, a business can quickly identify sales leads, urgent complaints, invoice questions, support requests, partnership opportunities, and spam.

## Features

- SaaS-style landing page with clear positioning and use cases
- Manual message analyzer form
- OpenAI-powered message classification
- Structured AI output with category, priority, sentiment, intent, summary, label, confidence score, next action, draft reply, internal note, and automation suggestion
- Clean result cards with copy buttons
- Save analyzed messages to browser local storage
- Inbox dashboard with search, category filter, priority filter, open detail, and delete actions
- Message detail page with full original message and full AI analysis
- Webhook endpoint for inbound messages
- Settings page with webhook URL, example JSON payload, and curl command
- Server-side OpenAI API key usage only
- Basic input validation and API error handling
- Responsive Tailwind CSS interface

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- OpenAI API
- Browser local storage
- Next.js API routes

## How To Run Locally

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.local.example .env.local
```

Add your OpenAI API key to `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Start the development server:

```bash
npm run dev
```

Open the app:

```bash
http://localhost:3000
```

## Environment Variables

```env
OPENAI_API_KEY=
```

Optional model override:

```env
OPENAI_MODEL=gpt-4o-mini
```

The OpenAI key is only used inside server-side API routes and is never exposed to the frontend.

## Example Message

```json
{
  "senderName": "Mark Jansen",
  "senderEmail": "mark@example.com",
  "subject": "Vraag over automatisering",
  "body": "Hi, wij zijn een klein bedrijf met 15 medewerkers en verliezen veel tijd met handmatig overtypen van offerteaanvragen. Kunnen jullie helpen met automatisering?",
  "source": "Website form",
  "businessContext": "Company offers AI automation services for small businesses."
}
```

## AI Output Shape

```json
{
  "category": "Sales Lead | Support | Invoice Question | Complaint | Partnership | Spam | Other",
  "priority": "Low | Medium | High | Urgent",
  "sentiment": "Positive | Neutral | Negative",
  "intent": "",
  "summary": "",
  "suggestedLabel": "",
  "requiresHumanFollowUp": true,
  "confidenceScore": 0,
  "reasoningShort": "",
  "suggestedNextAction": "",
  "draftReply": "",
  "internalNote": "",
  "automationSuggestion": ""
}
```

## Example Webhook Request

Endpoint:

```text
POST /api/inbound-message
```

Example curl request:

```bash
curl -X POST http://localhost:3000/api/inbound-message \
  -H "Content-Type: application/json" \
  -d '{
    "senderName": "Mark Jansen",
    "senderEmail": "mark@example.com",
    "subject": "Vraag over automatisering",
    "body": "Wij verliezen veel tijd met handmatig werk...",
    "source": "Website form",
    "businessContext": "AI automation company for small businesses"
  }'
```

This endpoint can be connected to forms, Make.com, n8n, Zapier, or custom websites.

## Security Notes

The webhook does not include authentication in version 1 because this is a portfolio demo. Before production use, add webhook authentication with a shared secret, API key, HMAC signature verification, or platform-specific verification.

Never expose `OPENAI_API_KEY` in frontend code. Keep it in `.env.local` or your deployment provider's server-side environment variables.

## Project Structure

```text
/app
  /page.tsx
  /analyze
  /inbox
  /messages/[id]
  /settings
  /api/classify-message
  /api/inbound-message
/components
  MessageForm.tsx
  ResultCards.tsx
  InboxTable.tsx
  PriorityBadge.tsx
  CategoryBadge.tsx
  CopyButton.tsx
  EmptyState.tsx
/lib
  aiClassifier.ts
  localStorage.ts
  types.ts
  validation.ts
```

## What I Learned

- How to keep AI API keys server-side in a Next.js App Router application
- How to design a reusable AI classification service for both UI and webhook flows
- How to validate and normalize model output before using it in the interface
- How to build a local-storage backed dashboard for saved AI results
- How to structure a portfolio project around a real business automation use case

## Future Improvements

- Gmail integration
- Slack notifications
- Notion database sync
- Supabase authentication
- Real CRM integration
- Webhook authentication
- Auto-reply mode
- Team inbox
- Analytics dashboard
- Multi-language support
