# Guide for Node.js Server
- [Guide for Node.js Server](#guide-for-nodejs-server)
  - [TL; DR](#tl-dr)
  - [Resume API Credentials](#resume-api-credentials)
    - [Place credentials file](#place-credentials-file)
    - [Pass credentials as environmental variables](#pass-credentials-as-environmental-variables)
  - [Start Resume Socket.IO Server](#start-resume-socketio-server)
    - [Standalone](#standalone)
    - [Attaching to existing HTTP server](#attaching-to-existing-http-server)
    - [Attaching to existing Socket.IO](#attaching-to-existing-socketio)
      - [Automatic binding](#automatic-binding)
      - [Manual callback binding by SIOOnConnection](#manual-callback-binding-by-sioonconnection)
  - [Run Across Multiple clusters or Behind reverse proxy](#run-across-multiple-clusters-or-behind-reverse-proxy)
  - [More Information](#more-information)

## TL; DR

Resume Socket.IO consists of Resume API Client for Node.JS and Socket.IO


## Resume API Credentials
For Resume API authenication
### Place credentials file
You can place `credentials.js` file from **Resume Administration System** in server root folder. The `config.js` of `Resume REST API Connector` will parse it when server starts.  
<br>
Example content in `credentials.js
```JSON
{
  "host": "https://resume.sati.co.th",
  "username": "USERNAME",
  "password": "PASSWORD",
  "section_id_default": 0
}
```
<br>

### Pass credentials as environmental variables
You can also specified Authenication information for Resume API via environmental variable. This method suits for Docker Container development. Please see [Environment variables in Compose](https://docs.docker.com/compose/environment-variables/) for more details.  
<br>
Example of `docker-compose.yaml` for Resume Socket.IO container. 

```yaml
version: "3.4"

services:
  resume-demo:
    # ...

    environment:
      REST_HOST: https://resume.sati.co.th
      REST_USER: USERNAME
      REST_PW: PASSWORD
    
    # ...

```
  
<br>  

You can also place these secret in [&quot;.env&quot; file](https://docs.docker.com/compose/environment-variables/#the-env-file) as Docker suggestion.
<br>  
Example of `.env` for Resume Socket.IO container.  

```ENV
REST_HOST=https://resume.sati.co.th
REST_USER=USERNAME
REST_PW=PASSWORD
REST_DEFAULT_SECTION=0
REST_LANG=["th","en"]
```

<br>  

## Start Resume Socket.IO Server

### Standalone

The function `BindSIO` automatically create and return [`Socket.IO Server`](https://socket.io/docs/v4/server-initialization/#Standalone) object.
```JS
var io = require('resume-client-socket.io').BindSIO(/* optionBindSIO, optionSIO */);

io.listen(/* your Socket.IO port */);

```

You can also pass Socket.IO port as [`optionBindSIO.port`](Resume-Socket-IO-Server.md#new_module_Resume-Socket-IO-Server..OptionBindSIO_new).  

```JS
var io = require('resume-client-socket.io').BindSIO(
    { port: 80 /* other optionBindSIO options here */ }
    /*, your optionSIO */
);
```
  
<br>  

### Attaching to existing HTTP server

Resume Socket.IO Server supports [Node&apos;s HTTP, HTTPS, or HTTP/2 server](https://socket.io/docs/v4/server-initialization/#Attached-to-an-existing-HTTP-server) and web server packages like [Express](https://socket.io/docs/v4/server-initialization/#With-Express) or [Kao](https://socket.io/docs/v4/server-initialization/#With-Koa) as Socket.IO can support.  

```JS
const httpServer = require("http").createServer();
const { BindSIO } = require('resume-client-socket.io');

/* ... */

var io = BindSIO(
    {
        server: httpServer
        /* other optionBindSIO options here */
    }
    /*, your optionSIO */
);

/* ... */

httpServer.listen(3000);
```
[Socket.IO Server Documentation](https://socket.io/docs/v4/server-initialization/#Attached-to-an-existing-HTTP-server)

  
<br>

### Attaching to existing Socket.IO

#### Automatic binding
Resume will bind as [`.on('connection')`](https://socket.io/docs/v4/server-api/#Event-connection) event callback and return your [`Socket.IO Server`](https://socket.io/docs/v4/server-api/#Server) object.  

```JS
// Existing Socket.IO Server
const io = require("socket.io")(/* httpServer, options */);

/* ... */

require('resume-client-socket.io').BindSIO(
    {
        io: io
        /* other optionBindSIO options here */
    }
    /*, your optionSIO */
);
```
  

#### Manual callback binding by SIOOnConnection
You can call [`SIOOnConnection(socket)`](Resume-Socket-IO-Server.md#module_Resume-Socket-IO-Server..SIOOnConnection) in [`.on('connection')`](https://socket.io/docs/v4/server-api/#Event-connection) callback.  

```JS
// Your existing Socket.IO Server
const io = require("socket.io")(/* httpServer, options */);
const { SIOOnConnection } = require('resume-client-socket.io');

/* ... */

io.on("connection", socket => {
    /* ... */
    SIOOnConnection(/* optionSIO */);

    /* ... */
});
```


<br>

## Run Across Multiple clusters or Behind reverse proxy

Please Create Socket.IO Server object, then [attach Resume](#attaching-to-existing-socketio), and follow these documentations.
- [Attach Resume to existing Socket.IO](#attaching-to-existing-socketio)
- [Behind a reverse proxy](https://socket.io/docs/v4/reverse-proxy/)
- [Usage with PM2](https://socket.io/docs/v4/pm2/)
- [Using multiple nodes](https://socket.io/docs/v4/using-multiple-nodes/)
- [Socket.IO Adapter](https://socket.io/docs/v4/adapter/)


For example, run [PM2](https://socket.io/docs/v4/pm2/) with [Redis Adapter](https://socket.io/docs/v4/redis-adapter/)
```JS
// Use Redis Adapter      https://socket.io/docs/v4/redis-adapter/
// insted of Cluster Adapter in Socket.IO guide         https://socket.io/docs/v4/pm2/
// sio.adapter(require("@socket.io/cluster-adapter").createAdapter()); // Not used this

/* Connect to Redis */
const pubClient = require('redis').createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PW
});

pubClient.on('error', function (err) {
    console.error('Could not establish a connection with Redis for Socket.IO session ' + err);
    throw err;
});

pubClient.on('connect', function () {
    console.log('Connected to redis successfully');
});

const subClient = pubClient.duplicate();

/* Apply Redis Adapter */
io.adapter(require('@socket.io/redis-adapter').createAdapter(pubClient, subClient));

/* Apply PM2 session stickyness */
require("@socket.io/sticky").setupWorker(io);
```
<br>

## More Information
 - [Read me file](../README.md)
 - [Quick Start Guide for Server-sided Node.JS](node.guide.md)
 - [Quick Start Guide for Client-sided Resume.js](js.guide.md)
 - [Resume Socket.IO Server](Resume-Socket-IO-Server.md)
 - [Client-sided Resume.js](Resume.js.md)

&copy; 2021 - copyright by Tanapat Kahabodeekanokkul - the founder of [Resume](https://sati.co.th).
