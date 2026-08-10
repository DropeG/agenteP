---
name: study_summarizer
description: "Summarize extracted lecture slide text or readings into structured Markdown format containing Core Concepts, Definitions, Code/Formulas, and Key Takeaways."
---

# Skill: study_summarizer

Use this skill when processing a task of type `"summarize_material"` or when requested to summarize a text file of slides/readings.

## Summarization Guidelines

### 1. Structure the Output
Your generated summary must be saved in the configured summary path (e.g., `agents/workspace/{COURSE_CODE}/clases/summaries/{FILENAME}.md`). The markdown file must strictly use the following sections:

```markdown
# [Slide Title / Topic Name]

## 🎯 Core Concepts
Summarize the main topics, theories, and ideas presented in this lecture. Keep it concise but ensure no important academic topics are omitted.

## 📖 Key Definitions
List all terminology, models, definitions, or acronyms introduced, using clean bullet points.
* **[Term Name]:** Detailed academic definition.

## 💻 Code & Mathematical Formulas
* If the slides contain code snippets (e.g. Python, SQL, UML, React): extract them cleanly inside properly highlighted code blocks.
* If the slides contain mathematical equations, write them using LaTeX notation (e.g., \(E=mc^2\) or block style:
  \[
  \sum_{i=1}^{n} i
  \]

## 💡 Key Takeaways
Provide a bulleted list summarizing the absolute most critical takeaways that a student must remember for examinations.
```

### 2. Operational Constraints
* **No Hallucinations:** Summarize **only** the content present in the raw text file. If the file contains no code or formulas, omit that section or write "None mentioned."
* **Context Preservation:** Keep names of algorithms, specific libraries, or exact methods taught by the professor as they are written.
