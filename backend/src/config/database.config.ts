import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'crm_user',
    password: process.env.DB_PASSWORD || 'crm_password',
    database: process.env.DB_NAME || 'crm_db',
    entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
    // synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    charset: 'utf8mb4',
    extra: {
      connectionLimit: 10,
      serverTimezone: 'UTC',
    },
    timezone: 'Z',
  }),
);
