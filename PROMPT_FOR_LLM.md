# Prompt: GitHub Profile README (Neofetch / Andrew6rant-Style)

Copy everything below the line into another LLM. Attach your linocut portrait image. Ask it to output the final files only.

---

## Role

You are an expert at crafting distinctive GitHub profile READMEs. Recreate the exact aesthetic of https://github.com/Andrew6rant/Andrew6rant — a terminal/neofetch layout — but for **Hadi Dawoud**, using his data and portrait.

## Visual / technical target (must match Andrew6rant)

Andrew’s profile README is **not** a long Markdown bio. It works like this:

1. `README.md` only embeds an SVG via `<picture>` (light + dark):

```html
<a href="https://github.com/HadiDawoud/HadiDawoud">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="dark_mode.svg">
    <img alt="Hadi Dawoud's GitHub Profile README" src="light_mode.svg">
  </picture>
</a>
```

2. All content lives in **`light_mode.svg`** and **`dark_mode.svg`** (~1080×530px, Consolas/monospace, rounded rect background).
3. **Left column:** portrait as ASCII art (preferred, like Andrew) **or** the attached linocut image embedded/left-aligned if ASCII quality is poor.
4. **Right column:** neofetch-style key/value blocks with:
   - header `hadi@dawoud` + dashed rule
   - dotted leaders between keys and values (`. . . .`)
   - colored keys / values (GitHub light & dark palettes)
   - section separators: `- Contact ——…` and `- GitHub Stats ——…`
5. Light mode fills roughly: bg `#f6f8fa`, text `#24292f`, keys `#953800`, values `#0a3069`, muted dots `#8b949e`
6. Dark mode fills roughly: bg `#0d1117`, text `#c9d1d9`, keys `#ff7b72`, values `#79c0ff`, muted dots `#6e7681`
7. Optional green/red accents only if you show LOC ++/--.

**Do not** produce a generic badge-soup README. **Do not** invent skills, jobs, or contacts not listed below.

## Person / identity

| Field | Value |
|--------|--------|
| Full name | Hadi Dawoud |
| GitHub | https://github.com/HadiDawoud (login: `HadiDawoud`) |
| Display handle in SVG | `hadi@dawoud` |
| Profile repo name | must be `HadiDawoud` (username/username) |
| Email | hadidawood.k@gmail.com |
| Phone (DO NOT put on public README) | 0176 3152 9698 — private; omit from SVG |
| Location | Porta Westfalica, Germany (32457) |
| GitHub company field | Fraunhofer Institut (outdated on GH; current employer is Capgemini) |
| GitHub bio | Exploring and learning / GenAI & ML. Backend Engineer / Building things that work in production — Applied Computer Science |
| GitHub joined | 2023-05-26 |
| Public repos (approx) | 10 |
| Followers (approx) | 32 |
| Following (approx) | 38 |
| Stars (approx, owned) | ~2 |

## Profile summary (from CV)

Engagierter Student der Angewandten Informatik mit praktischer Erfahrung in der KI-gestützten Softwareentwicklung. Fokus auf die Umsetzung skalierbarer Backend-Lösungen und GenAI-Integrationen.

English short line for SVG if needed:  
*Applied CS student · GenAI & scalable backends · production-minded*

## Education

1. **B.Sc.** Angewandte Informatik und Soziale Medien  
   Hochschule Hamm-Lippstadt (HSHL), Lippstadt  
   **2021 – heute**

2. **Allgemeine Hochschulreife (Abitur)**  
   Walter Gropius Schule, Berlin  
   **2017 – 2021**

For neofetch `Uptime`, prefer something like: `B.Sc. since 2021 · HSHL`  
(If you use literal age, ask the user for birthday first — not in CV.)

## Work experience (from CV)

### Capgemini — Software Engineering | Werkstudent | 06.2026 – jetzt (current)
- Host / Kernel style mapping: **Host:** Capgemini · **Kernel:** Software Engineer (Werkstudent)
- Backend solution in **TypeScript** to automate management/configuration of development environments (version switches, updates, provisioning; reduce manual effort).

### Fraunhofer IEM — GenAI Incubator | Werkstudent | 02.2025 – 06.2026 (previous)
- Fine-tuning & evaluation of a **ModernBERT** model (Hugging Face) for automated classification of customer inputs; benchmarking, QA, technical documentation for an industrial AI system.
- Automated data pipeline: Python procedure extracting technical info from large **Stromlaufpläne** (circuit diagrams) using **YOLO**, **OCR**, and multimodal LLMs; structured data for machine cable manufacturing.

Map previous role in Contact/Stats area as: `Fraunhofer IEM · GenAI Incubator`

## Technical skills (from CV) — pick concise neofetch lines, don’t dump everything

**Languages / core:** Python, SQL, TypeScript, Node.js  

**Frontend & web:** HTML, CSS, TypeScript, UI components, API integration  

**Backend & API:** FastAPI, RESTful API design, OpenAPI (Swagger)  

**GenAI & LLM:** LLM fine-tuning & benchmarking (Hugging Face), AI Agents, Multi-Agent systems, Agent Orchestration, MCP, LangChain, Ollama, Prompt Engineering, Tool Calling  

**RAG & retrieval:** RAG, Agentic RAG, vector embeddings, semantic search, hybrid retrieval, chunking, reranking, vector DB optimization, RAG evaluation, context engineering  

**Data / DBs:** PostgreSQL, ChromaDB, Qdrant, Redis/NoSQL, vector DBs, ETL (JSON/XML/CSV/PDF/SVG/PNG/DOCX/XLSX)  

**Cloud & infra:** Azure, Docker, Kubernetes (K8s), CI/CD basics  

**Process / tools:** Agile (Scrum/Kanban), Git / GitLab / GitHub  

Suggested right-column mapping (Andrew-style):

```
OS: ........................ Windows 11, Linux
Uptime: .................... B.Sc. since 2021 · HSHL
Host: ...................... Capgemini
Kernel: .................... Software Engineer (Werkstudent)
IDE: ....................... VS Code, Cursor

Languages.Programming: ..... Python, TypeScript, Node.js, SQL
Languages.Computer: ........ HTML, CSS, JSON, YAML, LaTeX
Languages.Real: ............ Kurdish, Arabic, German, English

Focus.GenAI: ............... Agents, RAG, MCP, LangChain
Focus.Backend: ............. FastAPI, Docker, K8s, PostgreSQL

- Contact ——————————————————
Email: ..................... hadidawood.k@gmail.com
GitHub: .................... HadiDawoud
Location: .................. Porta Westfalica, Germany
Education: ................. Angewandte Informatik · HSHL
Previous: .................. Fraunhofer IEM · GenAI Incubator

- GitHub Stats —————————————
Repos / Stars / Followers (use live numbers if available, else 10 / 2 / 32)
Experience: ................ Capgemini · Fraunhofer IEM · GenAI
Building: .................. scalable backends & GenAI systems
```

## Languages (spoken)

| Language | Level |
|----------|--------|
| Kurdisch | Muttersprache |
| Arabisch | C2 |
| Deutsch | C1 |
| Englisch | C1 |

Order in SVG can be: Kurdish, Arabic, German, English (or mother tongue first).

## Soft skills (optional; only if space — prefer omit for clean neofetch)

Problemlösung, Umgang mit Herausforderungen, Entscheidungsfindung, Teamorientierung, Selbstorganisation, Kommunikationsfähigkeit, Agilität und Flexibilität

## Portrait / asset

- Attach the user’s **linocut-style portrait** (blue ink on cream, sunburst/halo behind the head, shoulders-up, mustache, serious look).
- Convert it into **dense ASCII art** for the left column (~40–48 chars wide, ~24–25 lines), monospaced, vertically aligned with the text column — same idea as Andrew’s face ASCII.
- If ASCII of the linocut looks muddy, keep a clean ASCII silhouette **or** embed the portrait image on the left of the SVG and keep the neofetch text on the right.
- Provide both `light_mode.svg` and `dark_mode.svg`.

## Deliverables (exact files)

Output these files ready to push to `github.com/HadiDawoud/HadiDawoud`:

1. `README.md` — only the `<picture>` embed (as above)
2. `light_mode.svg` — full neofetch card
3. `dark_mode.svg` — same layout, dark palette
4. Optionally a short `SETUP.md` with push instructions

Also show a **text preview** of the right-column content in the chat so it can be reviewed without opening SVG.

## Quality bar

- Looks like Andrew6rant’s card at a glance (two columns, monospace, dots, sections).
- Data is **Hadi’s**, not Andrew’s.
- No phone number, no fake LinkedIn/Discord unless user adds them.
- No birthday/age unless user provides it.
- German CV facts may appear in English labels for the terminal vibe; keep institution names correct (Capgemini, Fraunhofer IEM, HSHL / Hochschule Hamm-Lippstadt).
- Prefer precision and visual polish over filling every skill from the CV.

## Reference

Style inspiration: https://github.com/Andrew6rant/Andrew6rant  
(User portrait attached separately.)
