const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const querystring = require('querystring');
const spawnSync = require('child_process').spawnSync;

http.createServer((req, res) => {
    let urlData = url.parse(req.url);
    let queryObj = querystring.parse(urlData.query);
    if (queryObj.title && queryObj.url) {
        addBookmark(queryObj).then(() => {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({
                code: 0,
                msg : 'success'
            }));
        }).catch((err) => {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({
                code: 500,
                msg : err
            }));
        });
    }
    else {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({
            code: 0,
            msg : 'title & url required'
        }));
    }

}).listen(8180);

function addBookmark(obj) {
    let fileName = path.resolve(__dirname, './bookmark.md');
    let data = [];
    let inserted = false;
    const date = new Date();

    const rl = readline.createInterface({
        input: fs.createReadStream(fileName)
    });

    return new Promise((resolve, reject) => {
        rl.on('line', (line) => {
            if (!inserted && line.startsWith('###')) {

                let date_str = line.match(/\d{4}-\d{1,2}-\d{1,2}/)[0];
                if (date_str && (new Date(date_str).getDate() === date.getDate())) {
                    data.push(line);
                    data.push(`+ [${obj.title}](${obj.url})<br />`);
                }
                else {
                    data.push(`### ${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}<br />`)
                    data.push(`+ [${obj.title}](${obj.url})<br />\n`);
                    data.push(line);
                }
                inserted = true;
            }
            else {
                data.push(line);
            }
        });
        rl.on('close', () => {
            if (!inserted) { //新建的文件
                data.push(`### ${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}<br />`)
                data.push(`+ [${obj.title}](${obj.url})<br />\n`);
            }
            fs.writeFile(fileName, data.join('\n'), (err) => {
                if (err){
                    console.error(err);
                    reject(err);
                }
                console.log('saved ' + fileName);
                resolve();
                syncToGithub(obj.title);
            });
        });
    });
}

function syncToGithub(title) {
    var cmds = [
        ['git', ['add', '.']],
        ['git', ['commit', '-am', `"add ${title || ''}"`]],
        ['git', ['pull', '--rebase']],
        ['git', ['push', 'origin', 'master']]
    ];
    cmds.forEach((cmd) => {
        let result = spawnSync(cmd[0], cmd[1]);
        console.log(result.output.join('\n'));
    });
}