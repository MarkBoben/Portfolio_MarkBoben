# Portfolio — Mark Boben

Personal portfolio website showcasing internship work, projects, and certifications, with a working contact form backed by a live email-sending API.

**Live site:** https://markboben.github.io/Portfolio_MarkBoben/
**Backend API:** https://portfolio-markboben.onrender.com

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Contact Form Setup](#contact-form-setup)
- [Local Development](#local-development)
- [Deployment](#deployment)

## Overview

A single-page portfolio site with scroll-linked animations, an animated hero canvas, and a functional contact form. The frontend is fully static and hosted on GitHub Pages; the contact form talks to a small Node.js backend hosted on Render, which sends form submissions directly to email via Nodemailer.

## Tech Stack

**Frontend**
- HTML5, CSS3 (custom properties / design tokens)
- Vanilla JavaScript (no frameworks)
- Canvas API for the animated hero background
- SVG for the scroll-linked circuit trace effect

**Backend**
- Node.js + Express
- Nodemailer (Gmail SMTP via App Password)
- CORS-restricted API
- In-memory rate limiting

**Hosting**
- Frontend: GitHub Pages
- Backend: Render (free tier)

## Features

- Responsive, single-page layout with mobile overlay navigation
- Scroll-linked reveal animations with staggered grouping for cards, certifications, and timeline items
- Animated cipher-style hero canvas that reacts to mouse movement
- Full-page animated circuit trace connecting each section
- Working contact form with client-side validation, inline status messages, and disabled-state handling during submission
- Backend input validation, HTML escaping, and basic rate limiting to prevent abuse

## Project Structure

```
index.html      Main page markup, including the contact form
style.css       All styling, including form and responsive rules
script.js       Animations, menu logic, and contact form submit handler
server.js       Express backend — /contact route with Nodemailer
package.json    Backend dependencies
.env.example    Template for required backend environment variables
```

## Contact Form Setup

The contact form posts to a `/contact` endpoint on the backend, which sends an email via Gmail using an App Password (not your regular Gmail password).

Required environment variables on the backend (set in Render, never committed to the repo):

| Variable | Description |
|---|---|
| `GMAIL_USER` | Gmail address used to send the email |
| `GMAIL_APP_PASSWORD` | 16-character Gmail App Password |
| `RECEIVING_EMAIL` | Address that receives form submissions |
| `ALLOWED_ORIGIN` | Frontend URL allowed to call the API (CORS) |

See `.env.example` for the exact format.

## Local Development

Clone the repo and open `index.html` directly in a browser to view the frontend — no build step required.

To run the backend locally:

```bash
npm install
cp .env.example .env
# fill in real values in .env
npm start
```

The server runs on `http://localhost:3000` by default. Update `CONTACT_ENDPOINT` in `script.js` to point to your local backend URL while testing.

## Deployment

**Frontend (GitHub Pages)**
1. Push `index.html`, `style.css`, and `script.js` to the repo root.
2. Go to Settings → Pages → Source: Deploy from branch → `main` → `/ (root)`.

**Backend (Render)**
1. Create a new Web Service on Render, connected to this repo.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add the four environment variables listed above.
5. Once deployed, update `CONTACT_ENDPOINT` in `script.js` with the live Render URL + `/contact`.

Note: on Render's free tier, the backend spins down when idle — the first request after inactivity may take 30–50 seconds to respond while it wakes up.
