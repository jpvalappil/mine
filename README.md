# mine

Semantic-first, zero-dependency UI library. Include one CSS file and one JS file. Write correct HTML. Get a polished, accessible UI — no framework, no build step, no configuration.

**[Live docs →](https://jpvalappil.github.io/mine)**

---

## Install

### CDN (no build step)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mine/dist/mine.css">
<script src="https://cdn.jsdelivr.net/npm/mine/dist/mine.js"></script>
```

### npm

```sh
npm install mine
```

```js
import 'mine/dist/mine.css';
import { toast } from 'mine';
```

---

## Quick example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My app</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mine/dist/mine.css">
</head>
<body>
  <div class="container">
    <h1>Hello, mine</h1>
    <p>Write semantic HTML and get a polished UI automatically.</p>
    <button class="primary" onclick="mine.toast('It works!', { type: 'success' })">
      Show toast
    </button>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/mine/dist/mine.js"></script>
</body>
</html>
```

---

## Token overrides

Override any CSS custom property on `:root` to customise the design:

```css
:root {
  --mine-color-accent:       #7c3aed;
  --mine-color-accent-hover: #6d28d9;
  --mine-radius-base: 2px; /* sharper corners */
}
```

---

## Dark mode

Dark mode is automatic via `prefers-color-scheme`. To control it manually, set `data-theme` on `<html>`:

```html
<!-- Force dark -->
<html data-theme="dark">

<!-- Force light -->
<html data-theme="light">
```

---

## Toast API

```js
mine.toast('File saved.');
mine.toast('Done!', { type: 'success' });
mine.toast('Error occurred.', { type: 'error' });
mine.toast('Deleted.', {
  type: 'warning',
  action: { label: 'Undo', fn: undo },
});

const { dismiss } = mine.toast('Uploading…', { duration: 0 });
dismiss();
```

---

## Bundle sizes

| File | Gzipped |
|---|---|
| `mine.min.css` | ≤ 8 KB |
| `mine.js` (IIFE) | ≤ 3 KB |

---

## License

MIT
