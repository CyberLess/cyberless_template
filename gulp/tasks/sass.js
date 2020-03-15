// =========================================================
// Gulp Task: sass
// =========================================================

let path = require('../settings/path.json');

module.exports = (gulp, plugins, browserSync) => {
    return async () => {

        let input = "";
        let errorHandler = plugins.notify.onError('<%= error.message %>');

        return Promise.all([
            new Promise((resolve, reject)=> {
                gulp.src(path.src.css)   
                    .pipe(plugins.sassGlob())
                    .pipe(plugins.plumber({errorHandler}))
                    .pipe(plugins.sass())
                    .pipe(plugins.replace(/[^{]*\{([^}]*)*}/g, match => {

                        let replaced = match;

                        if(replaced.includes('url') && (replaced.includes('background') || replaced.includes('background-image'))){

                            let selector = replaced.substr(0, replaced.indexOf('{')).replace(/}/g, '').trim(); 

                            let bg =  replaced.match(/\b(?:background\s*?([^;>]*?)(?=[;">}]);)/g).join(" ").replace('/img/','/app/img/')

                            input += ".ws "+selector+"{"+bg.replace(/(gif|jpg|jpeg|tiff|png)/g,'webp')+"} .wn "+selector+"{"+bg+"}"
                        }

                        return replaced;

                    }))  
                    .on('error', reject)
                    .pipe(gulp.dest(path.build.css))
                    .on('end', resolve)                           
            })
        ]).then(()=>{

            return gulp.src(path.src.css)   
                .pipe(plugins.sassGlob())  
                .pipe(plugins.plumber({}))     
                .pipe(plugins.sass())             
                .pipe(plugins.replace(/[^{]*\{([^}]*)*}/g, match => {

                    let replaced = match;
                    
                    if(replaced.includes('url') && (replaced.includes('background') || replaced.includes('background-image'))){
                        let newreplaced = replaced.replace(/\b(?:background\s*?([^;>]*?)(?=[;">}]);)/g, ''); 
                        replaced = newreplaced
                    }

                    return replaced;

                }))             
                .pipe(plugins.injectString.append(input))
                .pipe(plugins.autoprefixer(['last 2 versions', '> 1%', 'ie 8'], { cascade: true })) 
                .pipe(plugins.cssmin())            
                .pipe(gulp.dest(path.build.css)) 
                .pipe(browserSync.stream());

        });  

    };
};
