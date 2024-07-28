// Example usage
const config = {
    template: 'template.html', // or 'dynamic'
    pages: [
        { page_id: 'home', page: 'home.html', title: 'Welcome to our Page', heading: 'Welcome to our Site' },
        { page_id: 'about', page: 'about.html', title: 'About Us', heading: 'About Us' },
        { page_id: 'contact', page: 'contact.html', title: 'Contact Us', heading: 'Contact Us' }
    ]
};

const pageEngine = new PageEngine(config);

// Gradually load additional pages
pageEngine.graduallyLoadPages();
