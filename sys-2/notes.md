I remember my first system design interview clearly.
The interviewer said:
Design Twitter.
I froze for three seconds.
Then I started drawing boxes.
User box. Server box. Database box. Arrows between them.
The interviewer watched quietly for about four minutes.
Then he said something I still think about:
You’re designing a solution. I want to watch you understand a problem.
I didn’t get that job.
But that feedback changed how I approach every technical problem since then.
System design interviews aren’t about knowing the right architecture. They’re about demonstrating how you think — how you ask questions, identify constraints, make tradeoffs, and communicate decisions.
This article is everything I’ve learned since that interview.



How System Design Interviews Are Actually Evaluated
Most candidates think the interviewer is checking if they know the “correct” architecture.
That’s not what’s happening.
Interviewers are evaluating five things:
* Clarification — do you ask the right questions before designing?
* Estimation — can you reason about scale with numbers?
* Tradeoffs — do you know why you’re choosing one approach over another?
* Depth — can you go deep on any component when asked?
* Communication — can you explain complex systems clearly?
A perfect architecture presented with zero reasoning scores lower than an imperfect architecture where you walk through every tradeoff out loud.
Keep that in mind as you read through these questions.


The Framework Every Answer Should Follow
Before diving into questions, here’s the framework I use for every system design problem:
Step 1: Clarify requirements (5 minutes)
  - Functional requirements: what must the system do?
  - Non-functional requirements: scale, availability, latency, consistency

Step 2: Estimate scale (3 minutes)
  - Daily Active Users
  - Read/write ratio
  - Data volume per day
  - Storage requirements over 5 years

Step 3: High-level design (10 minutes)
  - Core components
  - Data flow
  - API design

Step 4: Deep dive (15 minutes)
  - Database schema
  - Critical components
  - Bottlenecks and solutions

Step 5: Tradeoffs and improvements (5 minutes)
  - What you'd do differently with more time
  - What monitoring you'd add
  - What could go wrong



SECTION 1: Foundations (Questions 1–5)
1. How do you approach a system design problem you’ve never seen before?
This is the meta-question.
Interviewers sometimes ask it directly.
The answer reveals your process.
Wrong approach:
Jump straight to drawing components.
Right approach:
First, ask clarifying questions:
"Before I start designing, I'd like to understand the requirements better.

Functional:
- What are the core features we must support for v1?
- Which features are out of scope?
- Who are the primary users?

Scale:
- How many daily active users are we expecting?
- What's the expected read-to-write ratio?
- Any specific latency requirements?

Constraints:
- Are there any technology constraints I should know about?
- What's the expected uptime requirement?
- Any geographic distribution requirements?"
This alone separates you from 60% of candidates who start drawing immediately.
Then estimate before designing:
Example: Design a URL shortener

DAU: 100 million users
Write: 100M users × 1 URL/day = ~1,200 writes/second
Read: 100M users × 10 clicks/day = ~12,000 reads/second
Read:Write ratio = 10:1

Storage per URL: 500 bytes (original URL + short URL + metadata)
Daily storage: 1,200 writes/s × 86,400 seconds × 500 bytes = ~52 GB/day
5-year storage: 52 GB × 365 × 5 = ~95 TB
Now you’re designing with context. Not just drawing boxes.



2. What is horizontal vs vertical scaling and when do you use each?
Vertical scaling — give the existing machine more power (bigger CPU, more RAM, faster disk).
Server: 8 cores, 16GB RAM
→ Upgrade to: 32 cores, 128GB RAM
Simple. No application changes needed.
But has hard limits — you can only make one machine so big. And it’s a single point of failure.
Horizontal scaling — add more machines and distribute load across them.
1 server handling 10,000 req/s
→ 10 servers each handling 1,000 req/s
→ Load balancer distributes traffic
More complex — your application must be stateless or handle distributed state. But theoretically unlimited scale and no single point of failure.
When to use which:
Start vertical. It’s simpler and cheaper at small scale.
Switch to horizontal when:
* You hit the machine size ceiling
* You need fault tolerance
* Different components need to scale at different rates
In practice, most systems use both. Vertical for databases (up to a point), horizontal for application servers.



3. What is a Load Balancer and what algorithms does it use?
A load balancer distributes incoming traffic across multiple servers.
                    ┌─── Server 1
Client → Load Balancer ─── Server 2
                    └─── Server 3
Algorithms:
Round Robin — requests go to each server in sequence
Request 1 → Server 1
Request 2 → Server 2
Request 3 → Server 3
Request 4 → Server 1 (cycle repeats)
Simple. Works when servers are identical and requests are similar weight.
Weighted Round Robin — servers get traffic proportional to their capacity
Server 1 (weight: 3) → gets 3 requests
Server 2 (weight: 1) → gets 1 request
Least Connections
New request goes to the server with fewest active connections.
Better when requests vary significantly in processing time.
IP Hash
Same client IP always routes to same server.
Useful for session stickiness.
Health checks
Load balancers continuously probe servers.
Failed health checks remove that server from rotation automatically.




4. What is caching and where do you apply it?
Caching stores frequently accessed data in fast storage (memory) to avoid expensive repeated computation or database queries.
Cache placement options:
Client-side cache:
Browser → [Cache] → Server

CDN cache:
User → [CDN Edge] → Origin Server

Application cache:
Controller → [Redis] → Database

Database cache:
Query → [Query Cache] → Disk
Caching strategies:
Cache-Aside (Lazy Loading)
Read:
1. Check cache
2. If miss: query DB, store in cache, return
3. If hit: return from cache

Write:
1. Write to DB
2. Invalidate cache entry
Write-Through
Write:
1. Write to cache
2. Cache writes to DB synchronously
Read: always hits cache (no misses after first load)
Write-Behind (Write-Back)
Write:
1. Write to cache immediately (fast)
2. Cache asynchronously writes to DB
Risk: data loss if cache crashes before DB write
Read-Through
Read:
1. Application reads from cache only
2. Cache fetches from DB on miss automatically
Cache eviction policies:
* LRU (Least Recently Used) — evict what hasn’t been accessed longest
* LFU (Least Frequently Used) — evict what’s accessed least often
* TTL (Time To Live) — evict after a set time regardless
The cache invalidation problem is one of the hardest in distributed systems. When your DB updates, how do you ensure the cache doesn’t serve stale data? There’s no perfect answer — only tradeoffs between consistency and performance.



5. What is the CAP Theorem?
Every distributed system must make a tradeoff between three properties:
* Consistency ( c )— every read gets the most recent write
* Availability ( A ) — every request gets a response (not necessarily the latest data)
* Partition Tolerance ( P ) — the system continues working despite network failures
The theorem: you can only guarantee two of three simultaneously.
Since network partitions are a reality (not optional), you’re really choosing between CP and AP.
CP systems (consistency over availability)
* When a partition occurs, refuse requests rather than return stale data
* Examples: HBase, Zookeeper, traditional RDBMS
* Use when: Financial transactions, Inventory counts, Anything where stale data causes real harm
AP systems (availability over consistency)
* When a partition occurs, return possibly stale data rather than fail
* Examples: Cassandra, DynamoDB, CouchDB
* Use when: Social media feeds, Product catalogs, Analytics — Where stale data is acceptable.
Interviewer follow-up:
Is it really a strict tradeoff?
Better answer:
CAP is a useful mental model but overly simplified. In practice, network partitions are rare. Most of the time you’re choosing between consistency and latency — which is better captured by the PACELC theorem (Partitioned: choose AP or CP; Else: choose Latency or Consistency).



SECTION 2: Core Design Problems (Questions 6–13)
6. Design a URL Shortener (like bit.ly)
Clarify first:
* Read-heavy or write-heavy? (reads >> writes, ~10:1)
* Custom short URLs needed?
* Analytics required?
* Expiry for URLs?
Estimation:
100M DAU
Writes: 1M new URLs/day = ~12 writes/second
Reads:  10M redirects/day = ~120 reads/second
URL length: ~500 bytes
Storage: 500 bytes × 1M/day × 365 × 5 years = ~900 GB (manageable)
Core Design:
Client → API Gateway → URL Service → Cache (Redis) → DB (PostgreSQL)
       ← 301/302 redirect ←
Short URL generation — the interesting part:
Option 1: MD5 hash of original URL, take first 7 characters
MD5("https://example.com/very/long/url") = "a1b2c3d..."
Short URL: bit.ly/a1b2c3d
Problem: collisions possible, hard to guarantee uniqueness.
Option 2: Base62 encoding of auto-incremented ID
DB auto-increment ID: 100000
Base62(100000) = "q0U"
Short URL: bit.ly/q0U
Clean, no collisions, predictable length growth.
But sequential IDs are guessable.
Option 3: Distributed ID generation (Snowflake)
64-bit ID = timestamp + datacenter ID + machine ID + sequence
Unique across distributed systems, not guessable
Database schema:
CREATE TABLE urls (
    id          BIGSERIAL PRIMARY KEY,
    short_code  VARCHAR(10) UNIQUE NOT NULL,
    long_url    TEXT NOT NULL,
    user_id     BIGINT,
    created_at  TIMESTAMP DEFAULT NOW(),
    expires_at  TIMESTAMP,
    click_count BIGINT DEFAULT 0
);

CREATE INDEX idx_short_code ON urls(short_code);
Redirect flow:
1. GET /abc123
2. Check Redis cache for "abc123"
3. Cache hit → return 301/302 redirect
4. Cache miss → query DB, store in Redis (TTL: 24h), redirect
301 vs 302:
301 Permanent — browser caches it, no future calls to your server. Saves bandwidth but you lose analytics.
302 Temporary — browser always calls your server. You track every click but more server load.



7. Design a Rate Limiter
Why it matters: Prevents abuse, ensures fair usage, protects backend services.
Clarify first:
* Per user? Per IP? Per API key?
* Hard limit (reject) or soft limit (throttle)?
* Distributed (multiple servers) or single server?
Algorithms:
Token Bucket
Bucket holds N tokens
Each request consumes 1 token
Tokens refill at rate R per second
If bucket empty → reject request

Good for: allowing short bursts (bucket can accumulate tokens)
Good for: allowing short bursts (bucket can accumulate tokens).
Sliding Window Log
Store timestamp of every request in last N seconds
If count > limit → reject
If count ≤ limit → allow, add timestamp

Accurate but memory-intensive (stores every timestamp)
Accurate but memory-intensive (stores every timestamp).
Sliding Window Counter
Mix of fixed windows with weighted calculation:
Current window count + (previous window count × overlap percentage)

Memory efficient, approximately accurate
Used by: Cloudflare, most production systems
Memory efficient, approximately accurate.
Used by: Cloudflare, most production systems.
Distributed Rate Limiting with Redis:
@Component
public class RateLimiter {

    private final RedisTemplate<String, String> redis;

    public boolean isAllowed(String userId, int limit, int windowSeconds) {
        String key = "rate:" + userId;
        long now = System.currentTimeMillis() / 1000;
        long windowStart = now - windowSeconds;

        // Atomic Lua script - prevents race conditions
        String luaScript = """
            redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[1])
            local count = redis.call('ZCARD', KEYS[1])
            if count < tonumber(ARGV[2]) then
                redis.call('ZADD', KEYS[1], ARGV[3], ARGV[3])
                redis.call('EXPIRE', KEYS[1], ARGV[4])
                return 1
            end
            return 0
            """;

        Long result = redis.execute(
            new DefaultRedisScript<>(luaScript, Long.class),
            List.of(key),
            String.valueOf(windowStart),
            String.valueOf(limit),
            String.valueOf(now),
            String.valueOf(windowSeconds)
        );

        return result != null && result == 1L;
    }
}
Response headers to always include:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 47
X-RateLimit-Reset: 1718532000
Retry-After: 30 (when rejected)



8. Design a Notification System
Clarify first:
* What channels? (push, email, SMS, in-app)
* Volume? (1M notifications/day vs 1B/day changes everything)
* Real-time or delayed acceptable?
* Priority levels? (OTP must be immediate, marketing can be batched)
High-level design:
API → Notification Service → Message Queue (Kafka)
                                    ↓
                         ┌───────────────────────┐
                         │  Channel Workers      │
                         ├── Email Worker (SES)  │
                         ├── SMS Worker (Twilio) │
                         ├── Push Worker (FCM)   │
                         └── In-App Worker       │
                                    ↓
                              Delivery Tracker
                                    ↓
                              Analytics DB
Why Kafka in the middle?
Without queue: if FCM is slow, your entire notification service slows down. Workers consume at their own pace. Spikes are absorbed. Workers can scale independently.
Template Service:
@Service
public class NotificationTemplateService {

    public String render(String templateId, Map<String, Object> variables) {
        Template template = templateRepository.findById(templateId);
        return templateEngine.process(template.getContent(), variables);
    }
}

// Template: "Hello {{name}}, your OTP is {{otp}}. Valid for {{minutes}} minutes."
// Variables: {name: "John", otp: "123456", minutes: 5}
// Output: "Hello John, your OTP is 123456. Valid for 5 minutes."
User preferences:
CREATE TABLE notification_preferences (
    user_id     BIGINT,
    channel     VARCHAR(20),
    type        VARCHAR(50),
    enabled     BOOLEAN DEFAULT true,
    quiet_start TIME,
    quiet_end   TIME,
    PRIMARY KEY (user_id, channel, type)
);
Retry strategy:
* OTP: retry every 30 seconds, max 3 attempts
* Marketing: retry after 1 hour, max 2 attempts Transactional: retry with exponential backoff, max 5 attempts



9. Design a Search Autocomplete System (Typeahead)
Clarify first:
* How fast must suggestions appear? (< 100ms expected)
* Personalized or global suggestions?
* How many suggestions to show? (typically 5–10)
The interesting part — data structure:
For prefix-based search, a Trie (prefix tree) is the classic answer.
Trie for: ["apple", "app", "application", "apt"]

root
└── a
    └── p
        ├── p (end: "app")
        │   ├── l
        │   │   └── e (end: "apple")
        │   │       └── i
        │   │           └── c
        │   │               └── a
        │   │                   └── t
        │   │                       └── i
        │   │                           └── o
        │   │                               └── n (end: "application")
        └── t (end: "apt")
Problem at scale: A Trie with billions of search terms doesn’t fit in memory of one machine.
Production approach — Precomputed prefix cache:
Offline job (runs hourly):
1. Collect all searches from last 7 days
2. Count frequency per search term
3. For each prefix (up to 50 chars), store top 10 search terms by frequency
4. Store in Redis: "prefix:app" → ["apple", "application", "app store", ...]
@Service
public class AutocompleteService {

    private final RedisTemplate<String, List<String>> redis;

    public List<String> getSuggestions(String prefix) {
        if (prefix.length() < 2) return Collections.emptyList();

        String key = "autocomplete:" + prefix.toLowerCase();
        List<String> cached = redis.opsForValue().get(key);

        if (cached != null) return cached;

        // fallback to DB if not in cache
        List<String> suggestions = searchTermRepository
            .findTopByPrefix(prefix + "%", PageRequest.of(0, 10));

        redis.opsForValue().set(key, suggestions, 1, TimeUnit.HOURS);
        return suggestions;
    }
}
Scaling trick:
The top 1000 most common prefixes handle ~80% of all autocomplete traffic. Cache those aggressively, even in-memory in the application itself.



10. Design a Distributed Cache (like Redis)
Clarify first:
* Read-heavy or write-heavy?
* Consistency requirements?
* What happens on cache node failure?
Core operations:
SET key value EX 3600   (store with TTL)
GET key                  (retrieve)
DEL key                  (invalidate)
INCR counter             (atomic increment)
Sharding — how data is distributed across nodes:
Consistent Hashing:
Imagine a ring of 0 to 2^32 positions
Each cache node claims a position on the ring
Each key hashes to a position
Key is stored on the nearest clockwise node

Benefits:
- Adding/removing a node only remaps 1/N of keys
- Regular hashing remaps almost all keys when N changes

Virtual nodes:
- Each physical node gets multiple positions on the ring
- Distributes load more evenly
Replication for high availability:
Primary node → Replica 1
             → Replica 2

Writes → Primary (then replicated async)
Reads  → Any replica (slightly stale possible)

If primary fails:
1. Sentinel detects failure (within seconds)
2. Promotes best replica to primary
3. Other replicas point to new primary
Eviction policies when memory is full:
* allkeys-lru — evict least recently used from all keys
* volatile-lru — evict LRU only from keys with TTL set
* allkeys-lfu — evict least frequently used
* noeviction — reject new writes (good for session stores where you can’t lose data)



11. Design a Chat Application (like WhatsApp)
Clarify first:
* 1-on-1 only or group chat too?
* Message delivery guarantees? (at-least-once, exactly-once)
* Offline message storage?
* Online presence indicators?
The core challenge: real-time bidirectional communication
HTTP is request-response — the server can’t push to client without client asking first.
Solutions:
* Short polling — client asks every N seconds (wasteful)
* Long polling — client asks, server holds connection until message arrives (better)
* WebSocket — persistent bidirectional connection (best for chat)
@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessage message,
                            Principal principal) {
        message.setSender(principal.getName());
        message.setTimestamp(Instant.now());

        // Save to DB first
        messageRepository.save(message);

        // Push to recipient via WebSocket
        messagingTemplate.convertAndSendToUser(
            message.getRecipient(),
            "/queue/messages",
            message
        );
    }
}
Message delivery flow:
Sender → WebSocket → Chat Server → Message Queue
                                        ↓
                                   Message DB (persist)
                                        ↓
                               Recipient online?
                               YES → push via WebSocket
                               NO  → store in offline queue
                                     → push notification (FCM/APNs)
                                     → deliver when user comes online
Message delivery guarantees:
Sender sends message → Server ACKs receipt
                     → Server delivers to recipient
                     → Recipient ACKs delivery
                     → Server notifies sender: "delivered"
                     → Recipient opens message
                     → Server notifies sender: "read"
Scaling WebSocket connections:
Each WebSocket is a persistent connection. 10M concurrent users = 10M open connections. One server can’t handle this.
￼
Solution: WebSocket Gateway cluster + sticky sessions:
User A connects → Load Balancer (IP hash) → WebSocket Server 3
User A's messages always route to Server 3
Server 3 holds User A's connection
Inter-server messaging via Redis Pub/Sub



12. Design a Video Streaming Service (like YouTube)
Clarify first:
* Upload side or playback side or both?
* Live streaming or recorded video?
* Global distribution needed?
Upload pipeline:
User uploads raw video
       ↓
Object Storage (S3) — raw video stored
       ↓
Message Queue (Kafka) — VideoUploaded event
       ↓
Video Processing Service
  ├── Transcoding: 1080p, 720p, 480p, 360p
  ├── Thumbnail generation
  ├── Audio extraction
  └── Content validation (copyright, policy)
       ↓
CDN — processed videos distributed globally
       ↓
Metadata DB — video title, description, tags, URLs
Why transcode to multiple qualities?
Adaptive Bitrate Streaming (ABR) — the player detects your network speed and switches quality automatically:
Fast connection  → serve 1080p segments
Medium           → switch to 720p
Slow             → switch to 360p
No buffering     → smooth experience regardless of network
Video serving at scale:
User requests video
    ↓
CDN Edge (nearest to user)
    ↓ (cache hit: ~95% of popular videos)
User gets video from nearest edge server
    ↓ (cache miss: rare for popular content)
CDN fetches from Origin (S3)
Database design:
Videos metadata → PostgreSQL (structured, ACID for writes) View counts → Redis (high-frequency increments, batch persist to DB) Comments → Cassandra (high write volume, simple queries) Search index → Elasticsearch (full-text search on title, description, tags)



13. Design a Ride-Sharing Service (like Uber)
Clarify first:
* Matching algorithm scope?
* Geographic coverage?
* Real-time location updates?
* Surge pricing in scope?
The core challenge: location-based matching at scale
Driver sends location every 4 seconds
100,000 active drivers = 25,000 location updates/second
Geospatial indexing:
Standard databases can’t efficiently answer:
Find all drivers within 2km of this point.
Solutions:
Geohash — divides the world into a grid, each cell has a string code:
Geohash of precision 6 covers ~1.2km × 0.6km
"dr5ru7" = a specific cell in New York

Find nearby drivers:
1. Get geohash of rider location: "dr5ru7"
2. Get neighboring cells: ["dr5ru6", "dr5ru5", "dr5ruh", ...]
3. Query Redis: SMEMBERS drivers:dr5ru7, SMEMBERS drivers:dr5ru6, ...
4. Return all drivers in those cells
@Service
public class LocationService {

    private final RedisTemplate<String, String> redis;

    public void updateDriverLocation(String driverId, double lat, double lng) {
        // Redis GEOADD is perfect for this
        redis.opsForGeo().add("drivers", new Point(lng, lat), driverId);
    }

    public List<String> findNearbyDrivers(double lat, double lng, double radiusKm) {
        Circle circle = new Circle(
            new Point(lng, lat),
            new Distance(radiusKm, Metrics.KILOMETERS)
        );
        GeoResults<RedisGeoCommands.GeoLocation<String>> results =
            redis.opsForGeo().radius("drivers", circle);

        return results.getContent().stream()
            .map(r -> r.getContent().getName())
            .collect(Collectors.toList());
    }
}
Matching flow:
Rider requests ride
     ↓
Location Service: find drivers within 2km
     ↓
Matching Service: rank by distance + rating + car type
     ↓
Offer sent to best driver (30 second window)
     ↓
Driver accepts → Trip created
Driver rejects/timeout → Offer sent to next driver
     ↓
Both apps receive real-time trip updates via WebSocket



SECTION 3: Advanced Thinking (Questions 14–20)
14. How do you design for High Availability?
High Availability (HA) means the system remains operational despite component failures. The goal is minimizing downtime.
Eliminate Single Points of Failure at every layer:
DNS Layer:     Multiple DNS providers (Route 53 + Cloudflare)
Load Balancer: Active-Active pair (both handling traffic)
App Servers:   Minimum 2 instances, auto-scaling group
Cache:         Redis Sentinel or Redis Cluster (3+ nodes)
Database:      Primary + Read Replicas, automatic failover
Storage:       S3 (11 nines durability, built-in redundancy)
Network:       Multiple availability zones, redundant paths
Availability math:
99%    uptime = 87.6 hours/year downtime    (unacceptable for most)
99.9%  uptime = 8.76 hours/year downtime   (typical SaaS)
99.99% uptime = 52.6 minutes/year downtime (financial systems)
99.999% uptime = 5.26 minutes/year         (critical infrastructure)
Each “nine” requires significantly more architecture complexity and cost. Know what your system actually needs before over-engineering.
Active-Active vs Active-Passive:
Active-Active: both instances handle traffic. If one fails, the other absorbs load.
Active-Passive: one instance handles traffic. The other is on standby, promoted on failure.
Active-Active is better for performance and HA.
Active-Passive is simpler and cheaper.



15. How do you handle database bottlenecks at scale?
This is where most systems hit their first real scaling wall.
Step 1: Read Replicas
All writes → Primary DB
All reads  → Read Replicas (multiple)
90% of queries are reads → immediate 10x capacity improvement
Step 2: Connection Pooling
Without pooling: each request opens/closes a DB connection (expensive)
With pooling (HikariCP): connections are reused

spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
Step 3: Query Optimization
-- Slow: full table scan
SELECT * FROM orders WHERE user_id = 123;

-- Fast: index scan
CREATE INDEX idx_orders_user_id ON orders(user_id);
SELECT id, status, total FROM orders WHERE user_id = 123;
-- Only select columns you need. Use the index.
Step 4: Sharding
When a single database (even with replicas) can’t handle the write volume:
Shard by user_id:
  User IDs 1–10M       → DB Shard 1
  User IDs 10M–20M     → DB Shard 2
  User IDs 20M–30M     → DB Shard 3

Challenge: cross-shard queries become complex
Solution: avoid queries that need data from multiple shards by design
Step 5: Polyglot persistence
Different data has different access patterns. Use the right database for each:
User profiles        → PostgreSQL (relational, ACID)
Session data         → Redis (fast key-value)
Product catalog      → MongoDB (flexible schema)
Activity logs        → Cassandra (high-write, time-series)
Search               → Elasticsearch (full-text)
Analytics            → ClickHouse/BigQuery (columnar, aggregations)



16. What is a CDN and how does it work?
A Content Delivery Network is a geographically distributed network of servers that caches content close to users.
Without CDN:
User in Mumbai → Origin Server in US East → 200ms latency

With CDN:
User in Mumbai → CDN Edge in Mumbai → 10ms latency
                 (cache hit: ~95%)
What to put on CDN:
* Static assets: images, CSS, JavaScript, fonts
* Video content
* Large file downloads
* API responses that are the same for all users
What NOT to put on CDN:
* User-specific responses
* Frequently changing data
* Sensitive data (authentication tokens, PII)
Cache invalidation strategies:
1. TTL-based: content expires after X seconds automatically
2. Versioned URLs: /static/app.v2.3.js (new URL = fresh cache)
3. Manual purge: CDN API call to invalidate specific paths



17. How do you design for data consistency in distributed systems?
Strong consistency vs eventual consistency isn’t a binary choice. It’s a spectrum.
Strong consistency: Every read gets the most recent write. Slower but simpler to reason about.
Eventual consistency: Reads might get stale data. Eventually all nodes converge. Faster but requires your application to handle inconsistency.
Common consistency patterns:
Read-after-write consistency:
Problem:
User updates profile photo
Immediately views their profile
Read hits a replica that hasn't synced yet
User sees old photo — confusing

Solution:
After a write, route that user's reads to the primary
for a short window (e.g., 60 seconds)
After sync window, reads go back to replicas
Monotonic reads:
User reads a message thread — sees 10 messages
User refreshes — must not see fewer messages (time reversal is jarring)

Solution:
- Sticky sessions: same user always reads from same replica
- Or: client sends last-seen version, server guarantees at least that version
Causal consistency:
User A posts a comment
User B replies to that comment

Any reader who sees User B's reply must also see User A's comment
(effect cannot appear before cause)

Solution: vector clocks or logical timestamps to track causality
When to choose what:
Use Case             | Consistency Level | Why
---------------------|------------------|-------------------------------------
Bank transfer        | Strong           | Wrong balance = real money lost
Inventory count      | Strong           | Overselling = real problem
Social media feed    | Eventual         | Slightly old feed is fine
View/like counts     | Eventual         | ±100 views doesn't matter
User profile reads   | Read-your-writes | User expects to see own changes
Comment threads      | Causal           | Replies must appear after original



18. How do you design a system for global scale?
Going global introduces latency, data residency laws, and consistency challenges that don’t exist in single-region deployments.
Multi-region architecture:
Region: US-East (primary)
Region: EU-West (secondary)
Region: AP-Southeast (secondary)

Each region has:
  - Full application stack
  - Database (primary or replica)
  - Cache cluster
  - CDN edge nodes

Traffic routing:
  - GeoDNS routes users to nearest region
  - US users → US-East
  - European users → EU-West
  - Asian users → AP-Southeast
Data replication across regions:
Active-Passive:
US-East (primary, all writes) → replicated to → EU-West (reads only)
Simple but: EU users pay cross-region latency for writes

Active-Active:
US-East ←→ EU-West (both accept writes)
Complex but: local writes for all users

Conflict resolution needed:
What if same record updated in both regions before sync?
→ Last-write-wins (based on timestamp)
→ Merge strategies (application-specific logic)
→ CRDTs (conflict-free replicated data types) for counters and sets
Data residency compliance:
GDPR (Europe), data localization laws (India, Russia, China) require that user data stays within specific geographic boundaries.
EU users → data must stay in EU-West region
           never replicated to US or Asia

Solution:
- Tenant-level routing: identify user's region at login
- Store region tag with every user record
- All operations for that user route to their region's DB
- Cross-region replication only for non-PII data (product catalog, config)
Latency optimization:
Target latencies:
  Same datacenter:   < 1ms
  Same region:       1–10ms
  Cross-region:      50–150ms
  Cross-continent:   100–300ms

Strategy:
  Writes: accept cross-region latency (less frequent)
  Reads:  always serve from local region (high frequency)
  Static content: CDN (served from edge, < 10ms anywhere)



19. How do you approach capacity planning and estimation?
Interviewers give you this implicitly in every system design. They want to see you reason with numbers, not just draw diagrams.
The numbers every engineer should know:
Latency reference:
  L1 cache:          0.5 ns
  L2 cache:          7 ns
  RAM access:        100 ns
  SSD read:          150 μs
  Network: same DC:  500 μs
  Network: US→EU:    150 ms
  HDD seek:          10 ms

Throughput reference:
  SSD sequential read:    500 MB/s
  Network (1 Gbps):       125 MB/s
  Redis:                  100,000 ops/second (single node)
  PostgreSQL:             10,000–50,000 reads/second (indexed)
  Kafka:                  1,000,000 messages/second (cluster)
Estimation framework — use this in every interview:
Step 1: Users → Requests per second
Step 1: Users → Requests per second
  Daily Active Users: 10M
  Each user: 10 actions/day
  Total actions/day: 100M
  Per second: 100M / 86,400 ≈ 1,200 req/s
  Peak (3× average): 3,600 req/s

Step 2: Requests → Data volume
  1,200 req/s × 1 KB per request = 1.2 MB/s write
  Per day: 1.2 MB/s × 86,400 = ~100 GB/day

Step 3: Data volume → Storage
  100 GB/day × 365 days × 5 years = ~180 TB
  With replication (3×): 540 TB
  With compression (0.5×): 270 TB

Step 4: Storage → Infrastructure
  270 TB / 4 TB per server = ~70 servers (storage)
  3,600 req/s / 1,000 req/s per server = 4 app servers (with headroom: 8)
Bandwidth estimation:
Video streaming service:
  1M concurrent users
  Average video quality: 5 Mbps
  Total bandwidth: 1M × 5 Mbps = 5System Design Interview Tutorial

This tutorial guides you through system design interviews in a structured, lesson-based format. Follow each lesson to learn the principles, frameworks, and practical applications of designing scalable systems.

---

Lesson 1: Introduction to System Design Interviews
Objective: Understand what interviewers evaluate and how to approach system design problems.

* System design interviews assess thinking, not memorized architectures.
* Key evaluation pillars:
    1. Clarification
    2. Estimation
    3. Trade-offs
    4. Depth
    5. Communication
* A clear, reasoned approach scores higher than a rushed perfect diagram.

---

Lesson 2: The 5-Step Design Framework
Objective: Follow a repeatable process to tackle any system design problem.

1. Clarify Requirements (5 min)
    * Functional and non-functional requirements
    * Constraints: latency, availability, compliance
2. Estimate Scale (3 min)
    * DAUs, request per second, read/write ratio, storage needs
3. High-Level Design (10 min)
    * Identify components, data flow, and core APIs
4. Deep Dive (15 min)
    * Database schema, caching, load balancing, failure handling
5. Trade-offs and Improvements (5 min)
    * Discuss bottlenecks, monitoring, and future optimisations

---

Lesson 3: Fundamental Concepts
Objective: Learn the core building blocks of distributed system design.

* Horizontal vs Vertical Scaling
* Load Balancing Algorithms: Round Robin, Weighted, Least Connections, IP Hash
* Caching Strategies: Cache-Aside, Write-Through, Write-Behind, Read-Through
* CAP Theorem and PACELC

---

Lesson 4: Core Design Problems
Objective: Practise with common interview scenarios.

1. URL Shortener (bit.ly)
2. Rate Limiter
3. Notification System
4. Search Autocomplete (Typeahead)
5. Distributed Cache (Redis)
6. Chat Application (WhatsApp)
7. Video Streaming Service (YouTube)
8. Ride-Sharing Service (Uber)

Each problem includes:
* Clarifying questions
* Estimations
* High-level and deep-dive design
* Trade-offs and optimisations

---

Lesson 5: Advanced System Design Principles
Objective: Understand high-level architectural concerns for large-scale systems.

1. Designing for High Availability
    * Eliminate single points of failure
    * Active-Active vs Active-Passive setups
2. Handling Database Bottlenecks
    * Replication, sharding, indexing, polyglot persistence
3. CDN and Global Scale
    * Multi-region deployments, data residency, latency optimisation
4. Consistency Models
    * Strong, eventual, read-your-writes, monotonic, causal
5. Observability and Reliability
    * Monitoring, alerting, logging, and recovery plans

---

Lesson 6: Capacity Planning and Estimation
Objective: Use numbers to reason about scale and infrastructure.

* Estimate DAUs → Requests per second → Data volume → Storage → Servers
* Example: 10M DAUs × 10 actions/day ≈ 1,200 req/s average
* Include bandwidth and storage replication factors

---

Lesson 7: Quick Reference Cheat Sheet
Problem	Solution	When to Use
Too many reads	Read replicas + Cache (Redis)	Read:Write > 5:1
Too many writes	Sharding + Message queues	Write heavy
Global latency	CDN + Multi-region	Multi-continent users
Service failures	Circuit breaker + Retry + Fallback	External dependencies
Data loss risk	Replication + Backup + Outbox	Production systems
Slow queries	Indexes + Optimisation + Caching	Query > 100ms
Traffic spikes	Auto-scaling + Rate limiting + Queue	Spiky traffic
Search	Elasticsearch + Autocomplete cache	Full-text search
Real-time updates	WebSocket + Redis Pub/Sub	Chat, dashboards
Large file storage	Object storage (S3) + CDN	Media content
Audit trail	Event Sourcing + Append-only log	Compliance use
---

Lesson 8: Final Thoughts
Objective: Internalise the mindset of a system design architect.

* Focus on reasoning, not memorisation
* Make assumptions explicit
* Choose boring, reliable technology
* Solve for 10× current scale, not 1000×
* Design for detectable and recoverable failures
* Always ask: What is the simplest thing that could possibly work?

With these lessons, you can confidently approach any system design interview and demonstrate expert-level thinking.
 Tbps

This is why YouTube needs a massive CDN.
No single origin server handles 5 Tbps.
CDN edge nodes absorb 95%+ of this traffic.



20. What separates a good architecture from a great one?
This is the closing question. Sometimes asked directly. Always evaluated throughout.
After years of designing and reviewing systems, here’s what I’ve learned distinguishes great architecture:
Great architectures are boring.
The best systems I’ve worked on used PostgreSQL, Redis, Kafka, and NGINX.
No exotic databases.
No bleeding-edge frameworks.
Technologies the entire team understood deeply.
Exotic choices introduce operational risk.
When your Cassandra node fails at 2AM, you need someone who knows Cassandra.
Boring technology has better documentation, more Stack Overflow answers, and more engineers who can maintain it.
Great architectures are reversible.
The decisions that are hardest to change later — database choice, service boundaries, data model — are made with the most care.
But everything else is designed to be replaceable.
Abstractions that enable change:
- Repository pattern: swap PostgreSQL for MongoDB without changing business logic
- Message queue: swap RabbitMQ for Kafka without changing producers/consumers
- Feature flags: change behavior without deployments
Great architectures match scale to reality.
I’ve seen startups with 10,000 users build microservices with Kubernetes, Istio, and distributed tracing.
I’ve seen enterprises with 10M users running a clean monolith that deploys in 5 minutes.
What scale are we at TODAY?
What scale do we expect in 12 months?
What is the cost of over-engineering for scale we may never reach?
What is the cost of under-engineering and hitting a wall?
Design for 10× your current scale.
Not 1000×.
You don’t know what 1000× looks like yet.
And if you get there, you’ll have resources to redesign.
Great architectures have observable failure modes.
Every system fails.
Great architectures fail in ways you can detect, diagnose, and recover from quickly.
For every component, ask:
- How will I know when this fails? (alerting)
- How will I find what caused it? (tracing, structured logs)
- How will users be affected? (graceful degradation)
- How do I recover? (runbooks, automated failover)
- How do I prevent it next time? (post-mortem process)
A system with 99.9% uptime and a 5-minute MTTR (mean time to recovery) is better than a system with 99.99% uptime and a 4-hour MTTR.
The first one’s outages are shorter and less painful.
Great architectures are designed for the team, not just the problem.
Conway’s Law is real:
Organizations build systems that mirror their communication structure.
A 5-person team maintaining 15 microservices will spend most of their time on orchestration, not features.
A 50-person team with a monolith will have merge conflicts and deployment bottlenecks every day.
The best architecture is the one your team can actually operate.



The One Question That Changes Everything
After going through 20 questions, there’s one underlying question that great architects ask constantly:
What is the simplest thing that could possibly work?
Not the most clever.
Not the most scalable.
Not the most fault-tolerant.
The simplest thing that solves today’s problem, with clear extension points for tomorrow’s problems.
Start there.
Add complexity only when reality demands it — not when imagination suggests it.
That’s how senior engineers think.
That’s how architects decide.
And that’s what interviewers are really looking for when they say:
Design Twitter.
They’re not looking for Twitter’s architecture.
They’re looking for how you think.



Quick Reference Cheat Sheet
Problem                  | Solution                                   | When to use
-------------------------|--------------------------------------------|------------------------
Too many reads           | Read replicas + Cache (Redis)              | Read:Write > 5:1
Too many writes          | Sharding + Message queues                  | Write bottleneck on primary
Global latency           | CDN + Multi-region                         | Users in multiple continents
Service failures         | Circuit breaker + Retry + Fallback         | Dependent services
Data loss risk           | Replication + Backup + Outbox pattern      | Any production system
Slow queries             | Indexes + Query optimization + Caching     | Query time > 100ms
Traffic spikes           | Auto-scaling + Rate limiting + Queue       | Unpredictable load
Search                   | Elasticsearch + Autocomplete cache         | Full-text or fuzzy search
Real-time updates        | WebSocket + Redis Pub/Sub                  | Chat, live dashboards
Large file storage       | Object storage (S3) + CDN                  | Images, video, documents
Audit trail              | Event Sourcing + Append-only log           | Finance, compliance
Cross-service data       | CQRS + Materialized views                  | Complex read queries
Final Thoughts
I used to think system design was about memorizing architectures.
Design Twitter → use these components.
Design Uber → use those components.
It took a few years of production experience to realize that’s completely backwards.
Every system is different.
Every team is different.
Every scale requirement is different.
What stays the same is the thinking process.
Ask the right questions.
Estimate with numbers.
State your assumptions out loud.
Choose boring technology.
Make tradeoffs explicit.
Know what you don’t know.
That’s what the interviewer is watching for from the moment you pick up the marker.
Not whether you know what database YouTube uses.
