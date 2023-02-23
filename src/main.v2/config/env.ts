export default {
  mongoUrl: process.env.MONGO_URI || 'mongodb://mongodb:27017',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'tj67O==5H'
}
