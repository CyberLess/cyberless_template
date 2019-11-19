const projectName = __dirname.replace(/D:\\GULP\\/g, '').toLowerCase();
const path = require('./path.json');

const ftpData = require('./ftp.json');

const 
    gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    cssmin        = require('gulp-cssmin'), 
    sassGlob      = require('gulp-sass-glob'),
    cache         = require('gulp-cache'),
    pug           = require('gulp-pug'),
    del           = require('del'), 
    glob          = require('glob'),
    fs            = require('fs'),
    ftp           = require('vinyl-ftp'),
    es            = require('event-stream'),
    replace       = require('gulp-replace'),
    plumber       = require('gulp-plumber'),
    concat        = require('gulp-concat'),
    pugbem        = require('gulp-pugbem'),
    open          = require('gulp-open'),
    zip           = require('gulp-zip'),
    map           = require('map-stream'),
    imgmin        = require('imagemin'),
    imageminJpeg  = require('imagemin-jpegtran'),
    imageminPng   = require('imagemin-pngquant'),
    imageminWebp  = require('imagemin-webp'),
    svgSprite     = require('gulp-svg-sprite'),
    svgmin        = require('gulp-svgmin'),
    cheerio       = require('gulp-cheerio'),
    prettify      = require('gulp-html-prettify'),
    inject        = require('gulp-inject-string'),
    browserSync   = require('browser-sync').create(),
    notify        = require("gulp-notify"),
    rename        = require('gulp-rename'),
    webpack       = require('webpack'),
    webpackStream = require('webpack-stream'),
    reload        = browserSync.reload;

var errorHandler = notify.onError('<%= error.message %>');


gulp.task('sass', () => {
    let injectCss = "";

    return Promise.all([
        new Promise((resolve, reject)=> {
            gulp.src(path.src.css)   
                .pipe(sassGlob())
                .pipe(plumber({errorHandler}))
                .pipe(sass())
                .pipe(replace(/[^{]*\{([^}]*)*}/g, match => {

                    let replaced = match;

                    if(replaced.includes('url') && (replaced.includes('background') || replaced.includes('background-image'))){

                        let selector = replaced.substr(0, replaced.indexOf('{')).replace(/}/g, '').trim(); 

                        let bg =  replaced.match(/\b(?:background\s*?([^;>]*?)(?=[;">}]);)/g).join(" ").replace('/img/','/app/img/')

                        injectCss += ".ws "+selector+"{"+bg.replace(/(gif|jpg|jpeg|tiff|png)/g,'webp')+"} .wn "+selector+"{"+bg+"}"
                    }

                    return replaced;

                }))  
                .on('error', reject)
                .pipe(gulp.dest(path.build.css))
                .on('end', resolve)                           
        })
    ]).then(()=>{

        return gulp.src(path.src.css)   
            .pipe(sassGlob())  
            .pipe(plumber({}))     
            .pipe(sass())             
            .pipe(replace(/[^{]*\{([^}]*)*}/g, match => {

                let replaced = match;
                
                if(replaced.includes('url') && (replaced.includes('background') || replaced.includes('background-image'))){
                    let newreplaced = replaced.replace(/\b(?:background\s*?([^;>]*?)(?=[;">}]);)/g, ''); 
                    replaced = newreplaced
                }

                return replaced;

            }))              
            .pipe(inject.append(injectCss))
            .pipe(autoprefixer(['last 10 versions', '> 1%', 'ie 8'], { cascade: true })) 
            .pipe(cssmin())            
            .pipe(gulp.dest(path.build.css)) 
            .pipe(browserSync.stream());

    });    
})


gulp.task('deploy', () => {
 
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
                    .pipe(conn.dest(supPath));
            
        }
        return console.log(e);
    });
});

gulp.task('open', () => {
    gulp.src(__filename)
        .pipe(open({uri: `http://${projectName}.${ftpData.domain}/`}))
});

gulp.task('svgSpriteBuild', () => {
    return gulp.src(path.src.svg)
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: ($) => {
                $('[fill]:not(.dont-remove)').removeAttr('fill');
                $('[stroke]:not(.dont-remove)').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest(path.build.svg));
});

gulp.task('imgToWebp', () => {
    (async () => {
        const files = await imgmin([path.src.img], path.build.img, {
            plugins: [
                imageminWebp({
                    quality: 100
                })
            ],
        });
     
    })();
})

gulp.task('img', ['imgToWebp'], () => {     

    (async () => {
        const files = await imgmin([path.src.img], path.build.img, {
            plugins: [
                imageminJpeg({
                    progressive: true
                }),
                imageminPng({
                    quality: [0.7, 1]
                })
            ],

        });
     
    })();
 
});

gulp.task('list', ()=> {

    let files = glob.sync(path.build.html + '**/*.html'), ol = "<ol>";

    return gulp.src(path.build.html + 'index.html')
        .pipe(replace(/<div id="update-this"><\/div>/g , match => {

            files.map(file => {

                var fileHref = file.replace('dist', '')

                var content = fs.readFileSync(file, 'utf8');

                var fileName = content.match(/<title>(.*?)<\/title>/g).toString().replace(/<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>/g, '');


                if(fileHref.indexOf('index.html') === -1)
                    ol += `<li><a href="${fileHref}" target="_blank">${fileName}</a></li>`

            })

            ol += "</ol>";

            return ol;
        }))
        .pipe(gulp.dest(path.build.html))
})


gulp.task('js', () => {
    return gulp.src(path.src.js)
        .pipe(webpackStream({
            output: {
                filename: 'app.js',
            },
            module: {
                rules: [
                    {
                        test: /\.(js)$/,
                        exclude: /(node_modules)/,
                        loader: 'babel-loader',
                        query: {
                            presets: ['env']
                        }
                    }
                ]
            },
            externals: {
                jquery: 'jQuery'
            }
        }))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({
            stream: true
        }));
});


gulp.task('fonts', () => {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('attach', () => {
    gulp.src(path.src.attach)
        .pipe(gulp.dest(path.build.attach))
});

gulp.task('pug',  () => {

    return gulp.src(path.src.html)
        .pipe(plumber({errorHandler}))
        .pipe(pug({
            pretty: false
        }))
        .pipe(replace(/(css\/|\/css\/)|(js\/|\/js\/)/g, match => {

            let sub = (match.charAt(0) == "/") ? "/app" : "/app/";

            return sub + match;

        }))   
        .pipe(replace(/<img.*?src="(.*?)".*?(>)/g, match => {
             
            var attrs = match.replace(/(<img |<img|>|\/>)/g, '');
            var src, webpSrc, subAttr = [], template;

            attrs.match(/(\S+)=(["']?)([^\\\2]*?(?:\\[^\2].*?)*)(\2|$|>)/g).forEach((element) => {
                if(element.indexOf("src") !== -1){
                    src = element.match(/("|')(.*?)("|').*?/g).toString().replace('/img/','/app/img/');
                    webpSrc = src.replace(/(gif|jpg|jpeg|tiff|png)/g, 'webp') 
                }else{
                    subAttr.push(element.trim());
                }
            });         

            template =  `<picture>
                            <source type="image/webp" srcset=${webpSrc}>
                            <img src=${src} ${subAttr.join(" ")} />
                        </picture>`;  

            return template;

        })) 
        .pipe(replace(/(?:^|[^а-яёА-ЯЁ0-9_])(в|без|а|до|из|к|я|на|по|о|от|перед|при|через|с|у|за|над|об|под|про|для|и|или|со)(?:^|[^а-яёА-ЯЁ0-9_])/g, match => {

            var newText = (match.slice(-1) == " ") ? match.substr(0, match.length-1) + '&nbsp;' : match;

            return newText;

        }))    
        .pipe(prettify({indent_char: ' ', indent_size: 4}))
        .pipe(gulp.dest(path.build.html)) 
});

gulp.task('watch', ["concat"] , () => {
    browserSync.init({
        server: "dist"
    });

    gulp.watch(path.watch.css, (event, cb) => {
        setTimeout(()=>{gulp.start('sass');}, 1000);
    }); 

    gulp.watch(path.watch.js, (event, cb) => {
        gulp.start('js');
    }); 

    gulp.watch(path.watch.img, (event, cb) => {
        gulp.start('img');
    }); 

    gulp.watch(path.watch.attach, (event, cb) => {
        gulp.start('attach');
    }); 

    gulp.watch(path.watch.fonts, (event, cb) => {
        gulp.start('fonts');
    }); 

    gulp.watch(path.watch.html, (event, cb) => {
        gulp.start('pug');
    }); 

    gulp.watch(path.watch.svg, (event, cb) => {
        gulp.start('svgSpriteBuild');
    }); 

    gulp.watch(path.build.html + "*.html").on('change', browserSync.reload);

});

gulp.task('concat', ["clean", "svgSpriteBuild", "sass", "js", "img", "fonts", "pug", "attach"], ()=> {
    gulp.start('list');
})

gulp.task('pre-build', ["concat"], ()=> {
    gulp.start('deploy');
})

gulp.task('build', ["pre-build"], ()=> {
    gulp.start('open');
})

gulp.task('clear', callback => {
    return cache.clearAll();
})

gulp.task('clean', ()=> {
    return del.sync('dist'); 
});

gulp.task('default', ['watch']);