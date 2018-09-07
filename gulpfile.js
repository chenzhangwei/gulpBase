var gulp = require('gulp');

var clean = require('gulp-clean');

var runSequence = require('run-sequence');

//获取gulp-concat模块(用于合并文件)
var concat = require('gulp-concat');

//获取gulp-jshint(语法检查)
var jshint = require('gulp-jshint');

//获取gulp-uglify组件(用于压缩JS)
var uglify = require('gulp-uglify');

//获取minify-css模块(用于压缩CSS)
var minifyCSS = require('gulp-minify-css');

//获取gulp-imagemin模块
var imagemin = require('gulp-imagemin');


//获取gulp-sass模块,不依赖ruby环境
var sass = require('gulp-sass');

//获取gulp-minify-html模块
var minifyHtml = require('gulp-minify-html');

//获取gulp-autoprefixer模块
var autoprefixer = require('gulp-autoprefixer');

//var watchPath=require('gulp-watch-path');

//获取gulp-rename
var rename = require('gulp-rename');

//本地服务
var connect = require('gulp-connect');

//清空dist
gulp.task('clean', function () {
    return gulp.src('dist', { read: false })
        .pipe(clean())
});

// 语法检查
gulp.task('jshint', function () {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
})

//压缩js文件
gulp.task('script', function () {
    gulp.src('src/js/*.js')
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
});

//文件合并
gulp.task('concat', function () {
    gulp.src('src/js/*.js')  //要合并的文件
        .pipe(concat('all.js'))  // 合并匹配到的js文件并命名为 "all.js"
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

//创建压缩图片任务
gulp.task('images', function () {
    //1.找到图片
    gulp.src('src/assets/images/*.*')
        //2.压缩图片
        .pipe(imagemin({
            progressive: true
        }))
        //3.另存压缩后图片
        .pipe(gulp.dest('dist/assets/images'))
});

//复制assets 到dist
gulp.task('copyAssets', ['images'],function(){
    gulp.src('src/assets/*/*.*')
        .pipe(gulp.dest('dist/assets'))
        .pipe(connect.reload());
});


gulp.task('index', function () {
    gulp.src(['src/*.html']) // 要压缩的html文件
        .pipe(minifyHtml()) //压缩
        .pipe(gulp.dest('dist/'));
});

//压缩HTML文件
gulp.task('html', ['index'], function () {
    gulp.src(['src/html/**/*.html']) // 要压缩的html文件
        .pipe(minifyHtml()) //压缩
        .pipe(gulp.dest('dist/html'))
        .pipe(connect.reload());
});

//编译sass
gulp.task('sass', function () {
    gulp.src('src/css/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))
        .pipe(autoprefixer())
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});


gulp.task('myServer', function () {
    connect.server({
        root: 'dist',
        port: 9090,
        livereload: true
    });
});

//创建压缩css任务
// gulp.task('css', function () {
//     //1.找到文件
//     gulp.src('src/css/*.css')
//         //2.压缩文件
//         .pipe(minifyCSS())
//         //3.另存为压缩文件
//         .pipe(gulp.dest('dist/css'))
//         //4.压缩后的文件重命名为：xx.min.css
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(autoprefixer())
//         .pipe(minifyCSS())
//         .pipe(gulp.dest('dist/css'))
// });


//autoprefixer,自动补全css3前缀
// gulp.task('autoprefixer', function () {
//     return gulp.src('src/css/*.css')
//         .pipe(autoprefixer())
//         .pipe(gulp.dest('dist/css'))
// })

gulp.task('watch', function () {
    gulp.watch('src/js/**/*.js', ['jshint', 'script', 'concat']);
    gulp.watch('src/css/**/*.scss', ['sass', 'css', 'autoprefixer']);
    gulp.watch('src/css/**/*.css', ['css', 'autoprefixer']);
    gulp.watch(['src/html/**/*.html','src/*.html'], ['html']);
    gulp.watch('src/assets/**/*.*', ['copyAssets']);
});

//使用gulp.task('default') 定义默认任务,即:输入 gulp script 指令时默认启动该任务
//在命令行使用 gulp 启动 script 任务 和 auto 任务
//停止自动任务：Ctrl + C
//多任务执行 gulp +回车
 
// gulp.task('default', ['clean','jshint','copyAssets','autoprefixer','script','css','html','images','sass','watch']);

//开发构建
gulp.task('default', function (done) {
    condition = false;
    runSequence(   
        ['clean'],//清理dist
        ['jshint'],//js代码检查
        ['script'],//压缩js
        ['html'],//压缩html
        ['copyAssets'],
        ['sass'],//编译sass并压缩
        ['myServer'],
        ['watch'],
        done);

});
