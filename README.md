# DriveShare – Peer-to-Peer Car Rental

A simple, beautiful web app that connects people who want to rent out their cars with people who need to rent a car.

## Features

- **Search cars by location** – Enter a city or area (Johannesburg, Cape Town, Durban, Pretoria, etc.) and see matching listings.
- **List your car** – Owners can add their vehicle with make, model, year, daily price, location, description and optional image URL.
- **My Listings** – View and remove the cars you have listed (stored locally in your browser).
- **Request to Rent** – One-click interest request (demo – shows a confirmation toast).
- **Seed data** – Comes pre-loaded with sample cars across major South African cities.

## How it works

All data is stored in the browser’s `localStorage`. This makes the app fully functional as a demo without a backend. Each browser has its own listings; the seed cars appear for everyone on first visit.

## Tech

- Plain HTML + Tailwind CSS (CDN)
- Vanilla JavaScript
- No build step required

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy

This is a static site. Deploy the folder to Vercel, Netlify, GitHub Pages, or any static host.

## Future ideas

- Real authentication & user accounts
- Backend database (Supabase / Firebase)
- Image upload
- Real booking & payments (Stripe)
- Messaging between owner and renter
- Map view of available cars
