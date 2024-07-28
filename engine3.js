// engine3.0.js

(function(global) {
    // Page Engine Constructor
    function PageEngine(config) {
        this.config = config || {};
        this.pages = this.config.pages || [];
        this.page_load = {};
        this.template = this.config.template || 'template.html';
        this.init();
    }

    PageEngine.prototype = {
        init: function() {
            this.loadTemplate();
            this.setupEvents();
        },

        loadTemplate: function() {
            if (this.template === 'dynamic') {
                this.template = 'template.html'; // default dynamic template
            }
            // Load template if specified
            if (this.template) {
                fetch('/pages/' + this.template)
                    .then(response => response.text())
                    .then(templateHtml => {
                        document.open();
                        document.write(templateHtml);
                        document.close();
                        this.templateLoaded();
                    })
                    .catch(err => console.error('Error loading template:', err));
            } else {
                this.templateLoaded();
            }
        },

        templateLoaded: function() {
            window.addEventListener('hashchange', this.handleHashChange.bind(this));
            window.addEventListener('popstate', this.handlePopState.bind(this));
            this.loadInitialPage();
        },

        setupEvents: function() {
            window.addEventListener('DOMContentLoaded', () => {
                this.loadInitialPage();
            });
        },

        loadInitialPage: function() {
            const initialPage = this.getPageFromUrl() || 'home';
            this.loadPage(initialPage);
        },

        handleHashChange: function() {
            const pageId = this.getPageFromUrl();
            this.loadPage(pageId);
        },

        handlePopState: function() {
            const pageId = this.getPageFromUrl();
            this.loadPage(pageId);
        },

        getPageFromUrl: function() {
            const url = window.location.href;
            const hashIndex = url.indexOf('#');
            const queryIndex = url.indexOf('?page=');
            const pathIndex = url.indexOf('home_page/');

            if (hashIndex !== -1) {
                return url.substring(hashIndex + 1).split('/')[0];
            } else if (queryIndex !== -1) {
                return url.substring(queryIndex + 6).split('/')[0];
            } else if (pathIndex !== -1) {
                return url.substring(pathIndex + 10).split('/')[0];
            } else {
                return null;
            }
        },

        loadPage: function(pageId) {
            if (!pageId || pageId === 'home') {
                pageId = 'home';
            }

            const page = this.pages.find(p => p.page_id === pageId);
            if (page) {
                if (this.page_load[pageId]) {
                    this.renderPage(this.page_load[pageId], page);
                } else {
                    this.fetchPage(page.page, pageId);
                }
            } else {
                this.loadPageNotFound();
            }
        },

        fetchPage: function(pageFile, pageId) {
            fetch('/pages/' + pageFile)
                .then(response => response.text())
                .then(pageHtml => {
                    this.page_load[pageId] = pageHtml;
                    this.renderPage(pageHtml, this.pages.find(p => p.page_id === pageId));
                })
                .catch(err => {
                    console.error('Error loading page:', err);
                    this.loadPageNotFound();
                });
        },

        renderPage: function(pageHtml, page) {
            const mainContent = document.getElementById('main');
            if (mainContent) {
                mainContent.innerHTML = pageHtml;
                document.title = page.title || 'Page';
                document.getElementById('heading').innerText = page.heading || 'Welcome';
            }
        },

        loadPageNotFound: function() {
            fetch('/pages/system/404.html')
                .then(response => response.text())
                .then(pageHtml => {
                    const mainContent = document.getElementById('main');
                    if (mainContent) {
                        mainContent.innerHTML = pageHtml;
                        document.title = '404 Not Found';
                        document.getElementById('heading').innerText = 'Page Not Found';
                    }
                })
                .catch(err => console.error('Error loading 404 page:', err));
        },

        syncPages: function(newPages) {
            this.pages = newPages;
        },

        graduallyLoadPages: function() {
            this.pages.forEach(page => {
                if (!this.page_load[page.page_id]) {
                    this.fetchPage(page.page, page.page_id);
                }
            });
        }
    };

    // Create a global PageEngine instance
    global.PageEngine = PageEngine;

})(window);

