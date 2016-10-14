/**
 * 入口文件，运行时输入，获取输入，然后输入翻译。
 */
const readline = require('readline');
const http = require('http');
const color = require('../color/color');

const URL = 'http://fanyi.youdao.com/openapi.do?type=data&doctype=json&version=1.1&keyfrom=tuicool&key=974115503&translate=on&q=';

/**
 * 格式化输出一个对象，其格式形如：
 * {
    "translation": [
        "输入"
    ],
    "basic": {
        "us-phonetic": "'ɪn'pʊt",
        "phonetic": "'ɪnpʊt",
        "uk-phonetic": "'ɪnpʊt",
        "explains": [
            "n. 投入；输入电路",
            "vt. [自][电子] 输入；将…输入电脑"
        ]
    },
    "query": "input",
    "errorCode": 0,
    "web": [
        {
            "value": [
                "输入",
                "投入",
                "输入框"
            ],
            "key": "Input"
        }
    ]
   }
 * @param obj
 */
function format (obj) {
    !obj.basic && (obj.basic = {explains: [], phonetic: ''});
    console.log(`${color.red(obj.query)} ${obj.basic.phonetic && color.blue('['+obj.basic.phonetic+']')}`);

    for(let explain of obj.basic.explains) {
        console.log(color.black(explain));
    }

    if (obj.web) {
        console.log(color.grey('-------网络翻译------'));
        for (let item of obj.web) {
            console.log(`${color.cyan(item.key)}: ${color.italic(item.value.join(' | '))}`);
        }
    }
    else if (obj.translation) {
        console.log(color.grey('-------翻译------'));
        console.log(`${color.blue(obj.translation.join('  '))}`);
    }
}

function request (word, callback) {
    let req = http.request(URL + encodeURIComponent(word) + '&ts=' + (+new Date()), (res) => {
        if (res.statusCode === 200) {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                let data = JSON.parse(chunk);
                if (data.errorCode === 0) {
                    format(JSON.parse(chunk));
                }
            });
        }
        else {
            console.log(color.red('请求失败'));
        }

        res.on('end', () => {
            callback();
        });
    });

    req.on('error', (e) => {
        console.log(color.red(`problem with request: ${e.message}`));
    });

    req.end();
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.setPrompt('$$$ ');
rl.prompt();
rl.on('line', (input) => {
    request(input, () => {
        rl.prompt();
    });
});

rl.on('SIGINT', () => {
    console.log('see you');
    rl.close();
    process.exit(0);
});