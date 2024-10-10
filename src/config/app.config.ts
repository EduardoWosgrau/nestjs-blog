export const appConfig = () => ({
  environment: process.env.NODE_ENV || 'production',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    syncronize: process.env.DATABASE_SYNC === 'true',
    autoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true',
  },
});
