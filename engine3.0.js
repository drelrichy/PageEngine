// Page Engine 3.0 by Reginald Hassan (c) 1Community Network 2024

class PageEngine {
    constructor(config = {}) {

    

        this.config = {
          default_file_location:'./pages/',
            template: null,
            ...config
        };
        this.pages = [];
        this.pageLoad = [];
        this.currentPage = null;
        this.default_file_location='./pages/';

        this.init();
    }

    init() {
        this.loadTemplate();
        this.setupEventListeners();
        this.loadInitialPage();
    }

    loadTemplate() {
        if (this.config.template === true) {
            this.loadTemplateFile('./pages/template.html');
        } else if (typeof this.config.template === 'string') {
            this.loadTemplateFile(this.config.template);
        } else if (this.config.template === 'dynamic') {
            // Implement dynamic template loading logic here
        }
    }

    loadTemplateFile(templatePath) {
        fetch(templatePath)
            .then(response => response.text())
            .then(html => {
                document.body.innerHTML = html;
                this.loadInitialPage();
            })
            .catch(error => console.error('Error loading template:', error));
    }

    setupEventListeners() {
        window.addEventListener('hashchange', () => this.handleUrlChange());
        window.addEventListener('popstate', () => this.handleUrlChange());
    }

    handleUrlChange() {
        const pageId = this.getPageIdFromUrl();

        console.log ('we found!=', pageId);
        this.loadPage(pageId);
    }

    getPageIdFromUrl() {
        const hash = window.location.hash.slice(1);
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page') || urlParams.get('main');
        const pathSegments = window.location.pathname.split('/');

        return hash || pageParam || pathSegments[pathSegments.length - 1] || 'home';
    }

    loadInitialPage() {
        const pageId = this.getPageIdFromUrl();
        this.loadPage(pageId);
    }

    loadPage(pageId) {
        const page = this.getPageInfo(pageId);

        if (!page) {


            this.loadNotFoundPage();
            return;


        }

        this.currentPage = page;
        this.updatePageMetadata();

        if (this.pageLoad.some(p => p.page_id === pageId)) {
            this.renderPage(pageId);
        } else {
            this.fetchAndRenderPage(pageId);
        }

        this.preloadOtherPages();
    }

    async getPage(pageId) {


        const pagePath = `${this.default_file_location}${pageId}.html`;
console.log('now checking', pagePath);
        
        try {
            const response = await fetch(pagePath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            
            // Create a temporary element to parse the HTML
            const tempElement = document.createElement('div');
            tempElement.innerHTML = html;
            
            // Extract title from the <title> tag
            const titleElement = tempElement.querySelector('title');
            const title = titleElement ? titleElement.textContent : `${pageId} Page`;
            
            // Extract heading from the first <h1> tag
            const headingElement = tempElement.querySelector('h1');
            const heading = headingElement ? headingElement.textContent : `${pageId} Heading`;
            
            // Create and return the page info object
            const pageInfo = {
                page_id: pageId,
                page: `${pageId}.html`,
                title: title,
                heading: heading
            };
            
            // Update the pages array with this information
            const existingPageIndex = this.pages.findIndex(p => p.page_id === pageId);
            if (existingPageIndex !== -1) {
                this.pages[existingPageIndex] = pageInfo;
            } else {
                this.pages.push(pageInfo);
            }
            
            return pageInfo;
        } catch (error) {
            console.error(`Error checking/loading page ${pageId}:`, error);
            return null;
        }


    }

    getPageInfo(pageId) {

let iSeeAm = this.pages.find(p => p.page_id === pageId);


let eDay = null;

if (!iSeeAm){

eDay = this.getPage(pageId);


}

        return (eDay)? eDay : iSeeAm;
    }

    updatePageMetadata() {
        document.title = this.currentPage.title;
        const headingElement = document.querySelector('h1');
        if (headingElement) {
            headingElement.textContent = this.currentPage.heading;
        }
    }

    renderPage(pageId) {
        const pageContent = this.pageLoad.find(p => p.page_id === pageId).content;
        document.getElementById('main').innerHTML = pageContent;
    }

    fetchAndRenderPage(pageId) {
        const pagePath = `./pages/${pageId}.html`;

        console.log('loading..', pagePath);
        fetch(pagePath)
            .then(response => response.text())
            .then(html => {
                this.pageLoad.push({ page_id: pageId, content: html });
                this.renderPage(pageId);
            })
            .catch(error => {
                console.error('Error loading page:', error);
                this.loadNotFoundPage();
            });
    }

    loadNotFoundPage() {
        fetch('./pages/system/404.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('main').innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading 404 page:', error);
                document.getElementById('main').innerHTML = 'Page not found or coming soon.';
            });
    }

    preloadOtherPages() {
        this.pages.forEach(page => {
            if (page.page_id !== this.currentPage.page_id && !this.pageLoad.some(p => p.page_id === page.page_id)) {
                this.fetchAndCachePage(page.page_id);
            }
        });
    }

    fetchAndCachePage(pageId) {
        const pagePath = `./pages/${pageId}.html`;
        fetch(pagePath)
            .then(response => response.text())
            .then(html => {
                this.pageLoad.push({ page_id: pageId, content: html });
            })
            .catch(error => console.error('Error preloading page:', error));
    }

    setPages(pages) {
        this.pages = pages;
    }

    load(pageId) {
        window.location.hash = pageId;
    }
}

