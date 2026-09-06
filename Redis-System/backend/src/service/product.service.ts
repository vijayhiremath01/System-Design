import { db } from '../config/db.config.js';
import { redisClient } from '../config/redis.config.js';

export const ProductService = async () => {
    try {

        while (true) {

            // Check Redis
            const cachedProducts = await redisClient.get('productsList');

            if (cachedProducts) {
                console.log("Redis HIT");
                return JSON.parse(cachedProducts);
            }

            // Only print MISS for the initial request
            console.log("Redis MISS");

            // Try to acquire lock
            const lock = await redisClient.set(
                'productsList_lock',
                'true',
                {
                    NX: true,
                    EX: 10
                }
            );

            if (lock === 'OK') {

                console.log("🔒 Lock acquired");
                console.log("🔥 DATABASE QUERY");

                // Artificial delay for testing
                await new Promise(resolve => setTimeout(resolve, 1000));

                const list = await db.query("SELECT * FROM fruits");
                const products = list.rows;

                // Store in Redis
                await redisClient.set(
                    'productsList',
                    JSON.stringify(products),
                    {
                        EX: 60
                    }
                );

                console.log("Products stored in Redis");

                // Release lock
                await redisClient.del('productsList_lock');

                console.log("🔓 Lock released");

                return products;
            }

            // Someone else has the lock
            // Wait silently and check Redis again
            await new Promise(resolve => setTimeout(resolve, 50));
        }

    } catch (error) {
        console.error("Error fetching fruits", error);
        throw error;
    }
};