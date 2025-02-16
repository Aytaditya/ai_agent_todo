import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://admin:admin@localhost:5431/postgres"
  },
});
