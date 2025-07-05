# 🚀 Deployment Guide - Fromagerie Alioui Invoice App

This guide will help you deploy your full-stack invoice management application to various cloud platforms.

## 📋 Prerequisites

1. **MongoDB Database**: You'll need a MongoDB instance (MongoDB Atlas recommended)
2. **Environment Variables**: Set up the required environment variables
3. **Git Repository**: Code should be in a Git repository (GitHub recommended)

## 🔐 Required Environment Variables

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fromagerie-invoices
JWT_SECRET=your-super-secure-jwt-secret-key-here
PORT=5000
NODE_ENV=production
```

## 🌐 Deployment Options

### Option 1: Railway (Recommended for Beginners)

**Why Railway?**

- Easiest setup for full-stack apps
- Automatic HTTPS
- Built-in database options
- Great free tier

**Steps:**

1. Create account at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Click "Deploy from GitHub repo"
4. Add environment variables in the Variables tab
5. Deploy automatically!

**Cost**: Free tier available, then $5/month

---

### Option 2: Render

**Why Render?**

- Great free tier
- Easy database integration
- Automatic builds from Git

**Steps:**

1. Create account at [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repo
4. Use these settings:
   - Build Command: `npm run build:prod`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy!

**Cost**: Free tier available

---

### Option 3: Vercel + MongoDB Atlas

**Why Vercel?**

- Excellent for React apps
- Great performance
- Easy custom domains

**Steps:**

1. Set up MongoDB Atlas database
2. Create account at [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables
5. Deploy automatically!

**Cost**: Free tier for hobby projects

---

### Option 4: Heroku

**Steps:**

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_connection_string
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set NODE_ENV=production
   ```
5. Deploy: `git push heroku main`

**Cost**: $7/month minimum

---

### Option 5: Docker + DigitalOcean/AWS

**Steps:**

1. Build Docker image: `docker build -t fromagerie-app .`
2. Push to Docker Hub or container registry
3. Deploy to your preferred cloud provider
4. Set environment variables
5. Run container

**Cost**: Varies by provider

## 🗄️ Database Setup (MongoDB Atlas)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create a new cluster (free tier M0)
4. Create database user
5. Add IP address to whitelist (0.0.0.0/0 for all IPs)
6. Get connection string
7. Replace `<password>` with your database user password

## ✅ Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can create invoices
- [ ] Can manage clients
- [ ] Admin features work (if admin user)
- [ ] PDF generation works
- [ ] Custom domain configured (optional)

## 🔧 Troubleshooting

### Common Issues:

**"Cannot connect to database"**

- Check MONGODB_URI is correct
- Ensure database user has proper permissions
- Verify IP whitelist includes your server's IP

**"JWT Secret not found"**

- Set JWT_SECRET environment variable
- Use a long, random string (recommended: 64+ characters)

**"API routes not working"**

- Ensure API_BASE_URL is configured correctly
- Check that backend routes are properly deployed

**"Build fails"**

- Check that all dependencies are in package.json
- Ensure build script completes successfully locally

## 📞 Support

If you encounter issues:

1. Check the deployment platform's logs
2. Verify all environment variables are set
3. Test the app locally first
4. Check database connectivity

## 🔄 Auto-Deployment

Most platforms support automatic deployment from Git:

- Push changes to your main branch
- Platform automatically rebuilds and deploys
- Zero-downtime deployments

## 🎯 Recommended Setup for Production

1. **Platform**: Railway or Render (easiest)
2. **Database**: MongoDB Atlas (free tier)
3. **Domain**: Custom domain through your platform
4. **Monitoring**: Platform's built-in monitoring
5. **Backups**: MongoDB Atlas automatic backups

Happy deploying! 🚀
