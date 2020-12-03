// =========================================================
// Gulp Task: sass
// =========================================================

let path = require("../settings/path.json");
module.exports = (gulp, plugins, browserSync) => {
	return async () => {
		let input = "";
		let errorHandler = plugins.notify.onError("<%= error.message %>");

		return Promise.all([
			new Promise((resolve, reject) => {
				gulp.src(path.src.css)
					.pipe(plugins.sassGlob())
					.pipe(
						plugins.plumber({
							errorHandler,
						})
					)
					.pipe(plugins.sass())
					.pipe(
						plugins.replace(/[^{]*\{([^}]*)*}/g, (match) => {
							let replaced = match;
							var count = (replaced.match(/{/g) || []).length;
							var position =
								count == 1 ? 0 : replaced.indexOf("{") + 1;
							var position_char = replaced.indexOf("{", position);

							if (
								replaced.includes("url") &&
								(replaced.includes("background") ||
									replaced.includes("background-image"))
							) {
								let selector = replaced
									.substring(0, position_char)
									.replace(/}/g, "")
									.trim();

								let bg = replaced
									.match(
										/\b(?:background\s*?([^;>]*?)(?=[;">}]);)/g
									)
									.join(" ")
									.replace("/img/", "/app/img/");

								let webpImage = bg.indexOf('svg') !== -1 ? bg : bg.replace(
									/(gif|jpg|jpeg|tiff|png)/g,
									"webp"
								);
								

								// console.log("--------------------------------------------------", replaced)
								// console.log(replaced, `image: ${webpImage}`)

								if (count == 1) {

									
									if (!webpImage.includes("svg")){

										input +=
											".ws " +
											selector +
											"{" +
											webpImage +
											"} .wn " +
											selector +
											"{" +
											bg +
											"}";											
									}else{
										input +=
											selector +
											"{" +
											webpImage +
											"}";
									}

								} else {
									
									var media = replaced
										.substring(0, replaced.indexOf("{"))
										.replace(/}/g, "")
										.trim();

									var subselect = selector.substring(
										position,
										selector.length
									);

									if (!webpImage.includes("svg")){
										input += `${media} { .ws ${subselect} {${webpImage}} .wn ${subselect} {${bg}} }`;
									}else{
										input += `${media} { ${subselect} {${webpImage}} }`;
									}		
								}
							}

							return input;
						})
					)
					.on("error", reject)
					.pipe(gulp.dest(path.build.css))
					.on("end", resolve);
			}),
		]).then(() => {
			return gulp
				.src(path.src.css)
				.pipe(plugins.sassGlob())
				.pipe(plugins.plumber({}))
				.pipe(plugins.sass())
				.pipe(
					plugins.replace(/[^{]*\{([^}]*)*}/g, (match) => {
						let replaced = match;

						if (
							replaced.includes("url") &&
							(replaced.includes("background") ||
								replaced.includes("background-image"))
						) {
							let newreplaced = replaced.replace(
								/\b(?:background\s*?([^;>]*?)(?=[;">}]);)/g,
								""
							);
							replaced = newreplaced;
						}

						return replaced;
					})
				)
				.pipe(plugins.injectString.append(input))
				.pipe(
					plugins.autoprefixer(["last 2 versions", "> 1%", "ie 8"], {
						cascade: true,
					})
				)
				.pipe(plugins.cssmin())
				.pipe(gulp.dest(path.build.css))
				.pipe(browserSync.stream());
		});
	};
};
