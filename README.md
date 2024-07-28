Page Engine 3.0 by Reginald Hassan (c) 1Community Network 2024

engine is an object with all the major methodes to manage a web app
write a page manage that works with an option pages array of objects {page_id:'home',page:'home.html', title:'Welcome to our Page', heading:'Wecome to our Site'} and Page_load Array with objects {page_id and Page_load}

after the page is Template is loaded

Template is the structure website with an empty middle with a div with id = main also optional divs will be <nav bar and footer> these will be assigned as optional .

Page engine script when loaded will look for object config if availabel esle will run on its defaul settings and define

config ={
template: null, // options null = non, true = defalt as template.html in ./pages/template.html else the locationand file name of template or dynamic means (template1, to ...) details assigned to this.template01 ... to template10,

}

pages can be called through methods of Engine.load(page_id),
pages can all load via hash change or home page loades with #page_id , or ?page=page_id or home_page/page_id
when engine.pages or array of obeject pages is available merge or synce and us to get and set aproprate page Title and heading Elements then load page and add to the Page_load object wen load the html page form /pages directory into array object and page_id so when a page is called before loading from file check if page is in array already. also when page is called with no request load home.html in /pages/ all pages except specified other wise in pages array shoud be same as in in /pages/. when a page is not found load page notfound.html or 404.html all in pages/system/ or Page .. {page_id} is not available yet or coming soon text . once page is loaded and the requested page is loaded, gradually load all the other pages into the buffer or pages_load object
config an

To create the engine3.0.js JavaScript file for the Page Engine 3.0 as described, you'll need to implement several features and handle various scenarios based on the provided configuration. The main responsibilities include managing pages, handling URL changes, and loading templates and content dynamically.
