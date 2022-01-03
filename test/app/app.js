'use strict';
const express = require('express');
const app = express();


var server,
    port = process.env.PORT,
    HTTP = ((process.env.HTTP) && (process.env.HTTP != 0)),
    NODE_ENV = (process.env.NODE_ENV || 'production'),
    PUBLIC_DEMO = (process.env.PUBLIC_DEMO && (process.env.PUBLIC_DEMO != 0));

console.log('PORT: ' + port);
console.log('NODE_ENV: ' + NODE_ENV + ' // is production = ' + (NODE_ENV == "production"));
console.log('HTTP: ' + HTTP);
console.log('Will use HTTPS:' + (!HTTP));

if (PUBLIC_DEMO) {
    const session = require('express-session')
    app.set('view engine', 'ejs');
    // this allows you to render .html files as templates in addition to .ejs
    app.engine('html', require('ejs').renderFile);
    let sess = {
        secret: new Date().toISOString(),
        cookie: {}
    };

    if (NODE_ENV == 'production') {
        if (HTTP)
            console.log('Warning! production mode should run on HTTPS, otherwise, via HTTPS load balancer.')
        app.set('trust proxy', 1) // trust first proxy
        sess.cookie.secure = true // serve secure cookies
    }
    app.use(session(sess));
    app.use(express.json());       // to support JSON-encoded bodies
    app.use(express.urlencoded()); // to support URL-encoded bodies

    //const { SimpleUser } = require('./user');
    //const user = new SimpleUser();

    app.use(function (req, res, next) {
        if (req.path.startsWith('/login')) {
            if (req.session && req.session.username) {
                res.redirect('/');
                return;
            }
        } else if (req.path.startsWith('/logout')) {
            if (req.session) {
                req.session.destroy();
            }
            res.redirect('/login?msg=Log+out+success');
            return;
        } else {
            if (!req.session || !req.session.username) {
                res.redirect('/login?msg=Please+log+in');
                return;
            }
            //res.redirect('/login?msg=Please+log+in');
        }
        next();
    });

    app.get('/login(|.htm|.html)', function (req, res) {
        res.render(__dirname + '/public/login.html', { msg: req.query.msg || null });
    });
    app.post('/login(|.htm|.html)', function (req, res) {
        // if (user.login(req.body.username, req.body.password)) {
        //     req.session.username = req.body.username;
        //     res.redirect('/');
        //     return;
        // }
        res.render(__dirname + '/public/login.html', { msg: 'No username or password!' });
    });
}

if (HTTP) {
    const http = require('http');
    server = http.createServer(app);
    port = port || 80;

} else {
    const https_options = {
        key: fs.readFileSync(fs.existsSync('cerbot/privkey.pem') ? 'cerbot/privkey.pem' : "key.pem"),
        cert: fs.readFileSync(fs.existsSync('cerbot/cert.pem') ? 'cerbot/cert.pem' : "cert.pem")
    };

    const https = require('https');
    server = https.createServer(https_options, app);
    port = port || 443;
}




/* Routing */
app.use(express.static('public'));
app.use(RECORDING_PATH, express.static('recordings'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});



// CLI stuffs
const colours = { reset: "[0m", bright: "[1m", dim: "[2m", underscore: "[4m", blink: "[5m", reverse: "[7m", hidden: "[8m", fg: { black: "[30m", red: "[31m", green: "[32m", yellow: "[33m", blue: "[34m", magenta: "[35m", cyan: "[36m", white: "[37m", crimson: "[38m" }, bg: { black: "[40m", red: "[41m", green: "[42m", yellow: "[43m", blue: "[44m", magenta: "[45m", cyan: "[46m", white: "[47m", crimson: "[48m" } };

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('Server Command> ');
rl.prompt();
rl.on('line', function (line) {
    switch (line) {
        case 'panic':
            oh_my_gosh();
            break;
        default:
            console.log('Unknown command: ', line);
    }

    rl.prompt();
});

// Fail-proof server uncaught exception

process.on('uncaughtException', (error) => {
    console.error('Node panic => ' + error.stack);
    console.log('Attempting to restart...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('exiting…');
    process.exit();
});

process.on('exit', () => {
    console.log('exiting…');
    process.exit();
});


/////////////////////////////////////


server.listen(port, () => {
    console.log(`listening ${port}`);
});