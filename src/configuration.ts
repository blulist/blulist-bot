const configs = {
  APP_MODE: process.env.APP_MODE,
  DATABASE_URL: String(process.env.DATABASE_URL),
  REDIS_URL: String(process.env.REDIS_URL),
  BOT_TOKEN: String(process.env.TELEGRAM_BOT_TOKEN),
};

export default () => configs;
export type ConfigsType = typeof configs;
