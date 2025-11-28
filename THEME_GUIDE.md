# Custom Theme Guide

## Overview

This project now uses a **custom Mustache-based theme** instead of the Kendall theme from node_modules. All HTML generation logic is self-contained in the `theme/` directory.

## Architecture

### Data Flow

```
cv.json (template)
    ↓
[mustache] + i18n/eng.json → out/eng.json
[mustache] + i18n/rus.json → out/rus.json
    ↓
[resume-cli] + theme/ → HTML/PDF output
```

### Directory Structure

```
cv/
├── cv.json                    # Resume template with {{ placeholders }}
├── i18n/                      # Internationalization data
│   ├── eng.json              # English translations (name, etc.)
│   └── rus.json              # Russian translations
├── out/                       # Generated resume JSON (git-ignored)
│   ├── eng.json              # English resume data
│   └── rus.json              # Russian resume data
├── theme/                     # Custom theme (NEW!)
│   ├── index.js              # Main render function
│   ├── package.json          # Theme package definition
│   ├── templates/            # Mustache HTML templates
│   │   └── resume.mustache   # Main template
│   ├── styles/               # CSS styles
│   │   └── main.css          # Main stylesheet
│   └── README.md             # Theme documentation
├── pdf/                       # Generated PDFs (git-ignored)
│   ├── resume.eng.pdf
│   └── resume.rus.pdf
└── public-eng/                # HTML output (git-ignored)
    └── public-rus/
```

## Workflow

### 1. Edit Resume Content

Edit `cv.json` to update your resume content. Use Mustache placeholders for i18n:

```json
{
  "basics": {
    "name": "{{ name }}",
    "label": "Typescript Developer"
  }
}
```

### 2. Edit Translations

Update `i18n/eng.json` or `i18n/rus.json`:

```json
{
  "name": "Konstantin Sekret",
  "about": "About"
}
```

### 3. Build Resume Data

Generate language-specific JSON files:

```bash
npm run build:all
# Creates out/eng.json and out/rus.json
```

### 4. Preview (Development)

Start live preview server:

```bash
# English version
npm run serve:eng:watch

# Russian version  
npm run serve:rus:watch
```

Visit:
- English: http://localhost:6002
- Russian: http://localhost:6003

### 5. Generate PDFs

Build PDF versions:

```bash
npm run build:pdf
# Creates pdf/resume.eng.pdf and pdf/resume.rus.pdf
```

## Customizing the Theme

### Changing Styles

Edit `theme/styles/main.css`:

```css
/* Change primary color */
.label {
  color: #3498db;  /* Change this hex code */
}

/* Adjust spacing */
.section {
  margin-bottom: 35px;  /* Adjust margins */
}
```

### Modifying HTML Structure

Edit `theme/templates/resume.mustache`:

```html
<!-- Add a new section -->
{{#customSection}}
<section class="section">
  <h3 class="section-title">Custom Section</h3>
  <p>{{customContent}}</p>
</section>
{{/customSection}}
```

### Adding Data Processing

Edit `theme/index.js` to preprocess data:

```javascript
function prepareResumeData(resume) {
  const prepared = { ...resume };
  
  // Add custom logic here
  prepared.hasCustomSection = resume.customSection && resume.customSection.length > 0;
  
  return prepared;
}
```

## NPM Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run build:eng` | Build English JSON from template |
| `npm run build:rus` | Build Russian JSON from template |
| `npm run build:all` | Build both language versions |
| `npm run serve:eng` | Serve English version (one-time) |
| `npm run serve:rus` | Serve Russian version (one-time) |
| `npm run serve:eng:watch` | Serve English with auto-reload |
| `npm run serve:rus:watch` | Serve Russian with auto-reload |
| `npm run build:pdf:eng` | Generate English PDF |
| `npm run build:pdf:rus` | Generate Russian PDF |
| `npm run build:pdf` | Generate both PDFs |
| `npm run serve:pdf` | Serve PDF directory |

## Theme Features

### Current Features

✅ **Responsive Design** - Mobile-friendly layout  
✅ **Print Optimized** - Proper styling for PDF generation  
✅ **Profile Image** - Circular profile photo  
✅ **Social Links** - GitHub, LinkedIn, Telegram  
✅ **Work Experience** - With highlights and dates  
✅ **Skills** - Categorized with level indicators  
✅ **Education** - With courses and dates  
✅ **Languages** - Fluency levels  
✅ **Interests** - Tag-based display  
✅ **Version Info** - Footer with version and date  

### Planned Features

🔄 **Theme Switcher** - Light/Dark mode  
🔄 **Language Switcher** - Client-side language toggle  
🔄 **Interactive Elements** - Animations and transitions  
🔄 **Custom Icons** - Icon library integration  

## Deployment

When deploying (via Docker/Kubernetes), ensure:

1. ✅ `out/` directory is created (scripts handle this)
2. ✅ `theme/` directory is included in Docker image
3. ✅ PDFs are generated during build process
4. ✅ All dependencies are installed

## Troubleshooting

### Theme Not Loading

If resume-cli can't find the theme:

```bash
# Check theme structure
ls -la theme/
# Should show: index.js, package.json, templates/, styles/

# Verify package.json exists in theme/
cat theme/package.json
```

### Mustache Syntax Errors

If template rendering fails:

1. Check template syntax in `theme/templates/resume.mustache`
2. Verify data structure matches template expectations
3. Check console output for specific error messages

### Missing Data

If sections don't appear:

1. Verify data exists in `cv.json`
2. Check conditional flags in `prepareResumeData()` function
3. Ensure JSON is valid (use JSON validator)

### PDF Generation Fails

If PDF export fails:

```bash
# Run with more output
npm run build:pdf:eng -- --debug

# Check if HTML generation works first
npm run serve:eng
```

## Migration from Kendall Theme

The project previously used `jsonresume-theme-kendall` from node_modules. Key changes:

| Old | New |
|-----|-----|
| `--theme kendall` | `--theme ./theme` |
| External theme package | Local theme directory |
| Limited customization | Full control over HTML/CSS |
| No Mustache templates | Mustache-based templates |

The Kendall theme package is still installed but no longer used in scripts.

## Advanced Customization

### Adding a New Language

1. Create `i18n/fra.json` (for French)
2. Add translations
3. Add build script to `package.json`:
   ```json
   "build:fra": "mkdir -p out && mustache ./i18n/fra.json cv.json > ./out/fra.json"
   ```
4. Add serve scripts if needed

### Custom Mustache Helpers

The current setup uses basic Mustache. For advanced features (custom helpers, partials), consider switching to Handlebars in `theme/index.js`.

### Multiple Theme Variants

To support multiple themes:

1. Create `theme-dark/`, `theme-minimal/`, etc.
2. Duplicate theme structure
3. Modify scripts to accept theme parameter
4. Use environment variables to select theme

## Resources

- [Mustache Manual](https://mustache.github.io/mustache.5.html)
- [JSON Resume Schema](https://jsonresume.org/schema/)
- [Resume CLI Documentation](https://github.com/jsonresume/resume-cli)

## Support

For issues or questions:
1. Check theme console output in browser DevTools
2. Review `theme/README.md` for detailed theme docs
3. Test with simple data first
4. Check examples in Mustache documentation

