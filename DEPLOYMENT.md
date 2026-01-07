# HaxoAcademy Deployment Guide

This guide outlines the steps to deploy the HaxoAcademy LMS to a production environment.

## 1. Architecture Overview
HaxoAcademy uses a decoupled architecture:
- **Frontend**: React (Vite) - Deployed to Vercel/Netlify/AWS S3
- **Backend**: Node.js (Express) - Deployed to Render/Heroku/AWS EC2
- **Database**: MongoDB - Hosted on MongoDB Atlas

## 2. Frontend Deployment (Vercel/Netlify)

### Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Environment Variables
Set these in your frontend host's dashboard:
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 3. Backend Deployment (Render/Heroku/Railway)

### Build Settings
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

### Environment Variables
Set these in your backend host's dashboard:
```env
NODE_ENV=production
PORT=5000 (or determined by host)
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/haxoacademy
JWT_SECRET=your_super_secure_production_secret
FRONTEND_URL=https://your-frontend-domain.com
```

## 4. Database Setup (MongoDB Atlas)
1. Create a simplified cluster on MongoDB Atlas (Free Tier works for testing).
2. Create a database user with read/write permissions.
3. Whitelist your backend IP (or `0.0.0.0/0` for initial testing, though restricted is better).
4. Get the connection string and set `MONGO_URI`.

## 5. Pre-Deployment Checklist
- [ ] **Error Boundary**: Verified global error catching is active.
- [ ] **Form Validation**: Verified registration and course editing inputs are sanitized.
- [ ] **Secrets**: Ensure `JWT_SECRET` is complex and unique.
- [ ] **CORS**: Update `server.js` CORS settings to allow requests ONLY from your production frontend domain.

## 6. Post-Deployment Verification
- Log in with the Admin account.
- Verify that data persists after restarts (MongoDB Atlas).
- Check browser console for any mixed content errors (ensure backend is HTTPS).
