# GrowthSphere Media — Contact Form Backend (Python / Flask)

A minimal API that saves contact form submissions to a database instead
of relying on the visitor's email app.

## Run it locally
```
pip install -r requirements.txt
python app.py
```
It starts on `http://localhost:5000`.

## Endpoints
- `POST /api/contact` — accepts form data `{ name, email, brand, service, budget, details }`
- `GET /api/submissions` — lists everything saved (⚠️ put this behind a
  password before making it public — see "Securing it" below)
- `GET /api/health` — check the server is alive

## Connecting it to the website
In `js/script.js`, the `handleSubmit` function currently opens the
visitor's email client. Once this backend is deployed, replace it with
a `fetch()` call to your deployed URL — for example:

```js
fetch("https://your-backend-url.onrender.com/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, brand, service, budget, details })
});
```

## Deploying it for free
This needs an actual server (unlike the static site), so it can't go on
Netlify. Free options that support Python:
1. **Render.com** — connect your GitHub repo, pick "Web Service," it
   auto-detects Flask. Free tier sleeps after inactivity but wakes on request.
2. **Railway.app** — similar flow, generous free tier.

Both need you to push this folder to a GitHub repo first, then connect
that repo on their site.

## Securing it
Right now `/api/submissions` is open to anyone with the link. Before
deploying publicly:
- Add a simple API key check (a header the frontend sends that only you know)
- Or add a login page in front of it
- Never commit real secrets (email passwords, API keys) into the code —
  use environment variables instead
