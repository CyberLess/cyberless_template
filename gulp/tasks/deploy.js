// =========================================================
// Gulp Task: Deploy
// =========================================================
let folder = __dirname.replace(/\\gulp\\tasks/g,'');
let projectName = folder.replace(/.*\\([^\\]+)\\/gm, '').replace('_', '-');

let ftp = require('vinyl-ftp');
let ftpData = require('../settings/ftp.json');

module.exports = function(gulp, plugins) {

    return async () => {

    	console.log(`name is ${projectName}`)

	    var conn = ftp.create( {
	        host:     ftpData.host,
	        user:     ftpData.user,
	        password: ftpData.pass,
	        parallel: 10
	    });

	    var supPath = `/www/${projectName}.${ftpData.domain}/`;

	    var globs = [
	        'dist/**/*.*'
	    ];

	    conn.rmdir(supPath, e => {
	        if (e === undefined) {
	            return gulp.src(globs, {base: 'dist', buffer: false})
			            .pipe(plugins.newer('dist/**/*.*'))
	                    .pipe(conn.dest(supPath))	            
	        }
	        
	        return console.log(e);
	    });

    };
};