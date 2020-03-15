// =========================================================
// Gulp Task: svgSpriteBuild
// =========================================================

let path = require('../settings/path.json');

module.exports = (gulp, plugins) => {
    return () => {
	    var stream = 
			// -------------------------------------------- Start Task
			    gulp.src(path.src.svg)
			    .pipe(plugins.svgmin({
			        js2svg: {
			            pretty: true
			        }
			    }))
			    .pipe(plugins.cheerio({
			        run: ($) => {
			            $('[fill]:not(.dont-remove)').removeAttr('fill');
			            $('[stroke]:not(.dont-remove)').removeAttr('stroke');
			            $('[style]').removeAttr('style');
			        },
			        parserOptions: {xmlMode: true}
			    }))
			    .pipe(plugins.replace('&gt;', '>'))
			    .pipe(plugins.svgSprite({
			        mode: {
			            symbol: {
			                sprite: "../sprite.svg"
			            }
			        }
			    }))
			    .pipe(gulp.dest(path.build.svg));
			// ---------------------------------------------- End Task
	    return stream;
    };
};