const color = require('./color');

const message = ' hello world';

for (let key in color) {
    if (color.hasOwnProperty(key)) {
        console.log(color[key](key.toUpperCase() + ':  ' + message));
        console.log('\n')
    }
}

console.log(color.yellowBG(color.cyan('combine color cyan and yellow background')));
