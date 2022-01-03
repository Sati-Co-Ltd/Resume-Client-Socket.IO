/**
* @file Resume.js - Client-side Javascript for fecorder and Socket.IO management
* @author Tanapat Kahabodeekanokkul
* @copyright Tanapat Kahabodeekanokkul 2021
* @license Tanapat-Kahabodeekanokkul
*/

/** @constant {string} EVENT_CLIENT_INIT when Socket.IO client start to record */
/** @constant {string} EVENT_SERVER_SESSION_ID  when Socket.IO server response session ID */
/** @constant {string} STREAM_ERROR when Socket.IO error occurs in server */
/** @constant {string} SS_AUDIO_STREAM when client streams sound to server */
/** @constant {string} SS_RESP_TRNSCR when server send transcript result back to client */

const EVENT_CLIENT_INIT = 'press-record',
    EVENT_SERVER_SESSION_ID = 'sess-id',
    STREAM_ERROR = 'stream-error',
    SS_AUDIO_STREAM = 'client-streaming',
    SS_RESP_TRNSCR = 'server-transcript';

/** @constant {string} REC_PAUSED `REC_PAUSED = "paused";` when recorder is paused. */
/** @constant {string} REC_STOP `REC_STOP = "stopped";` when recorder is stopped. */
/** @constant {string} REC_INACTIVE `REC_INACTIVE = "inactive";` when recorder is inactive. */
/** @constant {string} REC_RECORDING `REC_RECORDING = "recording";` when recorder is recording. */
/** @constant {string} REC_NULL `REC_NULL = null;` when recorder object is null or undefined. */
const REC_PAUSED = "paused", REC_STOP = "stopped", REC_INACTIVE = "inactive", REC_RECORDING = "recording", REC_NULL = null;

/** 
* check if given object is function
* @function isFunc
* @param {*} obj - object to be check 
* @return {Boolean} true if obj is function, otherwise false.
*/
function isFunc(obj) {
    return ((typeof obj) === 'function')
}

/**
* IDENTIFIER class for implementation as patient, healthcare team. Its format can be customized by each hospital. This class is default format for Resume.
* @param {(string|int)} TXN Transaction number of action (e.g. Visit number , Admission number)
* @param {(string|int)} [HN]  Hospital number of patient
* @param {(string|int)} [Location] that action is performed (e.g. OPD, IPD, Ward, Room)
* @param {(string|int)} [Practioner] Identification information of main practioner (e.g. doctor, surgeon)
* @param {string} [extraDetail] Extra detail of identifier e.g. note.
*/
class IDENTIFIER {
    TXN
    HN
    Location
    Practioner
    extraDetail
}

/**
* History object argument of onRecorderStop
* @typedef SoundHistory
* @type {Object}
* @property {string} session_id - session ID.
* @property {*} identifier - identification data for location, patients and practitioner
* @property {URL} url - Blob URL of total sound
* @property {int} blobsize - size of Blob
* @property {object} user_transcript - user-filled form data
*/


/**
 * Callback to get intermediate user transcript in object, called when client send sound chunk to server.
 *
 * @callback getIntermediateUserTranscript
 * @return {Resume-REST-API-Connect~GroupText} Object of user transcript
 */
/**
 * Callback to recieved intermediate and final result from server.
 *
 * @callback onReceiveTranscript
 * @param {Resume-REST-API-Connect~Transcript} transcript - object of transcript text from server in document format that set when client create new session ID.
 * @param {Boolean} isEnd - true if this transcript is final and session close completely.
 */

/**
 * Callback to recieved final result from server.
 *
 * @callback onReceiveFinalTranscript
 * @param {Resume-REST-API-Connect~Transcript} transcript - object of transcript text from server in document format that set when client create new session ID.
 */
/**
 * Callback to received record history when the voice recorder stopped
 *
 * @callback onRecorderStop
 * @param {SoundHistory} history - Object of history
 */
/**
 * Callback to be called when error occurs
 *
 * @callback onError
 * @param {(Object|string)} error - error object or error message string.
 */


/**
 * RESUME_DEFAULT_OPTION class for implementation as object of Resume Option
 * @param {callable} [sioOnConnectionCallback=null] Callback when Socket.IO connects to server successfully.
 * @param {callable} [sioOnConnectionCallback=null] Callback when Socket.IO disconnects from server.
 * @param {string[]|string} [langSuggest=['th-TH']] list of suggest voice language
 * @param {Boolean} [multiSpeaker=null] enable multispeaker mode (conversation mode) for API, set to false for dictation mode
 * @param {(string|int)} [defaultSectionID=0] default section of client's organization for billing and statistics
 * @param {String} [defaultDocFormat=null] default document format for transcriptor to summary response data
 * @param {float} [msSoundChuck=8000] size of sound chunk for sent to server in millisecond
 * @param {Boolean} [alertError=false] alert if error
 * @param {getIntermediateUserTranscript} [getIntermediateUserTranscript=null] callback get intermediate user transcript in object
 * @param {onReceiveTranscript} [onReceiveTranscript=null] callback to recieved intermediate (and final) result from server.
 * @param {onReceiveFinalTranscript} [onReceiveFinalTranscript=null] callback to recieved final result from server.
 * @param {onRecorderStop} [onRecorderStop=null] callback to received record history when the voice recorder stopped
 * @param {onError} [onError=null] callback to handle error object or error message string, consist of err argument that can be error object or error message string.
 */
class RESUME_DEFAULT_OPTION {

    sioOnConnectionCallback = null
    sioOnDisconnectionCallback = null
    langSuggest = ["th-TH"]
    static langOption = [
        "th-TH",
        "en-US",
        "zh",
        "ja-JP",
        "ko-KR",
        "zh-TW",
        "en-GB",
        "en-AU",
        "en-SG",
        "en-IN"
    ]
    multiSpeaker = null
    defaultSectionID = 0
    defaultDocFormat = null

    msSoundChuck = 1000

    alertError = false
    allowPause = true

    getIntermediateUserTranscript = function () { }
    onReceiveTranscript = function (transcript, isEnd) { }
    onReceiveFinalTranscript = function (transcript) { }
    onRecorderStop = function (recordHistory) { }
    onError = function (err) { }

    microphoneName = ["main", "another", "noise-cancelling"]
};


/**
* Abstract class for any Resume
* @extends RESUME_DEFAULT_OPTION
*/

class AbstractResume extends RESUME_DEFAULT_OPTION {
    _sioConnectionCallback(...param) {
        if (this.sioOnConnectionCallback)
            this.sioOnConnectionCallback(...param);
    }
    _sioDisconnectionCallback(...param) {
        if (this.sioOnDisconnectionCallback)
            this.sioOnDisconnectionCallback(...param);
    }
}
/**
* ResumeChild class - manage the socket.io and session ID
* @extends AbstractResume
* @property {(string|int)} [tag] - for marking the time position (second) of sound chunk which let the API to return the text position. It is important in dictation mode - to tell which part of form is correlated with sent sound.
* @property {float[]} [sentBlobSize] - size (byte) of sent sound chunk
* @property {string} SessionId - ID of active session of sound listening
* @property {(string|int)} sectionId - ID of active section
* @property {Resume-REST-API-Connect~Transcript} transcript - Transcripted result from the API
* @property {Boolean} isFinalTranscript - true if the transcript response is final (ended).
*/

class ResumeChild extends AbstractResume {
    tag
    sentBlobSize
    _sentBlobCount
    _identifier
    _waitBlobs

    _blobChunk
    _blobEnd


    sessionId
    sectionID = null;
    _cookies

    _recordStart
    _recordTime = 0

    transcript
    isFinalTranscript
    socket

    constructor(socket) {
        super();
        this.socket = socket;
    }

    _checkSessionID(res) {
        return (res && (res.session_id == this.sessionId) && (res.section_id == this.sectionID))
    }
    _sioReceiveSessionID(data, cookies) {
        if (!data || (data.section_id != this.sectionID)) {
            console.log('SectionID or SessionID not match');
            return;
        }
        this.sessionId = data.session_id;
        this._cookies = cookies;
        console.log('New session id = ' + this.sessionId + ' in section ' + this.sectionID);
    }
    _sioReceiveTranscript(data, isEnd) {
        //console.log('Received transcript... isEnd=' + isEnd + '  ' + JSON.stringify(res));
        if (!this._checkSessionID(data)) {
            console.log('SectionID or SessionID not match');
            console.log((data.session_id == this.sessionId), data.session_id, this.sessionId);
            console.log((data.section_id == this.sectionID), data.section_id, this.sectionID);
            return;
        }
        //let data = res.MlGroupTxt ? res.MlGroupTxt : res;
        if (isFunc(this.onReceiveTranscript))
            this.onReceiveTranscript(data, isEnd);
        if (isEnd && isFunc(this.onReceiveFinalTranscript))
            this.onReceiveFinalTranscript(data);

        this.transcript = data;
        this.isFinalTranscript = isEnd;
    }
    _handleError(sessionId, sectionID, e) {
        /*if (sectionID && ((sectionID != this.sectionID) || (sessionId && (sessionId != this.sessionId)))) {
            console.log('Skip Error: SectionID or SessionId not match ', ...e);
            return;
        }*/
        console.error(e);
        let err = 'Error! sessionId: ' + sessionId + ', sectionID: ' + sectionID + ', ' + ((typeof e) == 'string') ? e : (('message' in e) ? e.message : JSON.stringify(e));
        if (this.alertError)
            alert(err);
        console.log(err);
        if (isFunc(this.onError))
            return this.onError(e);
    }
    /** 
   * getRecordTime() get recorded time of actual session
   * @return {float} recorded time in seconds
   */
    getRecordTime() {
        return (this._recordTime + (this._recordStart ? (Date.now() - this._recordStart) : 0)) / 1000;
    }
    /** 
   * getActiveSessionID() get active session ID
   * @return {string} active session ID
   */
    getActiveSessionID() {
        return this.sessionId;
    }

    _intermediateUserTranscript() {
        if (isFunc(this.getIntermediateUserTranscript))
            return this.getIntermediateUserTranscript();
        return null;
    }

    _setBlob(blob, index, isEnd, userTranscript) {
        this._blobChunk[index] = blob;
        this._blobEnd[index] = isEnd;
        if (this._blobChunk.every(x => x) || this._blobEnd.every(x => x)) {
            this._pushBlob(this._blobChunk, isEnd, userTranscript);
            this._blobChunk = Array.from({ length: this._blobChunk.length })
        }
    }

    _pushBlob(blob, isEnd, userTranscript) {
        // !! important, this code will record every single stream chunck onto server; so practically should upload only audio that is validated from speech engine
        var info = {
            datetime: new Date().toJSON(),
            is_end: isEnd,
            tag: this.tag
        };
        info._id = this._sentBlobCount;
        info.user_transcript = userTranscript || this._intermediateUserTranscript();

        if ((this._waitBlobs.length > 0) || (!this.sessionId) || (this.sessionId == '') || (!this._cookies)) {
            console.log("Add blob to queue" + info)
            this._waitBlobs.push([blob, info]);
        } else if (this._waitBlobs.length <= 0) {
            console.log('Emit stream... ', this.sessionId, "\nCount ID: ", info._id, "\nsize = ", (blob ? (blob.reduce((prev, c) => prev.push(c.size / 1024), [])) : null), ' KB\nCookie: ', this._cookies);
            this.socket.emit(SS_AUDIO_STREAM, blob, info, this.sessionId, this.sectionID, this._cookies);
        }
        if (blob) {
            for (let k in blob) {
                this._sentBlobCount[k]++;
                this.sentBlobSize[k] += blob[k].size;
            }
        }
        this._pushWaitBlob();
    }
    _pushWaitBlob() {
        if (this._waitBlobs.length > 0) {
            if (this.sessionId && (this.sessionId != '') && (this._cookies)) {
                // push all queue to server
                let sid = this.sessionId, sec = (this.sectionID || this.defaultSectionID), ck = this._cookies;
                this._waitBlobs.forEach(function (val, i, wB) {
                    console.log('streaming wait queue..' + i);
                    this.socket.emit(SS_AUDIO_STREAM, val[0], val[1], sid, sec, ck);
                    wB.splice(0, 1); // drop first
                });
            } else {
                let _this = this;
                setTimeout(() => _this._pushWaitBlob(), 900);
            }
        }
    }

    _newSession(socket, hint, identifier, sectionID, docFormat, langSuggest) {
        this._waitBlobs = [];
        this._sentBlobCount = new Array(this._blobEnd.length).fill(0);
        this.sentBlobSize = new Array(this._blobEnd.length).fill(0);
        this.transcript = null;
        this.isFinalTranscript = false;

        langSuggest = [
            ...(langSuggest || this.langSuggest || []),
            ...(this.langOption || [])
        ];
        this.sectionID = sectionID || this.defaultSectionID || 0;
        this._identifier = identifier || null;
        hint = hint || null;
        if ((typeof docFormat) == "undefined")
            docFormat = this.defaultDocFormat;

        let _this = this;
        this.socket.emit(EVENT_CLIENT_INIT,
            this.sectionID,
            this.microphoneName,
            langSuggest,
            hint,
            docFormat,
            this.multiSpeaker,
            this._identifier,
            Date.now(), // User start time
            () => _this._newSession(socket, hint, identifier, sectionID, docFormat, langSuggest)
        );

    }

    _endSession(index, stopRecorderCallback, userTranscript, callback) {
        //let _this = this, identifier = this._identifier;

        stopRecorderCallback((blobURL, blob) => {
            // Pushblob with end
            if (this.sentBlobSize[index] < blob.size)
                this._setBlob(blob.slice(this.sentBlobSize[index]), true, userTranscript);
            else
                this._setBlob(null, true, userTranscript);
            console.log("Stop recording: ", index, "....\nTotal sound chunk: ", this._sentBlobCount, "\nTotal Size: ", (this.sentBlobSize[index] / (1 << 20)), ' MB');
            //keep SessionID and sectionID to receive some callback
            //this.sectionID = null;

            this._blobEnd[index] = blobURL;
            if (this._blobEnd.every(x => x)) {
                // Check if all stop
                if (callback)
                    return callback({
                        session_id: this.sessionId,
                        identifier: this._identifier,
                        url: this._blobEnd,
                        blobsize: this.sentBlobSize,
                        blobcount: this._sentBlobCount,
                        user_transcript: userTranscript
                    });
            }
        });


    }

}
/**
* Class handling microphone and media recorder for Resume
* @property {RecordRTC} [recorder] RecordRTC variable
* @property {MediaStream} [microphone] Microphone variable
* @property {Boolean} [alertError] call alert() if error
* @property {float} [msSoundChuck=1000] time interval to send sound chunk to Socket.IO
*/

class ResumeRecorder {
    recorder
    microphone
    alertError
    msSoundChuck = 1000

    /** 
    * Get status of recoder can be one of REC_PAUSED = "paused", REC_STOP = "stopped", REC_INACTIVE = "inactive", REC_RECORDING = "recording", REC_NULL = null
    * @summary get status of recoder
    * @return {(string|null)} recorder status null, "recording", "paused", "stopped" or "inactive".
    */
    getStatus() {
        if (!this.recorder)
            return REC_NULL;
        return this.recorder.state;
    }
    _prepareNewSession(callback_if_retry) {
        if (!this.microphone) {
            this._captureMicrophone(callback_if_retry);
            return false;
        }
        return true;
    }

    _newRecordRTC(Pushblob, msSoundChuck, onStateChanged) {
        this.recorder = RecordRTC(this.microphone, {
            type: 'audio',
            mimeType: 'audio/wav',
            sampleRate: 44100,
            desiredSampRate: 16000,
            recorderType: StereoAudioRecorder,
            numberOfAudioChannels: 1,
            timeSlice: msSoundChuck || 1000, // returns blob every 1s (the less time, the much chunk created)
            ondataavailable: Pushblob,
        });
        this.recorder.onStateChanged = onStateChanged;
    }

    _startRecorder() {
        if (this.recorder) {
            this.recorder.reset();
        } else {
            this.alertError('Recorder is not started! Please call _newRecordRTC')
            //this._newRecordRTC(Pushblob, msSoundChuck, onStateChanged);
        }


        this.recorder.startRecording();
        //this.isRecording = True;
    }
    /** 
    * pause the recorder
    */

    pause() {
        if (this.recorder && this.microphone && (this.getStatus() == REC_RECORDING))
            return this.recorder.pauseRecording();
    /** 
* resume the recorder
*/}

    resume() {
        if (this.recorder && this.microphone && (this.getStatus() == REC_PAUSED))
            return this.recorder.resumeRecording();
    }


    _stopRecorder(callback) {
        return this.recorder.stopRecording(function (blobURL) {
            return callback(blobURL, this.getBlob());
        });
    }
    _stopMicrophone() {
        if (this.microphone) {
            this.microphone.stop();
            this.microphone = null;
        }
    }

    _captureMicrophone(callback) {
        if (this.microphone) {
            callback();
            return;
        }

        if (((typeof navigator.mediaDevices) === 'undefined') || !navigator.mediaDevices.getUserMedia) {
            // !! Error also thrown when access via mobile without https.
            let e = 'Error! Because this browser does not supports WebRTC getUserMedia API, or the API does not work with HTTP (not HTTPS).';
            if (!!navigator.getUserMedia) {
                e += ' This browser seems supporting deprecated getUserMedia API.';
            }
            this._logError(e);

        }

        navigator.mediaDevices.getUserMedia({
            audio: (
                navigator.userAgent.indexOf('Edge') !== -1 &&
                (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob)
            ) ? true : { echoCancellation: false }
        })
            .then(mic => {
                this.microphone = mic;
                callback();
            })
            .catch(error => {
                this._logError('Unable to capture your microphone. Please check console logs.');
                this._logError(error);
            });
    }
    _logError(e) {
        console.error(e);
        let err = 'Error! from Recorder' + (((typeof e) == 'object') ? (('message' in e) ? e.message : JSON.stringify(e)) : e);
        if (this.alertError)
            alert(err);
        console.log(err);
        if (isFunc(this.onError))
            return this.onError(e);
    }
}


/**
* Resume is a class to manage microphone and sound chunk streaming via socket.io
* @extends ResumeChild
* @property {ResumeRecorder} recorder object of resume recorder to manage microphone.
*/


class Resume extends ResumeChild {

    recorder

    /** 
    * class constructor and set the event listener of socket.io
    * @param {(Socket.IO)} socket  Socket.IO client object, e.g. create from io(url,option)
    * @param {(RESUME_DEFAULT_OPTION|Object)} [resumeOption] option for ResumeBase Class
    * 
    */
    constructor(socket, resumeOption) {
        super(socket);
        // this.recorder = new ResumeRecorder();
        if (resumeOption) {
            for (let k in resumeOption) {
                if (k in this) {
                    this[k] = resumeOption[k];
                }
            }
        }

        if ((!this.microphoneName) || (this.microphoneName.length == 0)) {
            this.microphoneName = ["default"];
        }

        this._blobChunk = new Array(this.microphoneName.length).fill(undefined);
        this._blobEnd = new Array(this.microphoneName.length).fill(false);
        this.recorder = new Array(this.microphoneName.length);

        for (let k in this.microphoneName) {
            this.recorder[k] = new ResumeRecorder();
            let newMic = () => this.recorder[k]._newRecordRTC(
                (blob) => this._setBlob(blob, k),
                this.msSoundChuck,
                (state) => this._onRecorderStageChanged(state)
            );
            if (this.recorder[k]._prepareNewSession(newMic))
                newMic();
        }

        this.socket = socket;
        this.socket.on('connection', (...arg) => this._sioConnectionCallback(...arg));
        this.socket.on('disconnection', (...arg) => this._sioDisconnectionCallback(...arg));
        this.socket.on(SS_RESP_TRNSCR, (...arg) => this._sioReceiveTranscript(...arg));

        this.socket.on(EVENT_SERVER_SESSION_ID, (res, cookies) => this._sioReceiveSessionID(res, cookies));
        this.socket.on(STREAM_ERROR, (sessionId, sectionID, e) => this._handleError(sessionId, sectionID, e));
    }

    _onRecorderStageChanged(state) {
        switch (state) {
            case REC_RECORDING:
                if (!this._recordStart)
                    this._recordStart = Date.now();
                break;
            case REC_INACTIVE:
            case REC_PAUSED:
            case REC_STOP:
                if (this._recordStart) {
                    this._recordTime += (Date.now() - this._recordStart);
                    this._recordStart = null;
                }
        }
    }

    /**
     * getStatus() get status of recorder
     * @returns {string} recorder status as the `const REC_PAUSED = "paused", REC_STOP = "stopped", REC_INACTIVE = "inactive", REC_RECORDING = "recording", REC_NULL = null;`
     */
    getStatus() {
        return this.recorder ? this.recorder.forEach(i => i.getStatus()) : REC_NULL;
    }

    /**
     * newSession - tell the speech API to create new session ID and create recording object. Then the API will response to sessionID property
     * @summary create new session ID which will be stored in sessionID property.
     * @param {(string[]|string)} [hint=null] hint for the voice-to-text transcripter
     * @param {*} identifier the object of identification data of patients (Transaction number, Visit number, Admission number, Hospital number) and healthcare workers (for researching or other purposes of each organization). This data will store (in local not sent outside private network.
     * @param {(string|int)} sectionID e.g. department number, section of organization name
     * @param {string} docFormat Format of document to let the speech-to-text API to generate returned data - reference the name from "C-CDA 1.1.0 on FHIR" otherwise will be "Default". Please read [README.md](../README.md) and http://hl7.org/fhir/us/ccda/artifacts.html
     * @param {string[]|string} [langSuggest] BCP-47 language code in string type or array of string type ordered by highest priority to suggest the speech-to-text API - the default is located in ./public/lang.json . See more detail of [BCP-47](https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers)
     */
    newSession(hint, identifier, sectionID, docFormat, langSuggest) {
        switch (this.getStatus()) {
            case REC_RECORDING:
            case REC_PAUSED:
                this._handleError(null, null,
                    MediaStreamError(
                        'The ' + (this.getActiveSessionID ? 'session ID: ' + this.getActiveSessionID() : 'recorder')
                        + ' is ' + this.getStatus() + '. Please stop before create new session.'
                    )
                );
        }

        this._blobChunk = new Array(this.microphoneName.length).fill(undefined);
        this._blobEnd = new Array(this.microphoneName.length).fill(false);

        //if (!this.recorder._prepareNewSession(() => this.newSession(hint, identifier, sectionID, docFormat, langSuggest)))
        //   return;

        super._newSession(this.socket, hint, identifier, sectionID, docFormat, langSuggest);

        this._recordTime = 0;
        this.recorder.forEach(i => i._startRecorder());

        //let _this = this;
    }
    //start = newSession
    /** 
    * endSession(userTranscript, callback) - end the listening session, send user-filled form to the speech API (for R&D). Then the API will response to onReceiveFinalTranscript and onReceiveTranscript callable.
    * @summary end the session, send form data to the API
    * @param {Object} [userTranscript] - User-filled form data, should be followed the field name in "C-CDA 1.1.0 on FHIR" otherwise will be "other" - http://hl7.org/fhir/us/ccda/artifacts.html
    * @param {callable} [callback] - to be called when the recorder javascript already stopped (already terminated microphone) and it do not wait for API response.
    */

    endSession(userTranscript, callback) {
        if (!userTranscript)
            userTranscript = this._intermediateUserTranscript();

        callback = callback || this.onRecorderStop;

        for (let k in this.microphoneName)
            this._endSession((c) => this.recorder[k]._stopRecorder(c), userTranscript, callback);
    }

    /** 
    * pause() - Pause the recording session if allowPause is true.
    */
    pause() {
        if (this.allowPause)
            return this.recorder.forEach(i => i.pause());
        this._handleError(null, null, 'This ResumeOne object does not allow to pause!!');
    }
    /** 
    * resume() - Resume the paused session if allowPause is true.
    */
    resume() {
        if (this.allowPause)
            return this.recorder.forEach(i => i.resume());
        this._handleError(null, null, 'This ResumeOne object does not allow to pause/resume!!');

    }


    /** 
    * static loadSectionList(urlSectionJSON) - load preset section information in json file.
    * @param {(string|URL)} urlSectionJSON - URL to preset section information
    * @return {Promise} Promise(response) from jQuery.get method - containing section information JSON data
    */
    static loadSectionList(urlSectionJSON) {
        return jQuery.get(urlSectionJSON || '/section_id.json', { 't': Date.now() });
    }
}

class ResumeOne extends Resume { } // backward compatibility
//ResumeOne = { ...ResumeOne, ...ResumeRecorder };