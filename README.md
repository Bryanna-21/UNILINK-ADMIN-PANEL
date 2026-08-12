# UniLink Admin Panel

Next.js administration panel for the UniLink platform.

## Requirements

- Node.js 20+
- npm 10+
- A running UniLink backend

## Setup

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_API_URL` to the backend API base URL.
3. Set `NEXT_PUBLIC_SOCKET_URL` to the backend Socket.IO URL.
4. Install dependencies with `npm install`.
5. Run `npm run dev`.
6. Run `npm run build` before deployment.

## Authentication note

The current frontend stores the access token in browser storage and mirrors it to a normal cookie so Next.js middleware can protect routes. This is functional, but the production-grade design should move authentication to an HttpOnly, Secure, SameSite cookie issued by the backend.
