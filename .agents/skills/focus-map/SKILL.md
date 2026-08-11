---
name: focus-map
description: Analyze university lecture materials such as PDFs, slide decks, notes, readings, and handouts to identify the central objective, fundamental concepts, expected mastery, important relationships, prerequisites, possible assessment emphasis, and secondary content. Use when one or more class materials must be converted into a concise, evidence-grounded focus map for the Agente P frontend. All user-facing generated content must be written in Spanish.
---

# focus-map

Analyze university lecture materials and produce a concise, structured focus map.

Determine what the student should focus on learning. Do not create a
comprehensive summary, study guide, rewritten lecture, flashcards, practice
questions, or full explanation of the material.

Produce machine-readable JSON for the Agente P frontend.

## Language

Write every user-facing text value in Spanish.

This includes:

- Class titles.
- Objectives.
- Concept names.
- Mastery descriptions.
- Rationales.
- Relationships.
- Prerequisites.
- Assessment descriptions.
- Secondary-content descriptions.
- Warnings and uncertainties.

Keep JSON property names and controlled enum values in English.

Do not translate identifiers, enum values, schema keys, filenames, course IDs,
or source IDs.

## Inputs

Use the following inputs when available:

1. Complete lecture materials.
2. The course profile produced by `profile-course`.
3. Focus maps from previous classes.
4. Syllabus and assessment information.
5. Assignments or exercises associated with the lecture.

The lecture material is the primary source of truth.

Use the course profile to interpret the material, not to replace or contradict
the lecture.

Do not assume that missing information belongs to the course.

## Core principles

### Analyze, do not merely summarize

Identify the intellectual structure of the lecture.

Determine:

- What the lecture is trying to accomplish.
- Which concepts organize the material.
- What the student must understand, remember, compare, prove, calculate,
  recognize, analyze, or apply.
- Which relationships are necessary for understanding.
- Which prerequisites are required.
- Which content is contextual, administrative, historical, or secondary.

### Preserve traceability

Support every important conclusion with source evidence.

Cite physical document pages whenever possible.

Do not cite a page unless it actually supports the claim.

Distinguish clearly between:

- Information explicitly stated by the instructor.
- Reasonable pedagogical inference.
- Unknown or insufficiently supported information.

### Avoid false precision

Do not generate numerical importance percentages.

Do not claim that a concept has a specific probability of appearing on an
assessment.

Use qualitative categories and explain the evidence.

### Keep the result concise

The focus map must be understandable in approximately one or two minutes.

Limit the number of central concepts whenever possible.

Prefer grouping related slides under one coherent concept instead of turning
every slide title into a separate concept.

## Workflow

### 1. Inspect all materials

Review every page and every supplied source.

Inspect:

- Text.
- Equations.
- Mathematical notation.
- Definitions.
- Theorems.
- Tables.
- Diagrams.
- Graphs.
- Images with academic meaning.
- Algorithms.
- Examples.
- Exercises.
- Speaker notes, when available.

Do not rely exclusively on extracted text when the original material contains
visual information.

Record any page that cannot be interpreted reliably.

### 2. Identify the material type

Classify the lecture as one of:

- `introductory`
- `conceptual`
- `procedural`
- `mathematical`
- `problem-solving`
- `review`
- `administrative`
- `mixed`

Use this classification to guide the analysis.

An introductory lecture may focus on the course's organizing questions.

A mathematical lecture may require definitions, conditions, proof strategies,
and distinctions.

A procedural lecture may require the student to execute a sequence of steps.

A problem-solving lecture may emphasize recognizing problem types and selecting
appropriate methods.

### 3. Separate academic and non-academic content

Separate:

- Core academic content.
- Supporting academic context.
- Historical context.
- Bibliography.
- Course logistics.
- Staff information.
- Assessment dates.
- Administrative policies.

Do not allow administrative slides to distort the academic objective.

Keep useful administrative information under `secondaryContent`.

### 4. Determine the central objective

Identify what the student should understand or be able to do after the lecture.

Prefer an objective explicitly declared by the instructor.

If no objective is declared, infer one from:

- Repeated organizing questions.
- Definitions and examples.
- The progression of the lecture.
- Exercises.
- The course profile.
- Connections to the syllabus.

Generate one central objective.

Add up to three supporting outcomes only when the lecture genuinely contains
multiple distinct goals.

Mark the objective basis as:

- `explicit`
- `inferred`

Do not write a generic objective such as:

> Comprender los conceptos principales de la clase.

Write an observable and specific objective.

### 5. Identify and group concepts

Create a concept only when it represents a meaningful unit of knowledge.

Merge:

- Repeated definitions of the same idea.
- Examples illustrating the same principle.
- Closely related slides that serve one learning goal.

Separate concepts when the student must distinguish or apply them differently.

For each concept determine:

- Stable identifier.
- Spanish display name.
- Priority.
- Expected actions.
- Mastery description.
- Rationale for inclusion.
- Evidence.
- Related concepts.

Prefer between three and seven central concepts.

Use more only when the material genuinely requires it.

### 6. Assign concept priority

Use only:

- `fundamental`
- `high`
- `medium`
- `secondary`

Assign `fundamental` when the concept:

- Is necessary to understand the central objective.
- Organizes the rest of the lecture.
- Is a prerequisite for later content.
- Is defined formally and then repeatedly used.
- Is central to examples or exercises.
- Directly matches an explicit course learning objective.
- Represents a core distinction the student must understand.

Assign `high` when the concept:

- Supports a fundamental concept.
- Is likely necessary for applying the material.
- Introduces an important method, condition, exception, or comparison.

Assign `medium` when the concept:

- Improves understanding.
- Provides useful context or an additional application.
- Is relevant but not structurally necessary.

Assign `secondary` when the content:

- Is contextual or illustrative.
- Is historical detail not required for the central objective.
- Is bibliographic or administrative.
- Can be omitted without damaging the main understanding.

Do not assign priority based only on repetition or slide count.

### 7. Determine expected actions

Choose one or more controlled actions:

- `understand`
- `memorize`
- `apply`
- `compare`
- `recognize`
- `demonstrate`
- `calculate`
- `analyze`

Use `understand` for explaining meaning, mechanisms, or consequences.

Use `memorize` only when exact recall is genuinely necessary.

Use `apply` when the student must use a concept, theorem, formula, or procedure.

Use `compare` when distinctions between related concepts are important.

Use `recognize` when the student must identify a pattern, property, or problem
type.

Use `demonstrate` when proofs or formal justifications are expected.

Use `calculate` when numerical or symbolic computation is required.

Use `analyze` when the student must decompose, classify, evaluate, or reason
about a situation.

### 8. Write the mastery description

For every non-secondary concept, state what the student should be able to do.

Make the statement specific and observable.

Good example:

> Distinguir entre un problema indecidible y un problema computable pero
> ineficiente, explicando qué pregunta responde cada categoría.

Bad example:

> Entender bien la computabilidad.

Do not provide a complete explanation of the concept.

Describe the expected mastery, not the full lesson.

### 9. Identify important relationships

Include only relationships that materially improve understanding.

Use one of:

- `dependency`
- `contrast`
- `cause-effect`
- `generalization`
- `application`
- `sequence`
- `equivalence`

Each relationship must contain:

- Source concept.
- Target concept.
- Relationship type.
- Brief Spanish description.
- Evidence when the relationship is not obvious from the concepts themselves.

Do not generate a relationship merely because two concepts appear in the same
lecture.

### 10. Identify prerequisites

Separate prerequisites into:

- `explicit`: directly declared by the instructor or course material.
- `inferred`: reasonably required to understand the lecture.

For inferred prerequisites, explain why they are needed.

Do not present an inferred prerequisite as an official course requirement.

### 11. Analyze possible assessment emphasis

Determine the assessment status:

- `explicit`
- `inferred`
- `unknown`

Use `explicit` only when the material, syllabus, assignment, or instructor
directly indicates that the content is assessed.

Use `inferred` when supported by signals such as:

- Exercises resembling assessment tasks.
- Repeated formal definitions.
- Explicit learning outcomes.
- Course-profile evidence about assessment style.
- A concept reused in assignments.
- A distinction the student is asked to apply.

Use `unknown` when evidence is insufficient.

When the status is `unknown`, state that the material does not provide enough
evidence.

Never convert general academic importance into a claim about assessment.

### 12. Identify secondary content

Group secondary content by category:

- `historical`
- `administrative`
- `bibliography`
- `motivation`
- `illustrative`
- `other`

Describe it briefly and cite its pages.

Do not discard secondary content. Preserve it for collapsed frontend display.

### 13. Record uncertainty

Add a warning when:

- A page is unreadable.
- A diagram cannot be interpreted reliably.
- Text extraction conflicts with the visual page.
- A formula is incomplete.
- A concept is referenced but not explained.
- The course profile contradicts the lecture.
- Assessment emphasis cannot be determined.
- Multiple interpretations are plausible.

Do not silently resolve ambiguous content.

### 14. Validate the analysis

Before returning the result, confirm:

- Every source was inspected.
- The central objective is specific.
- Fundamental concepts support the objective.
- Concept priorities are justified.
- Mastery statements are observable.
- Important claims contain valid evidence.
- Explicit statements and inferences are distinguished.
- Administrative content did not influence academic priorities.
- The result is concise.
- All user-facing text is in Spanish.
- The output contains valid JSON only.

## Output contract

Return exactly one valid JSON object.

Do not include Markdown fences.

Do not include an introduction or conclusion.

Do not include comments inside the JSON.

Use this structure:

```json
{
  "schemaVersion": "1.0",
  "courseId": "string-or-null",
  "classId": "string-or-null",
  "classTitle": "Spanish string",
  "materialType": "introductory | conceptual | procedural | mathematical | problem-solving | review | administrative | mixed",
  "sources": [
    {
      "sourceId": "stable-source-id",
      "fileName": "original filename",
      "totalPages": 0,
      "fullyInspected": true
    }
  ],
  "centralObjective": {
    "text": "Spanish string",
    "basis": "explicit | inferred",
    "evidence": [
      {
        "sourceId": "stable-source-id",
        "pages": [1]
      }
    ]
  },
  "supportingOutcomes": [
    {
      "text": "Spanish string",
      "basis": "explicit | inferred",
      "evidence": [
        {
          "sourceId": "stable-source-id",
          "pages": [1]
        }
      ]
    }
  ],
  "concepts": [
    {
      "id": "stable-kebab-case-id",
      "name": "Spanish string",
      "priority": "fundamental | high | medium | secondary",
      "actions": [
        "understand | memorize | apply | compare | recognize | demonstrate | calculate | analyze"
      ],
      "mastery": "Spanish string",
      "rationale": "Spanish string",
      "evidence": [
        {
          "sourceId": "stable-source-id",
          "pages": [1],
          "basis": "explicit | inferred"
        }
      ],
      "relatedConceptIds": ["stable-concept-id"]
    }
  ],
  "relationships": [
    {
      "fromConceptId": "stable-concept-id",
      "toConceptId": "stable-concept-id",
      "type": "dependency | contrast | cause-effect | generalization | application | sequence | equivalence",
      "description": "Spanish string",
      "evidence": [
        {
          "sourceId": "stable-source-id",
          "pages": [1]
        }
      ]
    }
  ],
  "prerequisites": [
    {
      "name": "Spanish string",
      "basis": "explicit | inferred",
      "reason": "Spanish string",
      "evidence": [
        {
          "sourceId": "stable-source-id",
          "pages": [1]
        }
      ]
    }
  ],
  "assessmentFocus": {
    "status": "explicit | inferred | unknown",
    "description": "Spanish string",
    "items": [
      {
        "text": "Spanish string",
        "basis": "explicit | inferred",
        "evidence": [
          {
            "sourceId": "stable-source-id",
            "pages": [1]
          }
        ]
      }
    ]
  },
  "secondaryContent": [
    {
      "category": "historical | administrative | bibliography | motivation | illustrative | other",
      "description": "Spanish string",
      "evidence": [
        {
          "sourceId": "stable-source-id",
          "pages": [1]
        }
      ]
    }
  ],
  "warnings": [
    {
      "type": "unreadable | incomplete | ambiguous | conflicting | missing-context | assessment-unknown | other",
      "description": "Spanish string",
      "evidence": [
        {
          "sourceId": "stable-source-id",
          "pages": [1]
        }
      ]
    }
  ]
}
```

## Output rules

Use physical PDF page numbers starting at 1.

If the printed slide number differs from the physical PDF page, use the
physical PDF page in `pages`.

Use empty arrays when a section has no supported items.

Use `null` only for an unknown course ID or class ID.

Never invent a source ID. Derive it deterministically from the supplied source
metadata or use the identifier supplied by the caller.

Keep concept IDs stable across repeated analyses of the same class.

Do not place full lecture content inside `mastery`, `rationale`, or
`description`.

Do not include information from general model knowledge unless needed to
interpret the lecture. If external knowledge materially affects the analysis,
record a warning and identify that the conclusion is not directly supported by
the supplied material.

## Multiple files

When several files belong to the same lecture, analyze them as one class and
include all files under `sources`.

When files belong to different lectures, produce one focus-map object per
lecture only if the caller explicitly requests batch processing.

For batch processing, return:

```json
{
  "schemaVersion": "1.0",
  "analyses": [
    {
      "...": "one complete focus-map object"
    }
  ]
}
```

Do not merge different lectures into one focus map.

## Relationship with profile-course

Use `profile-course` to understand:

- Course objectives.
- Course units.
- Assessment style.
- Expected level of mathematical rigor.
- Importance of proofs, exercises, projects, or memorization.
- Declared prerequisites.

Do not copy the entire course profile into the output.

Use it only when it changes the interpretation of the lecture.

When the profile influences a conclusion, keep the conclusion grounded in the
lecture and mark it as inferred unless the lecture states it directly.
