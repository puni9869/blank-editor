<p align="center">
  <img src="public/favicon/web-app-manifest-512x512.png" alt="App Icon" width="150" />
</p>

<h1 align="center">Blank Editor</h1>

<p align="center">
    A minimal, premium-grade AI-powered text editor for clean writing and intelligent editing.
</p>

<p align="center">
  <img src="https://img.shields.io/github/contributors/puni9869/blank-editor" alt="Contributors" />
  <img src="https://img.shields.io/github/issues/puni9869/blank-editor" alt="Issues" />
  <img src="https://img.shields.io/github/issues-pr/puni9869/blank-editor" alt="Pull Requests" />
  <img src="https://img.shields.io/github/license/puni9869/blank-editor" alt="License" />
  <img src="https://img.shields.io/github/last-commit/puni9869/blank-editor" alt="Last Commit" />
</p>

---

## ✨ Features

### 🧠 AI-Powered Writing Assistance

- Smart content refinement and clarity improvement.
- Built with TipTap + ProseMirror
- Formatting: bold, italic, underline, strikethrough, highlight
- Headings (H1-H5), bullet/ordered lists, blockquote, code block, divider
- Text alignment controls: left, center, right, justify
- Journal block support

### 💾 Note Persistence

- Auto-save editor content and title in `localStorage`
- Save and manage notes in IndexedDB
- Search and reopen saved notes from the "All Notes"

### ⚡ Productivity

- Keyboard shortcuts for save, notes, fullscreen, and quick new page
- Fullscreen mode
- Minimal interface with responsive layout
- Toast feedback for editor actions

---

## Demo

Check out the live demo here: [Blank Editor Demo](https://puni9869.github.io/blank-editor/)

### Screenshots

![Blank Editor Screenshot 8](screenshots/image%20copy%204.png)
![Blank Editor Screenshot 4](screenshots/image%20copy%203.png)
![Blank Editor Screenshot 1](screenshots/image.png)
![Blank Editor Screenshot 2](screenshots/image%20copy.png)
![Blank Editor Screenshot 3](screenshots/image%20copy%202.png)

---

## Installation

```bash
git clone https://github.com/puni9869/blank-editor.git
cd blank-editor
corepack enable
pnpm install
```

> If `corepack` is unavailable, install pnpm globally with `npm install -g pnpm`.

---

## Usage

### Development

```bash
pnpm dev
```

This opens the editor locally at `http://localhost:5173`.

### Build for Production

```bash
pnpm build
pnpm preview
```

### Format and Lint

```bash
pnpm format       # Prettier formatting
pnpm lint         # ESLint checks
pnpm lint:fix     # Auto-fix linting issues
```

---

## Contributing

We ❤️ contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

- Fork the repo
- Create a new branch (`feature/your-feature`)
- Submit pull requests for bug fixes or new features
- Ensure `pnpm lint` passes before submitting

---

## Reporting Issues

If you find a bug or have a feature request, please open an issue on
GitHub: [Issues](https://github.com/puni9869/blank-editor/issues)

---

## License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

---

## Contributors

Thanks to all the wonderful contributors ❤️
