// Usage:
const config = {
    template: true // or 'path/to/template.html' or 'dynamic'
};

const engine = new PageEngine(config);

engine.setPages([
    { page_id: 'home', page: 'home.html', title: 'Welcome to our Page', heading: 'Welcome to our Site' },
    { page_id: 'about', page: 'about.html', title: 'About Engine 3.0 ', heading: 'About Engine 3' },

    // Add more pages as needed
]);

// To load a page programmatically:
// engine.load('about');