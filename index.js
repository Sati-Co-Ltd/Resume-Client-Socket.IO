/**
 * @module Resume-Socket-IO-Server
 */

/**
 * @file Resume-Socket-IO-Server.js - Server-sided Node.JS for Resume API and Socket.IO Server management
 * @author Tanapat Kahabodeekanokkul
 * @copyright Tanapat Kahabodeekanokkul 2021
 * @license Tanapat-Kahabodeekanokkul
 */

const path = require('path');
const pino = require('pino');


const colours = { reset: "[0m", bright: "[1m", dim: "[2m", underscore: "[4m", blink: "[5m", reverse: "[7m", hidden: "[8m", fg: { black: "[30m", red: "[31m", green: "[32m", yellow: "[33m", blue: "[34m", magenta: "[35m", cyan: "[36m", white: "[37m", crimson: "[38m" }, bg: { black: "[40m", red: "[41m", green: "[42m", yellow: "[43m", blue: "[44m", magenta: "[45m", cyan: "[46m", white: "[47m", crimson: "[48m" } };
const
    EVENT_CLIENT_INIT = 'press-record',
    EVENT_SERVER_SESSION_ID = 'sess-id',
    STREAM_ERROR = 'stream-error';
const
    SS_AUDIO_STREAM = 'client-streaming',
    SS_RESP_TRNSCR = 'server-transcript';
const UPDATE_INTERVAL = 5000;

/**
 * The parameters of new session id event
 * @typedef ParamSessionID
 * @type {Object}
 * @property {socket.io~Socket} socket Socket.IO from io.on("connection", (socket) => {   });
 * @property {string} [sessionID] Resume SessionID
 * @property {string} [pseudoIdentifier] fake (pseudo) identifier generated by Resume REST API Client and sent to server
 * @property {*} identifier the object of identification data of patients given from ResumeOne().newSession(...) - (Transaction number, Visit number, Admission number, Hospital number) and healthcare workers (for researching or other purposes of each organization). This data will store (in local not sent outside private network.
 * @property {(int|string)} sectionId ID of section e.g. department number, section of organization name, given from ResumeOne().newSession(...)
 * @property {string[]} lang language hints given from ResumeOne().newSession(...) must be BCP-47 language code in string type or array of string type ordered by highest priority to suggest the speech-to-text API - the default is located in ./public/lang.json . See more detail of [BCP-47](https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers)
 * @property {string} docFormat Format of document given from ResumeOne().newSession(...) to let the speech-to-text API to generate returned data - reference the name from "C-CDA 1.1.0 on FHIR" otherwise will be "Default". Please read [README.md](../README.md) and http://hl7.org/fhir/us/ccda/artifacts.html
 * @property {Boolean} multiSpeaker mode of transcription automatically given from ResumeOne().newSession(...)
 * @property {Date} userStartTime session starting datetime automatically given from ResumeOne().newSession(...)
 */

/**
 * The Socket.IO SIOOnConnection callback
 * @callback socketSIOOnConnection
 * @param {socket.io~Socket} socket Socket.IO socket parameter from io.on("connection", (socket) => {   });
 */

/**
 * The function called on new Session to check the Resume Session
 * @function newResumeSessionSyncCheck
 * @param {ParamSessionID} socket Socket.IO socket parameter from io.on("connection", (socket) => {   });
 * @returns {Boolean} return true if Socket Session connnection is Valid
 */

/**
 * The Resume Session SIOOnConnection callback
 * @callback sessionSIOOnConnection
 * @param {ParamSessionID} paramSessionID ParamSessionID
 */

/**
 * The callback Resume API response that the session ended
 * @callback receivedEndTranscriptSessionCallback
 * @param {socket.io~Socket} socket Socket.IO socket parameter from io.on("connection", (socket) => {   });
 * @param {string} sessionID Resume SessionID
 * @param {(int|string)} sectionId ID of section e.g. department number, section of organization name, given from ResumeOne().newSession(...)
 * @param {resume-node-rest-connector~Transcript} transcript Transcript response of sent sound from Resume API
 */
/**
 * The callback Resume API response that the session ended
 * @callback endTranscriptSessionCallback
 * @param {Socket} socket Socket.IO socket parameter from io.on("connection", (socket) => {   });
 * @param {string} sessionID Resume SessionID
 * @param {(int|string)} sectionId ID of section e.g. department number, section of organization name, given from ResumeOne().newSession(...)
 * @param {resume-node-rest-connector~ResumeSoundInfo} info Information from Resume.js client to sent to Resume API
 */
//(socket, sessionId, sectionID, data)

/**
 * The callback when Resume Received sound chunk
 * @callback receivedSoundCallback
 * @param {Socket} socket Socket.IO socket parameter from io.on("connection", (socket) => {   });
 * @param {string} sessionID Resume SessionID
 * @param {(int|string)} sectionId ID of section e.g. department number, section of organization name, given from ResumeOne().newSession(...)
 * @param {Blob} [blob] Blob object of sound chunk from Resume.js
 * @param {resume-node-rest-connector~ResumeSoundInfo} info Information from Resume.js client to sent to Resume API
 */
//(socket, sessionId, sectionID, blob, info);

/**
 * OptionSIO class is the optional template for SIOOnConnection function
 * @class OptionSIO
 * @param {resume-node-rest-connector~HttpClient} [resumeApiClient] Resume API Client object
 * @param {socketSIOOnConnection} [onConnectionCallback] Callback when Socket.io on('connection')
 * @param {socketSIOOnConnection} [onDisconnectCallback] Callback when Socket.io on('disconnection')
 * @param {newResumeSessionSyncCheck} [onNewTranscriptSessionSyncCheck] function called when client request for new Resume Session to check the the session before send to Resume API - return true if valid
 * @param {sessionSIOOnConnection} [onNewTranscriptSessionCallback] Callback when request for new Resume Session pass the onNewTranscriptSessionSyncCheck validation
 * @param {sessionSIOOnConnection} [onReceivedTranscriptionSessionID] Callback when API response new Resume Session ID
 * @param {endTranscriptSessionCallback} [onEndTranscriptSessionCallback] Callback when Resume.js client end the Resume session
 * @param {receivedEndTranscriptSessionCallback} [onReceivedEndTranscriptSessionCallback] Callback Resume API response that the session ended
 * @param {receivedSoundCallback} [onReceivedSoundCallback] Callback when Resume Received sound chunk
 * @param {object} [log] inherited properties to child logger
 */
class OptionSIO {
    resumeApiClient
    // HttpClient  plan support WebSocket in future
    onConnectionCallback
    onDisconnectCallback
    onNewTranscriptSessionSyncCheck
    onNewTranscriptSessionCallback
    onReceivedTranscriptionSessionID
    onEndTranscriptSessionCallback
    onReceivedEndTranscriptSessionCallback
    onReceivedSoundCallback

    log
}

/**
 * OptionBindSIO class is the optional template for BindSIO function
 * @class OptionBindSIO
 * @param {(http|https|http2)} [server] HTTP, HTTPS, or HTTP/2 server object
 * @param {socket.io~Server} [io] Socket.IO Server object  - const io = require("socket.io")();
 * @param {string} [nameSpace] optional namespace for Socket.IO
 * @param {object} [ioOptions] option for create Socket.IO server if io is undefined.
 * @param {int} [port] port for create Socket.IO server if io is undefined.
 * @param {object} [log] inherited properties to child logger
 */
class OptionBindSIO {
    server
    io
    nameSpace
    ioOptions

    port
    log
}

/** 
 * Bind Resume Server-sided script to Socket.IO as optionBindSIO.nameSpace or root. If optionBindSIO.io is defined the function binds to io directly. Else if optionBindSIO.server is given, the function creates Socket.IO server and attaches to the server. Else, the function creates Socket.IO by given ports or optionBindSIO.ioOptions.
 * @summary Bind Resume Server-sided script to Socket.IO as optionBindSIO.nameSpace or root. 
 * @param {OptionBindSIO} optionBindSIO Option for server binding
 * @param {OptionSIO} optionSIO option for Resume server-sided script.
 * @returns {socket.io~Server} Socket.IO Server object
 */
function BindSIO(optionBindSIO, optionSIO) {
    if (!optionBindSIO) {
        optionBindSIO = true;
    }

    let logger = pino(pino.destination({ sync: false }))
        .child(((optionBindSIO.log) ? optionBindSIO.log : {}));


    let io = optionBindSIO.io;
    if (!(optionBindSIO.server || io)) {
        // Neither server nor socket io
        // Create standalone socket io
        if (typeof optionBindSIO.port == "number") {
            logger.info({
                port: optionBindSIO.port,
                ioOptions: optionBindSIO.ioOptions
            },
                'BindSIO: create Socket.IO server');
            io = require("socket.io")(optionBindSIO.port, optionBindSIO.ioOptions);
        } else {
            logger.info({
                ioOptions: optionBindSIO.ioOptions
            },
                'BindSIO: create Socket.IO server');
            io = require("socket.io")(optionBindSIO.ioOptions);
        }
    } else if (!io) {
        // Give server but not IO
        logger.info({
            ioOptions: optionBindSIO.ioOptions
        },
            'BindSIO: bind Socket.IO to server');
        io = require("socket.io")(optionBindSIO.server, optionBindSIO.ioOptions);
    }

    // Bind function on Connection
    if (optionBindSIO.nameSpace) {
        // User specify nameSpace in option
        logger.info({
            optionSIO: optionSIO,
            nameSpace: optionBindSIO.nameSpace
        },
            'BindSIO: use SIOOnConnection in namespace on connection');

        io.of(optionBindSIO.nameSpace).on('connection', SIOOnConnection(optionSIO));
    } else {
        logger.info({
            optionSIO: optionSIO
        },
            'BindSIO: use SIOOnConnection on connection');

        io.on('connection', SIOOnConnection(optionSIO));
    }
    return io;
}
/** 
 * Get path of static JavaScript Directory of Resume.js and its dependencies
 * @return {string} path to static JavaScript files
 */
function staticJsDir() {
    return path.resolve(__dirname, 'public/js')
}

/** 
 * Get array of path of static JavaScript files of Resume.js and its dependencies
 * @return {string[]} array of path of static files in JavaScript directory
 */
function staticJsFiles() {
    return require('fs').readdirSync(staticJsDir()).map((val) => {
        return path.resolve(__dirname, 'public/js', val);
    });

}

/**
 * @callback SIOOnConnectionFunction
 * @param {Socket} socket Socket.IO socket object
 */

/** 
 * Generate Resume Server-sided Callback for io.on('connection')
 * @param {OptionSIO} optionSIO option for Resume server-sided script.
 * @returns {SIOOnConnectionFunction} function for  io.on('connection')
 */
function SIOOnConnection(optionSIO) {
    if (!optionSIO)
        optionSIO = false;

    let restClient = optionSIO.resumeApiClient;
    if (!restClient) {
        restClient = new (require('resume-node-rest-connector').HttpClient)();
    }
    return function (socket) {
        var CLIENT_CONNECTED = true;
        var update_timer = null;
        var _last_update = 0;

        // sioCheckTime(socket);
        if (optionSIO.onConnectionCallback && ((typeof optionSIO.onConnectionCallback) == 'function'))
            optionSIO.onConnectionCallback(socket);

        function updateTimeout(sessionId, sectionID, last_update, cookies) {
            if (CLIENT_CONNECTED)
                update_timer = setTimeout(updateResult, UPDATE_INTERVAL, sessionId, sectionID, last_update || _last_update, cookies);
        }
        function serverResponse(sessionId, sectionID, cookies, data, is_end) {
            if (CLIENT_CONNECTED) {
                console.log('Received data:', JSON.stringify(data));
                socket.emit(SS_RESP_TRNSCR, data, data.is_end);
                _last_update = data.update || (Date.now() / 1000);
                if (!(data.is_end || is_end)) {
                    updateTimeout(sessionId, sectionID, _last_update, cookies);

                    if (restClient.onApiPushResult && (sessionId in restClient.onApiPushResult))
                        // Remove callback
                        delete restClient.onApiPushResult[res.data.session_id];

                }
            }
            else {
                console.log('REST API send message, but client closed:', JSON.stringify(data));
            }
        }
        function emitErr(sessionId, sectionID, err) {
            socket.emit(STREAM_ERROR, sessionId, sectionID, err.message);
            console.error(err);
            console.log(colours.fg.red, err, colours.reset);
        }
        function serverErr(sessionId, sectionID, lastUpdate, cookies, err) {
            try {
                emitErr(sessionId, sectionID, err);
                if (!update_timer && sessionId)
                    updateTimeout(sessionId, sectionID, lastUpdate, cookies);

            } catch (e) {
                console.log(err);
                console.log(e);
            }
        }

        function updateResult(sessionId, sectionID, lastUpdate, cookies) {
            lastUpdate = lastUpdate || _last_update;
            restClient.updateResult(sessionId, sectionID, lastUpdate, cookies)
                .then(function (data) {
                    if (data) {
                        serverResponse(sessionId, sectionID, cookies, data);
                    } else {
                        updateTimeout(sessionId, sectionID, _last_update, cookies);
                    }
                }).catch(err => serverErr(sessionId, sectionID, lastUpdate, cookies, err));
        }
        function updateClear() {
            if (update_timer) {
                clearTimeout(update_timer);
                update_timer = null;
            }
        }

        console.log(colours.fg.green, 'Client connected ' + new Date(), socket.request.connection._peername.address, colours.reset);
        restClient.test();


        socket.on('disconnect', () => {
            updateClear();
            // sioStopCountDown(socket);
            console.log(colours.fg.red, 'disconnected', socket.request.connection._peername.address, colours.reset);
            CLIENT_CONNECTED = false;

            if (optionSIO.onDisconnectCallback && ((typeof optionSIO.onDisconnectCallback) == 'function'))
                optionSIO.onDisconnectCallback(socket);
        });

        /**
         * When Client requests for session_id from REST API
         */
        socket.on(EVENT_CLIENT_INIT, (sectionId, lang, hint, docFormat, multiSpeaker, identifier, userStartTime, retryCallback) => {
            if (optionSIO.onNewTranscriptSessionSyncCheck && ((typeof optionSIO.onNewTranscriptSessionSyncCheck) == 'function'))
                if (!optionSIO.onNewTranscriptSessionSyncCheck({
                    socket: socket,
                    identifier: identifier,
                    sectionId: sectionId,
                    lang: lang,
                    hint: hint,
                    docFormat: docFormat,
                    multiSpeaker: multiSpeaker,
                    userStartTime: userStartTime
                })) return false;

            let pCreate = restClient.newSession(sectionId, lang || null, hint || null, docFormat || null, multiSpeaker || false, userStartTime);
            pCreate.then((res) => {
                socket.emit(EVENT_SERVER_SESSION_ID, res.data, res.cookies);// Send task back
            });
            pCreate.then((res) => {
                /// save identifier, pseudo identifier, user time, client time, server time, response time (now)
                // console.log(EVENT_CLIENT_INIT, identifier);
                //save the real identifier and pseudo-identifier to local db record
                //identifier;
                if (optionSIO.onReceivedTranscriptionSessionID && ((typeof optionSIO.onReceivedTranscriptionSessionID) == 'function'))
                    optionSIO.onReceivedTranscriptionSessionID({
                        socket: socket,
                        sessionID: res.data.session_id,
                        pseudoIdentifier: res.data.pseudoIdentifier,
                        identifier: identifier,
                        sectionId: sectionId,
                        lang: lang,
                        hint: hint,
                        docFormat: docFormat,
                        multiSpeaker: multiSpeaker,
                        userStartTime: userStartTime
                    });

            });

            pCreate.then((res) => {
                if (typeof restClient.onApiPushResult != 'undefined') {
                    if (!restClient.onApiPushResult)
                        // Create object if null
                        restClient.onApiPushResult = {};

                    // Assign callback for Session
                    restClient.onApiPushResult[res.data.session_id] = (data) => {
                        // same to updateResult call back
                        serverResponse(res.data.session_id, sectionID, res.cookies, data);
                    }
                }
            });
            pCreate.catch(err => {
                if ((typeof retryCallback) == 'function')
                    retryCallback();
                serverErr(null, sectionId, _last_update, err);
            });

            if (optionSIO.onNewTranscriptSessionCallback && ((typeof optionSIO.onNewTranscriptSessionCallback) == 'function'))
                optionSIO.onNewTranscriptSessionCallback({
                    socket: socket,
                    identifier: identifier,
                    sectionId: sectionId,
                    lang: lang,
                    hint: hint,
                    docFormat: docFormat,
                    multiSpeaker: multiSpeaker,
                    userStartTime: userStartTime
                });
            return pCreate;
        });

        socket.on(SS_AUDIO_STREAM, function (blob, info, sessionId, sectionID, cookies) {
            /**
             * On recieved audio stream or end event
             */
            updateClear();

            console.log(colours.fg.yellow, 'received stream: ', blob ? (blob.length / 1024) : blob, ' KB ', sessionId, sectionID, cookies, ' \n', info, colours.reset);

            // Send Message to  Server
            restClient.sendSound(sessionId, sectionID, info, blob, cookies)
                .then(data => {
                    let end = data.is_end || info.is_end;
                    serverResponse(sessionId, sectionID, cookies, data, end);
                    if (end && optionSIO.onReceivedEndTranscriptSessionCallback && (typeof optionSIO.onReceivedEndTranscriptSessionCallback == 'function'))
                        optionSIO.onReceivedEndTranscriptSessionCallback(socket, sessionId, sectionID, data);
                }).catch(err => { serverErr(sessionId, sectionID, _last_update, cookies, err); });

            if (optionSIO.onReceivedSoundCallback && ((typeof optionSIO.onReceivedSoundCallback) == 'function'))
                optionSIO.onReceivedSoundCallback(socket, sessionId, sectionID, blob, info);

            if (info.is_end && optionSIO.onEndTranscriptSessionCallback && (typeof optionSIO.onEndTranscriptSessionCallback == 'function'))
                optionSIO.onEndTranscriptSessionCallback(socket, sessionId, sectionID, info);
        });

    };
}

module.exports = {
    BindSIO: BindSIO,
    SIOOnConnection: SIOOnConnection,
    OptionBindSIO: OptionBindSIO,
    OptionSIO: OptionSIO,
    StaticJSDir: staticJsDir,
    StaticJSFiles: staticJsFiles
};