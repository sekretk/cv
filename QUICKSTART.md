# Quick Start Guide

## What's New? 🎉

Your CV project now has a **custom Mustache-based theme**! All HTML generation happens in the `theme/` folder, giving you complete control over your resume's appearance.

## Test It Now! 🚀

### 1. Build Resume Data
```bash
npm run build:all
```

### 2. Preview in Browser
```bash
# English version
npm run serve:eng:watch
# Open: http://localhost:6002

# Russian version (in another terminal)
npm run serve:rus:watch
# Open: http://localhost:6003
```

### 3. Generate PDFs
```bash
npm run build:pdf
# Check: pdf/resume.eng.pdf and pdf/resume.rus.pdf
```

## What Was Created?

```
theme/
├── index.js                   ← Main render logic
├── templates/
│   └── resume.mustache        ← HTML template
├── styles/
│   └── main.css               ← All styling
└── package.json
```

## How to Customize

### Change Colors
Edit `theme/styles/main.css`:
```css
/* Line 52: Primary brand color */
.label {
  color: #3498db;  /* Change this! */
}
```

### Modify Layout
Edit `theme/templates/resume.mustache` - it's just HTML with `{{variables}}`!

### Update Content
Edit `cv.json` and run `npm run build:all` again.

## Documentation

- **[THEME_GUIDE.md](THEME_GUIDE.md)** - Complete customization guide
- **[CUSTOM_THEME_IMPLEMENTATION.md](CUSTOM_THEME_IMPLEMENTATION.md)** - Technical details
- **[theme/README.md](theme/README.md)** - Theme-specific docs

## Common Tasks

### Add a new section
1. Add data to `cv.json`
2. Add HTML to `theme/templates/resume.mustache`
3. Add styles to `theme/styles/main.css`
4. Rebuild: `npm run build:all`

### Change fonts
Edit `theme/styles/main.css` line 9:
```css
font-family: -apple-system, BlinkMacSystemFont, /* your fonts here */
```

### Make dark mode
Copy `theme/styles/main.css` and create dark color scheme, or add CSS variables for theming.

## Everything Still Works! ✅

- ✅ Docker builds
- ✅ Kubernetes deployment
- ✅ GitHub Actions CI/CD
- ✅ PDF generation
- ✅ Multi-language support

No changes needed to deployment configuration!

## Pro Tips 💡

1. Keep `npm run serve:eng:watch` running while editing - auto-reloads!
2. Test in browser DevTools mobile view for responsive design
3. Use browser print preview to see PDF layout
4. Validate HTML: right-click → "View Page Source"

## Need Help?

Check the detailed guides:
- Theme customization → [THEME_GUIDE.md](THEME_GUIDE.md)
- Technical details → [CUSTOM_THEME_IMPLEMENTATION.md](CUSTOM_THEME_IMPLEMENTATION.md)
- Mustache syntax → https://mustache.github.io/

---

**Ready to customize?** Start editing `theme/styles/main.css` and `theme/templates/resume.mustache`! 🎨

