import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeederOptions } from 'typeorm-extension';

ConfigModule.forRoot({
  envFilePath: '.env',
});

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'crm_user',
  password: process.env.DB_PASSWORD || 'crm_password',
  database: process.env.DB_NAME || 'crm_db',
  entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  charset: 'utf8mb4',
  // typeorm-extension options
  seeds: [__dirname + '/seeders/*.seeder{.ts,.js}'],
  // factories: [__dirname + '/factories/*.factory{.ts,.js}'],
};

export const AppDataSource = new DataSource(options);
