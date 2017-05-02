const gulp = require('gulp');
const babel = require('gulp-babel');

srcPath = './src';
distPath = './dist';


gulp.task('default', [ 'build', 'watch' ]);

gulp.task('build', () => {
    return gulp.src(srcPath + '/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(distPath));
});

gulp.task('watch', () => {
    gulp.watch('lib/**/*.js', ['default']);
});