import dotenv from 'dotenv';

dotenv.config();

export const env = {
    port : process.env.PORT || 3000,
    redisUrl : process.env.REDIS_URL || 'redis://localhost:6379',
    databaseUrl : process.env.DATABASE_URL || 'postgresql://postgres:VIJAY0789vijay@localhost:5433/redis_system'
}
