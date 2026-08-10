SECTION 1: CORE JAVA FUNDAMENTALS 1. Why is String immutable in Java?
Explain the design decision and its implications. 2. What happens when
you override equals() but not hashCode()? Explain the contract. 3.
Explain the difference between == and equals() with examples that
confuse developers. 4. How does Java handle method overloading with null
parameters? What are the edge cases? 5. What's the difference between
final, finally, and finalize()? Why is finalize() deprecated? 6. Explain
Java's integer caching mechanism and how it can cause subtle bugs. 7.
What happens when you call a method on a null object reference? What are
the surprising cases? 8. Explain the initialization order in Java ---
static blocks, instance blocks, constructors, inheritance. 9. How does
Java handle method overriding with covariant return types and
exceptions? 10. What are the differences between ArrayList.subList() and
creating a new list? What are the gotchas? 11. Explain autoboxing and
unboxing. What are the performance implications? 12. How does Java
handle varargs? What happens when you pass null or empty array? 13.
Explain the difference between checked and unchecked exceptions. When
should you use each? 14. How does try-with-resources work internally?
What are the requirements? 15. What is the difference between String,
StringBuffer, and StringBuilder? When to use each? 16. Explain the
clone() method. Why is it problematic and what are the alternatives? 17.
How does Java handle method resolution in inheritance? Explain method
hiding vs overriding. 18. What is the difference between this() and
super()? When can you call them? 19. Explain the transient keyword and
its use cases. 20. How does Java handle primitive type promotion and
casting? What are the edge cases?

SECTION 2: OBJECT-ORIENTED PROGRAMMING 1. Can you explain the diamond
problem in Java and how interfaces solve it differently than C++? 2.
What's the difference between composition and inheritance? When should
you choose one over the other? 3. How does Java's access modifiers work
with inheritance? What are the subtle rules? 4. Explain polymorphism
with a scenario where it fails and how to fix it. 5. What is the
difference between abstract classes and interfaces? When to use each in
modern Java? 6. Explain encapsulation with examples of when it's
violated and how to fix it. 7. How does method overloading work with
inheritance? What are the resolution rules? 8. Explain the Liskov
Substitution Principle with Java examples. 9. What is the difference
between is-a and has-a relationships? Provide examples. 10. How do inner
classes work? What are the different types and their use cases? 11.
Explain the difference between method overriding and method hiding. 12.
How does Java handle constructor inheritance? Why are constructors not
inherited? 13. What are sealed classes (Java 17+)? How do they enable
better domain modeling? 14. Explain records (Java 14+) and how they
differ from regular classes. 15. How does pattern matching work in Java
(Java 16+)? Provide examples.

SECTION 3: COLLECTIONS FRAMEWORK 1. How does HashMap work internally?
Explain the complete mechanism including resize. 2. Why does HashMap
allow null keys but Hashtable doesn't? What are the thread-safety
implications? 3. How does ConcurrentHashMap achieve thread-safety
without explicit locking? 4. When would you use ArrayList vs LinkedList?
What are the hidden performance costs? 5. Explain the internal working
of HashSet. How does it use HashMap internally? 6. What is the
difference between TreeMap and LinkedHashMap? When to use each? 7. How
does PriorityQueue work internally? Explain the heap data structure. 8.
Explain the fail-fast vs fail-safe iterators. What are the differences?
9. What are the differences between Vector and ArrayList? Why is Vector
rarely used? 10. How does TreeSet maintain sorted order? What are the
requirements? 11. Explain the difference between Queue and Deque
interfaces and their implementations. 12. How do you choose the right
collection for a given scenario? Provide a decision framework. 13. What
is the difference between Collections.synchronizedMap() and
ConcurrentHashMap? 14. Explain the Stream API's internal working. How
does lazy evaluation work? 15. How does parallel stream work? What are
the pitfalls? 16. Scenario: Efficiently find duplicates in a list of 1
million objects. 17. How does Java handle generics? Explain type erasure
and its implications. 18. Explain bounded type parameters in generics.
When are they useful? 19. What are the differences between List\<?\>,
List\<? extends T\>, and List\<? super T\>? 20. How do you implement a
custom collection that follows the Collections Framework contract?

SECTION 4: CONCURRENCY & MULTITHREADING 1. Explain the volatile keyword.
When is it sufficient and when do you need synchronized? 2. What's a
deadlock? How would you detect and prevent it in a production system? 3.
Design and implement a custom thread pool from scratch. 4. Explain the
difference between ExecutorService, ForkJoinPool, and CompletableFuture.
5. How does synchronized work internally? Explain monitor and lock
mechanisms. 6. What is the difference between ReentrantLock and
synchronized? When to use each? 7. Explain ReadWriteLock. When is it
beneficial over regular locks? 8. How do atomic classes work? Explain
CAS (Compare-And-Swap) operations. 9. Explain CompletableFuture and its
advantages over Future. 10. What are virtual threads (Project Loom)? How
do they change concurrent programming? 11. Explain structured
concurrency (Java 25). How does it prevent common concurrency bugs? 12.
How does ThreadLocal work? What are the memory leak risks? 13. Explain
the Java Memory Model. What are happens-before relationships? 14. What
is the difference between sleep(), wait(), and yield()? 15. How do you
implement a producer-consumer pattern using different mechanisms? 16.
Explain the difference between CountDownLatch, CyclicBarrier, and
Phaser. 17. How does Semaphore work? Provide a real-world use case. 18.
Scenario: Design a system to process 10,000 tasks concurrently with
backpressure. 19. How do you handle exceptions in multithreaded code?
What happens to uncaught exceptions? 20. Explain the Fork/Join
framework. How does work-stealing work? 21. How does parallel stream use
ForkJoinPool? What are the implications? 22. What is the difference
between concurrent and parallel execution? 23. How do you implement a
thread-safe singleton? Compare different approaches. 24. Explain the
difference between BlockingQueue implementations. 25. How do you design
a rate limiter using Java concurrency primitives?

SECTION 5: MEMORY MANAGEMENT & JVM INTERNALS 1. Explain the Java memory
model and how it differs from the actual memory layout. 2. What are the
different garbage collection algorithms? How would you choose one? 3.
Explain the String pool. How does it interact with garbage collection?
4. What are weak, soft, and phantom references? Provide real-world use
cases. 5. Scenario: Your application has a memory leak. How would you
identify and fix it? 6. How does JIT compilation work? How can you write
code that takes advantage of it? 7. Explain the difference between heap
and stack memory. What gets stored where? 8. How do you tune JVM
parameters for different application types? 9. What is the difference
between minor GC and full GC? When does each occur? 10. Explain class
loading mechanism in Java. What are the different class loaders? 11. How
does Java handle memory-mapped files? When are they useful? 12. What is
the PermGen/Metaspace? How does it differ across Java versions? 13.
Explain object header layout and its impact on memory. What changed in
Java 25? 14. How do you profile a Java application for memory issues?
15. What is the difference between shallow heap and retained heap?

SECTION 6: ADVANCED LANGUAGE FEATURES (Java 8--25) 1. How do lambda
expressions work under the hood? What are their performance
implications? 2. Explain the Streams API. When is it more efficient than
loops, and when is it not? 3. What are functional interfaces? How do
they relate to lambdas? 4. Explain Optional. When should you use it and
when should you avoid it? 5. What are records (Java 14+)? How do they
differ from regular classes in terms of memory and performance? 6.
Explain sealed classes (Java 17+) and pattern matching. 7. How does
pattern matching work in Java (Java 16+)? Provide examples. 8. What are
the new features in Java 25 LTS? How do they impact existing codebases?
9. Explain text blocks (Java 15+). When are they useful? 10. How do
switch expressions (Java 14+) differ from switch statements? 11. What
are local variable type inference (var) and its limitations? 12. Explain
the module system (Java 9+). How does it improve application
architecture? 13. How do default methods in interfaces work? What
happens in case of conflicts? 14. What are private methods in interfaces
(Java 9+)? Why were they added? 15. Explain the Vector API (Java 25).
How does it improve performance?

SECTION 7: DESIGN PATTERNS & ARCHITECTURE 1. Scenario: Design a
thread-safe singleton. What are the different approaches and their
trade-offs? 2. When would you use the Builder pattern? What are the
alternatives in modern Java? 3. Explain the Factory pattern. When is it
better than direct instantiation? 4. How do you implement the Observer
pattern? How does Java's Flow API differ? 5. Scenario: Design a caching
layer. What patterns and considerations would you use? 6. Explain the
Strategy pattern with a real-world Java example. 7. How do you implement
the Template Method pattern in Java? 8. Explain the Decorator pattern.
How does it differ from inheritance? 9. What is the Adapter pattern?
Provide a Java implementation example. 10. Explain SOLID principles with
Java code examples. 11. How do you implement dependency injection
without a framework? 12. Scenario: Design a plugin architecture in Java.
How would you make it extensible? 13. Explain the difference between
composition and aggregation with examples. 14. How do you implement the
Command pattern? When is it useful? 15. What is the difference between
Facade and Adapter patterns?

SECTION 8: PERFORMANCE & OPTIMIZATION 1. Scenario: Your Java application
is slow. Walk me through your debugging and optimization process. 2.
What are the performance implications of autoboxing? 3. Scenario: You
need to process a 10GB file. How would you do it efficiently in Java? 4.
How do you optimize collection usage for performance? 5. Explain string
concatenation performance. When should you use StringBuilder? 6. How do
you minimize synchronization overhead in concurrent applications? 7.
What are the performance characteristics of reflection? When should you
avoid it? 8. How do you optimize database access in Java applications?
9. Explain the performance impact of exception handling. 10. How do you
benchmark Java code effectively?

SECTION 9: JAVA PROJECTS & FUTURE 1. What is Project Valhalla? How will
value types change Java programming? 2. Explain Project Loom's virtual
threads. 3. What is Project Panama? How does it improve Java's native
interop? 4. Explain Project Amber and its language improvements. 5. What
is Project Leyden? How do static images work? 6. Explain Project ZGC. 7.
What is Project Shenandoah? 8. What are the goals of Project Skara? 9.
How do Valhalla, Loom, and Panama work together?

SECTION 10: REAL-WORLD SCENARIOS & PROBLEM SOLVING 1. Design a rate
limiter using Java. 2. Implement a distributed lock in Java. 3. Build a
connection pool from scratch. 4. Process events asynchronously with
guaranteed ordering. 5. Handle 100K requests per second in a Java
service. 6. Debug a Java code snippet with multiple issues. 7. Design a
thread-safe cache with TTL. 8. Implement a custom blocking queue. 9.
Merge data from multiple sources concurrently. 10. Design idempotent
operations in distributed systems. 11. Implement a circuit breaker
pattern in Java. 12. Execute tasks with dependencies. 13. Batch
processing with configurable batch size and timeout. 14. Implement a
priority-based executor. 15. Design retries with exponential backoff.

SECTION 11: TRICKY EDGE CASES & GOTCHAS 1. Calling static methods on a
null reference. 2. Integer caching bugs in production. 3.
ArrayList.subList() pitfalls. 4. Covariant return types and exception
handling. 5. Initialization order in Java. 6. Autoboxing null edge
cases. 7. Method overloading with inheritance. 8. Modifying collections
while iterating. 9. Wrapper class comparison surprises. 10. Method
resolution with overloading and overriding. 11. Common clone() mistakes.
12. Varargs with null edge cases. 13. Floating-point comparison issues.
14. Static method hiding vs overriding. 15. Method chaining with null.
