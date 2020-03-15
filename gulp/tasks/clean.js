// Gulp Task: clean
// Description: deletes dist folder
// npm install --save-dev del gulp-load-plugins
// =========================================================

let path = require('../settings/path.json'),
	del = require('del');

module.exports = (gulp, plugins) => {

    return async () => {
    	
	    del.sync('dist');

    };
};