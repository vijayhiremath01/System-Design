# Retrieval Augmented Generation (RAG)

This article will discuss one of the most applicable uses of Language Learning Models (LLMs) in enterprise use-case, Retrieval Augmented Generation ("RAG"). RAG is the biggest business use-case of LLMs, and it will be increasingly important to understand RAG, its processes, applicability to your organization, and surrounding tooling.

RAG is a framework for improving model performance by augmenting prompts with relevant data outside the foundational model, grounding LLM responses on real, trustworthy information. Users can easily "drag and drop" their company documents into a vector database, enabling a LLM to answer questions about these documents efficiently.

In 2023, the use of LLMs saw significant growth in enterprise applications, particularly in the domain of RAG & information retrieval. According to the 2023 Retool Report, an impressive **36.2% of enterprise LLM use cases now employ RAG technology.** RAG brings the power of LLMs to structured and unstructured data, making enterprise information retrieval more effective and efficient than ever.

We discuss what RAG is, the trade-offs between RAG and fine-tuning, and the difference between simple/naive and complex RAG, and help you figure out if your use-case may lean more heavily towards one or the other.

## How does RAG work?

A typical RAG process, as pictured below, has an LLM, a collection of enterprise documents, and supporting infrastructure to improve information retrieval and answer construction. The RAG pipeline looks at the database for concepts and data that seem similar to the question being asked, extracts the data from a vector database and reformulates the data into an answer that is tailored to the question asked. This makes RAG a powerful tool for companies looking to harness their existing data repositories for enhanced decision-making and information access.

![RAG Pipeline](https://miro.medium.com/v2/resize\:fit:1400/0*WYv0_CaBmCTt7FXc)

*Source: <link href="https://gradientflow.com/techniques-challenges-and-future-of-augmented-language-models/" title="gradientflow.com"/>*

An example of a large production RAG implementation is probably Twitter/X's **"See Similar Post"** function. Here, the RAG system would chunk and store tweets in a vector database, and when you click on "see similar posts", a query would retrieve similar tweets and pass them to an LLM to determine which posts are most similar to the original. This way, it gets all the powerful flexible perception abilities of an LLM to understand meaning and similar concepts rather than using traditionally inflexible techniques like keyword searching—which does not account for similarity, meaning, sentiment and misspellings, among others.

RAG is a relevant solution across a wide variety of industries and use cases.

* In **legal and healthcare**, it references precise information from vast databases of case law, research papers, and clinical guidelines.
* In **customer service**, it powers sophisticated chatbots and virtual assistants with accurate, context-aware responses.
* In **content creation and recommendation systems**, it generates personalized recommendations by understanding user preferences and historical data.

## RAG vs Fine-Tuning

The two competing solutions for "talking to your data" with LLMs are **RAG** and **fine-tuning** a LLM model.

The main difference is in where and how company data is stored and used.

* **Fine-tuning** retrains a pre-existing black-box LLM using company data and tweaks model configuration.
* **RAG** retrieves data from externally stored company documents and supplies it to the LLM during response generation.

Fine-tuning is a lengthy, costly process and is not ideal for frequently changing company facts or documents. However, it excels at recognizing subtle nuances in tone and style—for example, features like "Write in Abraham Lincoln's style."

As Anyscale notes:

> "Fine-tuning is for form, not facts."

Fine-tuning is better suited for branding or creative writing where style consistency matters.

RAG is generally preferable in environments like **legal, customer service, and financial services**, where dynamically retrieving up-to-date information produces more accurate responses.

Anecdotally, enterprises are most excited about using RAG systems to demystify messy, unstructured internal documents. Traditionally, employees relied on other people instead of navigating poorly maintained document systems. RAG changes that by making those documents searchable through natural language.

Some additional practical considerations when choosing between RAG and fine-tuning are shown below.

![RAG vs Fine-Tuning Comparison](https://miro.medium.com/v2/resize\:fit:1400/0*YCY1HKgfSEeg8J2j)

*Source: <link href="https://www.rungalileo.io/blog/optimizing-llm-performance-rag-vs-finetune-vs-both" title="rungalileo.io"/>*

![RAG vs Fine-Tuning Table](https://miro.medium.com/v2/resize\:fit:1400/0*tpDwTeTHeXRlD3KT)

*Source: <link href="https://www.rungalileo.io/blog/optimizing-llm-performance-rag-vs-finetune-vs-both" title="rungalileo.io"/>*

## Types of RAG

One of the first things to consider when developing a RAG product is the type of questions your workflow requires.

RAG systems generally fall into two categories:

* **Simple (Naive) RAG**
* **Complex RAG**

In practice, the same workflow may contain both.

### Simple RAG

Simple RAG handles straightforward queries needing direct answers.

Example:

> "What are your business hours?"

The system retrieves a single piece of information and answers immediately.

### Complex RAG

Complex RAG is designed for intricate queries requiring **multi-hop retrieval**.

Instead of retrieving one document, it combines information from multiple sources.

Example:

> "What are the latest treatments for Diabetes and their side effects?"

The system first retrieves the latest treatments, then performs additional retrievals to gather side effects before constructing the final answer.

Another example appears below.

*Source: ResearchGate — Multi-hop Question Answering*

In the diagram above, a multi-hop reasoning system must answer several sub-questions before generating an answer.

For example:

1. Who is the wife of Bill Gates?
2. Which organizations did Bill Gates' wife found?

The system must connect multiple facts across different documents.

Another legal example:

> "How do recent changes in employment law affect remote work policies?"

The system retrieves:

1. Recent employment law updates.
2. Remote work policy documents.

It then synthesizes both sources into one contextual answer.

Reasoning and multi-hop retrieval have long been important considerations in question-answer systems. As complex RAG becomes more common, demand for these capabilities will continue growing.

## So what questions should you ask yourself?

As you think about building your first RAG system, consider the following.

1. **Be specific about the workflow** you want to automate. Is it customer service? Executive reporting? Something else?
2. **Understand the questions** your users will actually ask.
3. **Identify where the information lives.** Is everything already in one document, or must it be assembled from multiple sources?

## Important Practical Considerations

### 1. Some industries naturally require multi-hop reasoning.

Legal documents often reference multiple contracts, clauses, and supporting documents.

### 2. Apparently simple questions may actually be complex.

Example:

> "On public holidays, what are the business hours for the Chicago store?"

The answer may require combining:

* Chicago store hours
* Public holiday policy

These pieces often exist in different documents.

### 3. Real users ask imperfect questions.

Even experienced executives often omit important context.

For example:

Instead of asking:

> "Which company did Melinda Gates found?"

Someone might ask:

> "Which organizations did the wife of Bill Gates found?"

This forces the system to perform additional reasoning.

Requiring users to always ask perfectly structured questions is unrealistic.

For that reason, building **multi-hop capable RAG systems from Day One** may be worthwhile, as organizations inevitably accumulate more documents, more workflows, and increasingly complex questions over time.

In the next article, the discussion moves into technical considerations, production limitations, and practical techniques for building production-ready RAG systems.
