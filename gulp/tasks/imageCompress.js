// =========================================================
// Gulp Task: imageCompress
// =========================================================

let path = require('../settings/path.json'),
	imgmin = require('imagemin'),
	imageminJpegRecompress = require('imagemin-jpeg-recompress'),
	// imageminJpeg = require('imagemin-jpegtran'),
	imageminPng = require('imagemin-pngquant'),
	imageminWebp = require('imagemin-webp');


module.exports = (gulp, plugins) => {

    return async () => {

		imgmin([path.src.img, "src/img/*.svg"], {
			destination: path.build.img,
			plugins: [
	            /*imageminJpeg({
	                progressive: true
	            }),*/
                imageminJpegRecompress({
                    progressive: true,
                    quality: "hight"
                }),
                imageminPng({
                    quality: [0.7, 1]
                })
			]
		}).then((e) => {
			imgmin([path.src.img], {
				destination: path.build.img,
				plugins: [
	                imageminWebp({
	                    quality: 70
	                })
				]
			})
		});

    };
};