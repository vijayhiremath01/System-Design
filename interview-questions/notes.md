# Java Deep Dive — Method Overloading with Null & HashMap Internals

Two classic interview questions, explained from **zero basics → deep internals**, with simple pictures in words before the technical detail.

---

## Table of Contents
1. [How does Java handle method overloading with null parameters?](#1-how-does-java-handle-method-overloading-with-null-parameters)
2. [How does HashMap work internally?](#2-how-does-hashmap-work-internally)

---

## 1. How does Java handle method overloading with null parameters?

### First — what is Method Overloading? (the basic concept)

**Method overloading** means having **multiple methods with the same name** in the same class, but with **different parameters** (different type, different number, or different order).

```java
class Calculator {
    int add(int a, int b) {
        return a + b;
    }

    double add(double a, double b) {
        return a + b;
    }

    int add(int a, int b, int c) {
        return a + b + c;
    }
}
```

All three methods are named `add`. Java tells them apart using the **method signature** — the name **plus** the parameter list.

```java
Calculator calc = new Calculator();
calc.add(2, 3);       // calls add(int, int)
calc.add(2.5, 3.5);   // calls add(double, double)
calc.add(1, 2, 3);    // calls add(int, int, int)
```

**Imagine it like:** ordering "coffee" at a cafe. Just saying "coffee" isn't enough — the barista needs to know *how many* details you gave (size, milk or not) to know exactly which drink to make. Java looks at *what you handed it* (the arguments) to decide *which version* of the method you meant.

### How does Java decide which overload to call?

This happens at **compile time** — called **static binding**. The compiler looks at the arguments you pass (their types, count, order) and matches them to the closest method signature.

```java
void print(int x) { System.out.println("int: " + x); }
void print(String x) { System.out.println("String: " + x); }

print(5);       // → "int: 5"
print("hello"); // → "String: hello"
```

This is different from **overriding** — overriding is decided at **runtime** based on the actual object type; overloading is decided at **compile time** based on the arguments written in the code.

### Return type alone is NOT enough to overload

```java
int add(int a, int b) { return a + b; }
double add(int a, int b) { return a + b; } // ❌ compile error! same parameter list
```

The parameter list must differ — the compiler has no way to tell these apart just from a call like `add(2, 3)`.

---

### Now the real question: overloading with `null`

Overload resolution happens by matching argument **types** at compile time. So the real question becomes: **what type is `null`?**

`null` isn't tied to any specific type — it can be assigned to **any reference type** (`String`, `Integer`, `Object`, any class, any array). That ambiguity is exactly what causes the edge cases below.

#### Case 1: Only one matching overload — works fine

```java
void test(String s) { System.out.println("String version"); }

test(null); // ✅ compiles fine → "String version"
```

Only one method accepts a reference type, so there's no ambiguity.

#### Case 2: Multiple unrelated overloads — compile error!

```java
void test(String s) { System.out.println("String version"); }
void test(Integer i) { System.out.println("Integer version"); }

test(null); // ❌ COMPILE ERROR — "reference to test is ambiguous"
```

`null` could legally be a `String` or an `Integer` — the compiler has no way to decide, so it refuses to compile instead of guessing.

**Fix — cast to tell the compiler which one you mean:**
```java
test((String) null);  // → "String version"
test((Integer) null); // → "Integer version"
```

#### Case 3: One type is a subtype of the other — Java picks the most specific one

```java
void test(Object o)  { System.out.println("Object version"); }
void test(String s)  { System.out.println("String version"); }

test(null); // ✅ compiles → "String version"
```

`String` is more specific than `Object` — every `String` is an `Object`, but not every `Object` is a `String`. When multiple overloads could accept `null`, Java picks the **most specific applicable type**.

**Interview trap — add a third, equally-specific, unrelated overload:**

```java
void test(Object o)  { System.out.println("Object version"); }
void test(String s)  { System.out.println("String version"); }
void test(StringBuilder sb) { System.out.println("StringBuilder version"); }

test(null); // ❌ COMPILE ERROR again!
```

`String` and `StringBuilder` are both more specific than `Object`, but neither is more specific than the other — unrelated siblings. Ambiguous again, even though it "worked" with just two overloads. **Overload resolution isn't "the compiler tries its best" — it's a strict rule: most specific unique type wins, or it's an error.**

#### Case 4: Primitives vs wrapper types + null

```java
void test(int i) { System.out.println("int version"); }
void test(Integer i) { System.out.println("Integer version"); }

test(null); // ✅ compiles → "Integer version"
```

`null` **cannot** be assigned to a primitive `int` at all — primitives aren't references. So `Integer` is the only legal candidate, no ambiguity.

```java
test(5); // → "int version" — Java prefers the exact primitive match over autoboxing
```

#### Case 5: Varargs make it even messier

```java
void test(String s) { System.out.println("String version"); }
void test(String... s) { System.out.println("varargs version"); }

test(null); // ✅ compiles → "String version"
```

Java prefers a **fixed-arity match** (exact single parameter) over a **varargs match** whenever both are possible — varargs is the last resort.

---

### The mental model to remember

1. **Only one applicable overload?** → use it.
2. **Multiple applicable, but one is a subtype of all the rest?** → use the most specific one.
3. **Multiple, equally-specific, unrelated candidates?** → compile error, ambiguous — must cast.
4. **Primitives are never eligible for `null`** — only reference types compete.
5. **Fixed-arity (exact) matches beat varargs matches.**

### Why this matters in real code

Overloaded methods that accept `null` ambiguously are considered **bad API design** — a caller shouldn't need to cast just to satisfy the compiler. This is part of why modern Java favors `Optional<T>` over passing `null` directly, and why `@Nullable` annotations exist — to make intent explicit instead of relying on this overload-resolution machinery.

### 30-second interview answer

> "Method overloading lets a class have multiple methods with the same name but different parameter lists, resolved at compile time by matching argument types. With `null`, ambiguity arises because `null` has no inherent type and can match any reference type. If only one overload accepts a reference type, it's used directly. If multiple unrelated reference types could accept it, the compiler throws an ambiguity error requiring an explicit cast. If one candidate type is a subtype of the others, Java picks the most specific one automatically. Primitives are never candidates for `null` since they can't hold null at all."

---

## 2. How does HashMap work internally?

### First — what is a HashMap? (basics)

A `HashMap` stores data as **key-value pairs**, and lets you **look up a value instantly using its key** — instead of searching through a list one item at a time.

```java
Map<String, Integer> ages = new HashMap<>();
ages.put("Alice", 25);
ages.put("Bob", 30);

System.out.println(ages.get("Bob")); // 30
```

**Imagine it like:** a phone contacts app. You don't scroll through every contact to find "Bob" — you type "Bob" and it jumps **directly** to his entry.

### Building block 1: What is an array?

An array is a **list of boxes, lined up in a row, each with a number (index)**.

```
Index:   0     1     2     3     4
Box:   [ ]   [ ]   [ ]   [ ]   [ ]
```

If you say "put this in box 2," you go **directly** to box 2 — no need to check box 0 and 1 first. That's an array's superpower: instant access, if you know the box number.

### Building block 2: What is a linked list?

A linked list is a chain of items, where each item just **points to the next one**.

```
[Bob] → [Zara] → [Kim] → (end)
```

Think of it like a **treasure hunt**: Bob's note says "next clue is with Zara." Zara's says "next clue is with Kim." To find Kim, you can't jump straight to her — you start at Bob, go to Zara, then reach Kim, checking each one along the way.

### Putting them together: how HashMap uses both

A `HashMap`'s trick: **it does math on the key (like "Bob") to figure out exactly which box number to put it in** — like an array. That's why lookups are so fast — it jumps straight to the right box.

**But sometimes two different keys do the math and land on the SAME box.** This is called a **collision**.

```
Box 0: empty
Box 1: empty
Box 2: Bob   ← Zara's math ALSO says "box 2"!
Box 3: empty
Box 4: empty
```

Both can't occupy the exact same spot, so Java turns that box into a **small chain (linked list)** instead:

```
Box 2: [Bob] → [Zara]
```

Now box 2 holds a mini chain of everyone who landed there. To find "Zara," Java jumps straight to box 2 (fast), then walks the small chain inside — Bob, then Zara — until it matches.

### The full `put()` / `get()` flow, simply

```java
map.put("Bob", 30);
```
1. Java does math on `"Bob"` → gets a box number, say box 2
2. Goes to box 2
3. Empty? → place Bob there directly
4. Something already there? → collision, add Bob to that box's chain

```java
map.get("Bob");
```
1. Java does math on `"Bob"` → same box number every time
2. Goes straight to that box (fast)
3. Walks the chain inside (if any), checking each key with `.equals()` until it matches
4. Returns the matching value

> **This is exactly why `equals()` and `hashCode()` must both be correctly written on keys — `hashCode()` finds the right box, `equals()` finds the exact match inside it.** If you override `equals()` without `hashCode()`, step 1 sends you to the *wrong* box entirely, and `equals()` never even gets a chance to run.

### Why does a HashMap ever need to get bigger? (Resize)

A `HashMap` starts with a fixed number of boxes — by default, **16**.

Keep adding more and more names, and more of them start colliding into the same boxes — the chains inside those boxes get **longer and longer**. Long chains mean slow one-by-one searching — the "instant lookup" superpower starts to disappear.

**So Java has a rule:** once the boxes are about **75% full**, stop and make more boxes.

```
16 boxes × 0.75 = 12 (this is the "threshold")
```

Once the **13th** item is added, Java triggers a **resize**:

1. Creates a **new, bigger set of boxes** — double the size (16 → 32)
2. **Moves every single existing item** into the new boxes — because with more boxes now available, the math may send items to a *different* box number than before

**Imagine it like:** a 16-drawer filing cabinet getting crammed. You get a 32-drawer cabinet and have to **re-file every folder**, because your filing system now has more drawers to spread things across.

This re-filing step is called **rehashing** — it's the expensive part, since it touches every single item. That's why resizing affects performance, and why it helps to set an initial capacity upfront if you already know roughly how many entries you'll store:

```java
Map<String, Integer> map = new HashMap<>(1500); // avoids resize churn
```

### The "tree" thing — a smarter chain for a REALLY crowded box

Sometimes, even after resizing, one unlucky box ends up with **8 or more** items landing in it, while other boxes are fine. Searching a chain of 8+ items one by one is slow.

So Java reorganizes just that one box into a **tree** instead of a plain chain:

- **Chain (linked list):** a single-file line — check person 1, then 2, then 3... one at a time.
- **Tree:** more like a **guessing game** — "before M or after M?" → "before F or after F?" → narrows down much faster than checking one-by-one.

This guarantees that even in the unluckiest case (one box with tons of collisions), Java can still find things reasonably fast, instead of degrading into a slow line.

*(If that box empties out again, Java turns it back into a simple chain — a tree isn't worth the extra complexity for a box that's no longer crowded.)*

### The 5-idea summary

- `HashMap` = a set of numbered **boxes**
- Adding an item = do math on the key → get a box number → put it there
- Two items landing in the same box = a **collision** → stored as a small **chain**
- Box gets *really* crowded (8+) → chain becomes a **tree** for faster searching
- Whole map getting too full overall (75%) → **resize**: more boxes, move everything over

### The deeper technical version (for interviews)

- The underlying array is called the **table**; each slot is a **bucket**.
- A key's `hashCode()` is passed through a "hash spreading" function (mixes high bits into low bits to reduce collisions), then mapped to a bucket index using `hash & (table.length - 1)` — a fast bitwise trick that only works because table length is always a **power of 2**.
- Collisions are stored as a **linked list**, which converts into a **red-black tree** once a single bucket exceeds **8 entries** (and the table has **64+** buckets total) — guaranteeing O(log n) worst-case instead of O(n). It converts back to a list if entries drop below 6.
- **Load factor** default is `0.75` — a tested balance between memory waste (too low) and excessive collisions (too high).
- On resize, Java doesn't fully recompute every hash — since capacity always **doubles** and stays a power of 2, each old entry can only move to one of **two** possible new positions (same index, or old index + old capacity), decided by checking a single extra bit of the hash. This makes resizing efficient despite touching every entry.

### Critical interview follow-ups

**"Is HashMap thread-safe?"** No — concurrent modification from multiple threads can corrupt it. Use `ConcurrentHashMap` for multi-threaded code.

**"What's the real time complexity?"** O(1) average case with a good hash function. Worst case (heavy collisions) is O(n) with a plain list, or O(log n) since Java 8's treeification.

**"Why must capacity be a power of 2?"** Because `hash & (capacity - 1)` is a fast, exact replacement for `hash % capacity` — but only works correctly when capacity is a power of 2.

### 30-second interview answer

> "HashMap stores entries in an array of buckets. A key's hashCode() is hash-spread and mapped to a bucket index via `hash & (capacity - 1)`. Collisions — different keys landing in the same bucket — are handled with a linked list, which converts to a red-black tree if a bucket exceeds 8 entries, guaranteeing O(log n) worst-case instead of O(n). Once entries exceed capacity × load factor (default 0.75), HashMap doubles its capacity and rehashes every entry — an O(n) operation, which is why pre-sizing helps if you know your entry count upfront. equals() and hashCode() must both be correct on keys, since hashCode() finds the bucket and equals() finds the exact entry within it."

---

*Compiled as part of Java fundamentals interview preparation.*