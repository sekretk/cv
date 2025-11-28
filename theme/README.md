# Custom CV Theme

This is a custom resume theme built using Mustache templating engine.

## Structure

```
theme/
├── index.js              # Main render function
├── package.json          # Theme package definition
├── templates/            # Mustache templates
│   └── resume.mustache   # Main HTML template
└── styles/               # CSS styles
    └── main.css          # Main stylesheet
```

## How It Works

1. **Data Preparation**: The `render()` function in `index.js` receives resume data
2. **Template Loading**: Loads the Mustache template from `templates/resume.mustache`
3. **Style Injection**: Reads CSS from `styles/main.css` and injects it into the template
4. **Rendering**: Uses Mustache to combine data with template
5. **Output**: Returns complete HTML page

## Template Features

- **Responsive Design**: Mobile-friendly layout
- **Print Optimized**: Proper styling for PDF generation
- **Semantic HTML**: Clean, accessible markup
- **Modern Styling**: Professional appearance with good typography

## Sections Rendered

- Header with profile image, name, and contact info
- Summary/About section
- Work experience with highlights
- Skills organized by category
- Education history
- Languages
- Interests
- Footer with version info

## Customization

### Modifying Styles

Edit `styles/main.css` to change:
- Colors (search for hex codes like `#3498db`)
- Typography (font families, sizes)
- Layout (grid, flexbox properties)
- Spacing (margins, paddings)

### Modifying Template

Edit `templates/resume.mustache` to:
- Change HTML structure
- Add/remove sections
- Modify content layout
- Add new data fields

### Adding New Features

In `index.js`, you can:
- Add data preprocessing logic in `prepareResumeData()`
- Add conditional rendering flags
- Transform data before rendering

## Mustache Syntax Used

- `{{variable}}` - Outputs escaped text
- `{{{variable}}}` - Outputs unescaped HTML
- `{{#section}}...{{/section}}` - Conditional rendering/loops
- `{{^section}}...{{/section}}` - Inverted section (if not)
- `{{.}}` - Current item in iteration

## Testing

Run the development server to see changes live:

```bash
# Build resume data
npm run build:all

# Serve English version
npm run serve:eng:watch

# Serve Russian version
npm run serve:rus:watch
```

## Dependencies

- `mustache` - Template rendering
- `fs` - File system operations (built-in Node.js)
- `path` - Path handling (built-in Node.js)

