declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string
      PAGE_LIMIT: number
      production: string
      JWT_SECRET: string
      PASSWD_MAX_ATTEMPTS: string
      TOKEN_EXPIRES_IN: string
      REFRESH_TOKEN_EXPIRES_IN: number
    }
  }
}

export { }

