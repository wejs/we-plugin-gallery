
/**
 * Return a list of updates
 *
 * @param  {Object} we we.js object
 * @return {Array}    a list of update objects
 */
function updates() {
  return [{
    version: '1.1.0',
    update(we, done) {
      we.log.info('Start we-plugin-gallery update v1.1.0');

      const sql = 'ALTER TABLE `galleries` '+
        'ADD COLUMN `date` DATETIME DEFAULT NULL';

      we.db.defaultConnection
      .query(sql)
      .then( ()=> {
        we.log.info('Done we-plugin-gallery  update v1.1.0');
        done();
      })
      .catch(done);
    }
  },{
    version: '1.1.1',
    update(we, done) {
      we.log.info('Start we-plugin-gallery update v1.1.1');

      const sql = 'ALTER TABLE `galleries` '+
        'ADD COLUMN `date` DATETIME DEFAULT NULL';

      we.db.defaultConnection
      .query(sql)
      .then( ()=> {
        we.log.info('Done we-plugin-gallery  update v1.1.1');
        done();
      })
      .catch( (err)=> {
        we.log.warn('Done with error we-plugin-gallery  update v1.1.1', {
          error: err
        });
        done();
      });
    }
  }]
}

module.exports = updates;