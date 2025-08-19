// Global site configuration
window.siteConfig = {
    // Personal Information
    name: "Andrew Busch",
    title: "AI Engineer & Full-Stack Developer",
    email: "andbusch@umich.edu",
    
    // Links
    links: {
        resume: "https://drive.google.com/file/d/1WeQdk3bBCgDyhE8vC-eh2ms8twR-pNJc/view?usp=sharing",
        github: "https://github.com/andbusch",
        linkedin: "https://linkedin.com/in/andrewbusch472"
    },
    
    // GitHub Icon SVG
    githubIcon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>`
};

// Function to generate navigation HTML
window.generateNavigation = function(currentPage = 'index') {
    const config = window.siteConfig;
    const homeLink = currentPage === 'index' ? '#' : 'index.html';
    const sectionPrefix = currentPage === 'index' ? '#' : 'index.html#';
    
    return `
        <nav>
            <div class="logo">
                <a href="${homeLink}">
                    <h1>${config.name}</h1>
                </a>
            </div>
            <ul class="nav-links">
                <li><a href="${sectionPrefix}about">About</a></li>
                <li><a href="${sectionPrefix}projects">Projects</a></li>
                <li><a href="${sectionPrefix}contact">Contact</a></li>
                <li><a href="${config.links.resume}" target="_blank">Resume</a></li>
                <li><a href="${config.links.github}" target="_blank">
                    ${config.githubIcon}
                </a></li>
            </ul>
        </nav>
    `;
};

// Function to generate contact links
window.generateContactLinks = function() {
    const config = window.siteConfig;
    
    return `
        <a href="mailto:${config.email}">Email</a>
        <a href="${config.links.github}" target="_blank">GitHub</a>
        <a href="${config.links.linkedin}" target="_blank">LinkedIn</a>
        <a href="${config.links.resume}" target="_blank" class="resume-button">View Resume</a>
    `;
};