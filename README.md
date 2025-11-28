# CV/Resume Project

Multi-language professional resume generator with custom Mustache-based theme.

## Features

✅ **Multi-language Support** - English and Russian versions  
✅ **Custom Theme** - Built with Mustache templates and custom CSS  
✅ **Live Preview** - Auto-reloading development server  
✅ **PDF Generation** - Professional PDF export  
✅ **Docker/Kubernetes** - Production-ready deployment  
✅ **CI/CD Pipeline** - Automated releases via GitHub Actions  

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Build resume data
npm run build:all

# Start live preview
npm run serve:eng:watch    # English version at http://localhost:6002
npm run serve:rus:watch    # Russian version at http://localhost:6003
```

### Generate PDFs

```bash
npm run build:pdf
# Creates: pdf/resume.eng.pdf and pdf/resume.rus.pdf
```

## Project Structure

- `cv.json` - Resume template with Mustache placeholders
- `i18n/` - Language-specific translations
- `theme/` - **Custom theme** with Mustache templates and CSS
- `out/` - Generated resume JSON files (git-ignored)
- `pdf/` - Generated PDF files (git-ignored)

## Customization

See [THEME_GUIDE.md](THEME_GUIDE.md) for detailed documentation on:
- Customizing styles and layout
- Modifying HTML templates
- Adding new languages
- Theme development workflow

## Deployment

### Release Process

1. Update version in `package.json`
2. Commit and push changes
3. Create and push a version tag:
   ```bash
   git tag 1.0.0
   git push origin 1.0.0
   ```
4. GitHub Actions automatically handles the rest

### Kubernetes Setup

Base64 encode your kubeconfig and add as GitHub Secret:

```bash
cat ~/.kube/config | base64 | pbcopy
```

Add to GitHub:
- Navigate to: Settings → Secrets and variables → Actions
- Name: `KUBE_CONFIG`
- Value: Paste the base64-encoded string

## Todo

* ✅ Custom theme with Mustache
* ✅ Use Mustache for i18n
* ✅ Responsive/Mobile version
* 🔄 Add language switcher in HTML
* 🔄 Integrate date in result HTML
* 🔄 Add PDF link in result HTML
* 🔄 Theme switch (light/dark)
