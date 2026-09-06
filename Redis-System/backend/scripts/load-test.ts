const TOTAL_REQUESTS = 100;
const URL = "http://localhost:3000/fruits";

const requests = Array.from(
    { length: TOTAL_REQUESTS },
    async (_, index) => {
        try {
            const start = Date.now();

            const response = await fetch(URL);

            const duration = Date.now() - start;

            // Read as text first so HTML/error responses don't crash JSON.parse()
            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                console.log(
                    `Request ${index + 1}: ${response.status} - Invalid JSON - ${duration}ms`
                );
                console.log(`Response: ${text.slice(0, 100)}`);
                return null;
            }

            console.log(
                `Request ${index + 1}: ${response.status} - ${duration}ms`
            );

            return data;
        } catch (error) {
            console.error(`Request ${index + 1} failed:`, error);
            return null;
        }
    }
);

await Promise.all(requests);

console.log("Load test completed");
