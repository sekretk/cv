const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');

/**
 * Prepares resume data for Mustache template
 * Adds helper flags for conditional rendering
 */
function prepareResumeData(resume) {
  const prepared = { ...resume };
  
  // Add flags for sections that have content
  prepared.hasWork = resume.work && resume.work.length > 0;
  prepared.hasSkills = resume.skills && resume.skills.length > 0;
  prepared.hasEducation = resume.education && resume.education.length > 0;
  prepared.hasLanguages = resume.languages && resume.languages.length > 0;
  prepared.hasInterests = resume.interests && resume.interests.length > 0;
  
  // Add social network type flags for icons
  if (resume.basics && resume.basics.profiles) {
    prepared.basics.profiles = resume.basics.profiles.map(profile => ({
      ...profile,
      isGithub: profile.network && profile.network.toLowerCase() === 'github',
      isLinkedin: profile.network && profile.network.toLowerCase() === 'linkedin',
      isTelegram: profile.network && profile.network.toLowerCase() === 'telegram'
    }));
  }
  
  // Add language code flags for icons
  if (resume.meta && resume.meta.languages) {
    prepared.meta.languages = resume.meta.languages.map(lang => ({
      ...lang,
      isEng: lang.code && lang.code.toLowerCase() === 'eng',
      isRus: lang.code && lang.code.toLowerCase() === 'rus'
    }));
  }
  
  return prepared;
}

/**
 * Main render function
 * Generates HTML from resume data using Mustache templates
 */
function render(resume) {
  try {
    // Read the Mustache template
    const templatePath = path.join(__dirname, 'templates', 'resume.mustache');
    const template = fs.readFileSync(templatePath, 'utf8');
    
    // Read the CSS styles
    const stylesPath = path.join(__dirname, 'styles', 'main.css');
    const styles = fs.readFileSync(stylesPath, 'utf8');
    
    // Prepare resume data with helper flags
    const preparedResume = prepareResumeData(resume);
    
    // Add styles to the data object
    preparedResume.styles = styles;
    
    // Render the template with Mustache
    const html = Mustache.render(template, preparedResume);
    
    return html;
  } catch (error) {
    console.error('Error rendering resume:', error);
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
      </head>
      <body>
        <h1>Error rendering resume</h1>
        <p>${error.message}</p>
      </body>
      </html>
    `;
  }
}

// Export for resume-cli
module.exports = {
  render
};
