/**
 * We.js galerry main file
 */

module.exports = function loadPlugin(projectPath, Plugin) {
  const plugin = new Plugin(__dirname);

  plugin.setResource({ name: 'gallery' });
  plugin.setResource({
    name: 'gallery-content',
    findAll: {
      titleHandler(req, res, next) {
        if (!res.locals.gallery || !res.locals.gallery.name) {
          res.locals.title = res.locals.__('gallery.find');
          return next();
        }

        res.locals.title = res.locals.gallery.name;

        next();
      },
      breadcrumbHandler(req, res, next) {
        if (res.locals.gallery && res.locals.gallery.name) {
          res.locals.breadcrumb =
            '<ol class="breadcrumb">'+
              '<li><a href="/">'+res.locals.__('Home')+'</a></li>'+
              '<li><a href="/gallery">'+
                res.locals.__('gallery.find')+
              '</a></li>'+
              '<li class="active">'+res.locals.gallery.name+'</li>'+
            '</ol>';
        } else {
          res.locals.breadcrumb =
            '<ol class="breadcrumb">'+
              '<li><a href="/">'+res.locals.__('Home')+'</a></li>'+
              '<li class="active">'+res.locals.__(res.locals.resourceName + '.find')+'</li>'+
            '</ol>';
        }

        next();
      }
    }
  });

  return plugin;
};