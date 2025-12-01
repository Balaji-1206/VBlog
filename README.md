# VBlog

Full-stack MERN blogging platform.

## Setup

### Backend
1. Create `.env` in `server` based on `.env.example`.
2. Install dependencies:
```
cd server
npm install
```
3. Run dev:
```
npm run dev
```

### Frontend
1. Install dependencies:
```
cd ../client
npm install
```
2. Run dev:
```
npm run dev
```

Set `VITE_API_URL` in a `client/.env` if your API is not `http://localhost:5000/api`.

## Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/posts`
- `GET /api/posts`
- `GET /api/posts/:slug`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`
- `GET /api/posts/dashboard/mine`

## Deploy Notes
- Use MongoDB Atlas; set `MONGODB_URI`.
- Keep `JWT_SECRET` secret.
- Enable HTTPS and CORS.
