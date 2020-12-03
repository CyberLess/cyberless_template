// init
var gulp = require("gulp"),
	plugins = require("gulp-load-plugins")(),
	path = require("./gulp/settings/path.json"),
	browserSync = require("browser-sync").create();

global.emittyChangedFile = {
	path: "",
	stats: null,
};

// function to get tasks from gulp/tasks
let getTask = (task) => {
	return require("./gulp/tasks/" + task)(gulp, plugins, browserSync);
};

// task list
gulp.task("clean", getTask("clean"));
gulp.task("sass", getTask("sass"));
gulp.task("deploy", getTask("deploy"));
gulp.task("open", getTask("open"));
gulp.task("svgSpriteBuild", getTask("svgSpriteBuild"));
gulp.task("imageCompress", getTask("imageCompress"));
gulp.task("pageList", getTask("pageList"));
gulp.task("js", getTask("js"));
gulp.task("pug", getTask("pug"));
gulp.task("vendors", getTask("vendors"));

gulp.task("browserSync", (cb) => {
	browserSync.init(
		{
			server: "dist",
			notify: false,
		},
		cb
	);

	global.watch = true;

	gulp.watch(path.watch.css, gulp.series("sass"));
	gulp.watch(path.watch.js, gulp.series("js"));
	gulp.watch(path.watch.html, gulp.series("pug", "pageList")).on(
		"all",
		(event, filepath, stats) => {
			console.log("filepath is ", filepath);
			global.emittyChangedFile = {
				path: filepath,
				stats,
			};
		}
	);

	gulp.watch(path.watch.img, gulp.series("imageCompress"));
	gulp.watch(path.watch.svg, gulp.series("svgSpriteBuild"));
	gulp.watch(path.watch.attach, gulp.series("vendors"));
	gulp.watch(path.watch.fonts, gulp.series("vendors"));

	// gulp.watch([
	// 	`${path.build.html}*.html`,
	// 	`!${path.build.html}index.html`,
	// ]).on("change", browserSync.reload);
});

gulp.task(
	"watch",
	gulp.series(
		"clean",
		gulp.parallel(
			"sass",
			"js",
			"pug",
			"svgSpriteBuild",
			"imageCompress",
			"vendors"
		),
		"pageList",
		"browserSync"
	)
);

gulp.task(
	"build",
	gulp.series(
		"clean",
		gulp.parallel(
			"sass",
			"js",
			"pug",
			"svgSpriteBuild",
			"imageCompress",
			"vendors"
		),
		"pageList",
		"deploy",
		"open"
	)
);

gulp.task("default", gulp.series("watch"));
