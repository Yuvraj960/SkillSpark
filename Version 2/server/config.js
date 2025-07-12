module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-here',
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/skillspark',
    port: process.env.PORT || 5000
  };