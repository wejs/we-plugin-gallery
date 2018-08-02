/**
 * We.js galerry main file
 */

module.exports = function loadPlugin(projectPath, Plugin) {
  const plugin = new Plugin(__dirname);

  plugin.setResource({ name: 'gallery' });
  plugin.setResource({ name: 'gallery-content' });

  return plugin;
};