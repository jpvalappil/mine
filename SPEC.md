# mine — Spec

> A semantic-first, zero-dependency UI component library. No framework. No bloat. Just HTML, CSS, and the web platform.

---

## Motivation

Modern UI libraries have drifted far from the web platform. They demand build pipelines, impose class-name conventions, ship JavaScript for things CSS can do natively, and create dependency chains that rot over time.

`mine` is a corrective. It works by styling the web the way it was meant to be styled — semantically. Drop in a CSS file and a small JS bundle. Write proper HTML. Get a polished, accessible UI without touching a config file.

---

## Goals

1. **Semantic HTML as the API.** Components are not defined by class names — they are expressed through correct HTML elements and ARIA attributes.

2. **Zero dependencies.** No external runtime. No framework requirement.

3. **Tiny by default.** Total bundle target: ≤10KB minified + gzipped.

4. **Accessible out of the box.** Keyboard navigation, focus management, ARIA semantics — built in.

5. **No build step required.** One `<link>` and one `<script>` tag.

6. **Longevity over novelty.** Based on web standards.

---

## License

MIT
