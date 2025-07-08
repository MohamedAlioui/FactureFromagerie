export default function handler(req, res) {
  res.status(200).json({
    message: "✅ Vercel deployment is working!",
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
} 