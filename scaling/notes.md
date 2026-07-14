# System Design Notes

## Vertical Scaling
Vertical scaling, also known as scaling up, refers to the process of increasing the capacity or capabilities of an individual hardware or software component within a system.

We upgrade the same system rather than adding more systems. Add more power to your machine by adding better processors, increasing RAM, or other power-increasing adjustments.
Simple to implement and useful for monolithic and small scale applications.

### Vertical Scaling Diagram
![alt text](<Vertical Scaling.jpeg>)

### Examples
The following examples illustrate how vertical scaling improves system capacity by upgrading the resources of a single server.

* Upgrading a MySQL server from 16 GB RAM to 64 GB to handle more queries.
* Moving a website hosted on a 2-core VM to an 8-core, higher-RAM VM to improve performance.
* E-commerce platform running on a single large AWS EC2 instance with increased resources (CPU, RAM, disk).

### Advantages
Vertical scaling offers several benefits, especially for applications that need quick performance improvements with minimal architectural changes.

* **Increased capacity:** A server's performance and ability to manage incoming requests can both be enhanced by upgrading its hardware.
* **Easier management:** Upgrading a single node is usually the focus of vertical scaling, which might be simpler than maintaining several nodes.

### Disadvantages
Despite its benefits, vertical scaling has certain limitations that can affect system growth and reliability.

* Vertical scaling is constrained by the hardware's physical limitations. Horizontal scaling also has practical limits such as network overhead, coordination complexity, and consistency constraints.
* One server still receives all incoming requests thus increasing the possibility of downtime in the event of a server failure.
* Scaling up often requires restarting or replacing the machine, causing downtime.

---

## Horizontal Scaling
Horizontal scaling, also known as scaling out, refers to the process of increasing the capacity or performance of a system by adding more machines or servers to distribute the workload across a larger number of individual units.

There is no need to change the capacity of the server or replace the server.
Adding more servers usually avoids full downtime, but may involve delays due to deployment, warm-up time, or traffic rebalancing.

### Horizontal Scaling Diagram
![alt text](<Horizontal Scaling.jpeg>)

### Examples
Horizontal scaling is widely used in real-world systems to handle high traffic and ensure availability.

* A website like GeeksforGeeks adds more web servers behind a load balancer to handle traffic spikes.
* Netflix scales different microservices independently — e.g., multiple instances of the streaming service across regions.
* Amazon Auto Scaling spins up more EC2 instances during peak shopping hours (e.g., Black Friday).
* Akamai or Cloudflare uses servers distributed globally to serve content closer to users.

### Advantages
Horizontal scaling improves system capacity and reliability by distributing workload across multiple machines.

* **Increased capacity:** More nodes or instances can handle a larger number of incoming requests.
* **Improved performance:** By distributing the load over several nodes or instances, it is less likely that any one server will get overloaded.
* **Increased fault tolerance:** Incoming requests can be sent to another node in the event of a node failure, lowering the possibility of downtime.

### Disadvantages
Despite its benefits, horizontal scaling introduces complexity in system design and management.

* Requires complex architecture (load balancers, distributed databases, etc.).
* Difficult to maintain strong consistency across distributed nodes. Requires synchronization, messaging, or replication between nodes.
* More machines = more networking, power, and maintenance.
* Needs orchestration tools (e.g., Kubernetes, Ansible) to manage many servers.

---

## SOLID Principles
The SOLID principles are a set of five design principles in object-oriented programming intended to make software designs more understandable, flexible, and maintainable. This principle is an acronym of the five principles which are given below:

* **Single Responsibility Principle:** This principle states that “A class should have only one reason to change” which means every class should have a single responsibility or single job or single purpose. In other words, a class should have only one job or purpose within the software system.
* **Open/Closed Principle:** This principle states that “Software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification” which means you should be able to extend a class behavior, without modifying it.
* **Liskov’s Substitution Principle:** The principle was introduced by Barbara Liskov in 1987 and according to this principle “Derived or child classes must be substitutable for their base or parent classes“. This principle ensures that any class that is the child of a parent class should be usable in place of its parent without any unexpected behavior.
* **Interface Segregation Principle:** This principle is the first principle that applies to Interfaces instead of classes in SOLID and it is similar to the single responsibility principle. It states that “do not force any client to implement an interface which is irrelevant to them“. Here your main goal is to focus on avoiding fat interface and give preference to many small client-specific interfaces. You should prefer many client interfaces rather than one general interface and each interface should have a specific responsibility.
* **Dependency Inversion Principle:** The Dependency Inversion Principle (DIP) is a principle in object-oriented design that states that “High-level modules should not depend on low-level modules. Both should depend on abstractions“. Additionally, abstractions should not depend on details. Details should depend on abstractions.

---

### Reference Links
* [GeeksforGeeks Guide to System Design for Freshers](https://www.geeksforgeeks.org/system-design/guide-to-system-design-for-freshers/#4-solid-principles)