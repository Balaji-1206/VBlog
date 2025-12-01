# VBlog – MERN Blogging Platform

A full-stack blogging platform built with the MERN stack. It includes secure user authentication, authoring tools (create/edit/publish), a polished React frontend with an Aurora theme, and a MongoDB-backed REST API.

## Overview
- Frontend: Vite + React, React Router, React Query
- Backend: Node.js, Express, Mongoose
- Database: MongoDB (Atlas or local)
- Auth: JWT access tokens (stored in memory + localStorage rehydration)
- Styling: Lightweight custom CSS, Aurora gradient background

## Features
- Register/Login with bcrypt-hashed passwords and JWTs.
- Auth-protected author endpoints (create, edit, delete, dashboard list).
- Public listing with search, tags, pagination, and post details by slug.
- Drafts vs Published status; only authors can view their own drafts.
- Editor with live Markdown preview; Editor also supports editing via `?id=<postId>`.
- Profile page with stats (total/published/draft), update name, change password.
- Dashboard maintenance actions: publish/unpublish, edit, delete.


