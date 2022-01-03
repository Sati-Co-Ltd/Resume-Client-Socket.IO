// Browser handling
var isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator
    .msSaveBlob);
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
// Client and server identifier


var socket = io(); // specify host and port   e.g. ':443'
const EVENT_CLIENT_INIT = 'press-record',
    EVENT_SERVER_SESSION_ID = 'sess-id',
    STREAM_ERROR = 'stream-error';

const SS_AUDIO_STREAM = 'client-streaming',
    SS_AUDIO_SAVE = 'client-finishrecord',
    SS_RESP_TRNSCR = 'server-transcript',
    SS_RESP_SAVCPL = 'server-saved',
    SS_RESP_NOSAVE = 'server-rejectsave';

// Audio handling
var _history = [];
const SOUND_CHUNK_ms = 8000;

var app = new Vue({
    el: '#app',
    data: {
        HN: "",
        HN_active: "",
        TXN: null,

        showRecorder: false,
        startRecord: false,
        btnRecordValue: "Record",

        timer: 0,

        interval: null,
        recorder: null,
        microphone: null,

        reclist: null,
        srvfilelist: [],
        sentBlobSize: 0,
        sentBlobCount: 0,
        waitBlobs: [],

        _uid: null,
        session_id: null,

        project_id_list: [],
        project_id: 0,

        lang: 'th-TH',
        langList: ['th-TH'],
        multiSpeaker: true,
    },
    mounted: function () {
        this._uid = this.randomuid();
    },
    methods: {
        submitHN: function () {
            var value = this.HN && this.HN.trim();
            if (!value) {
                return;
            }
            log('Instantiate recorder for HN: ' + this.HN)
            this.HN_active = this.HN;
            // add HN name lookup somewhere here
            this.HN_txt = 'Recorder for HN: ' + this.HN_active;
            this.HN = "";
            this.showRecorder = true;
            // this.renderServerFiles(this.HN_active);
        },
        checkCurrent: function () {
            log('Active HN: ' + this.HN_active);
            return this.HN_active;
        },
        changeHN: function () {
            if (this.startRecord) {
                console.log('Cannot change HN during record');
                return;
            }
            this.HN = "";
            this.TXN = null;
            this.HN_active = "";
            this.showRecorder = !this.showRecorder;
            this.btnRecordValue = 'Record';
            this.recorder = null;
            this.reclist = null;
            this._uid = this.randomuid();
            this.session_id = null;
            this.sentBlobSize = 0;
            this.sentBlobCount = 0;
            this.waitBlobs = [];
            _history = [];
            log();
        },
        toggleRecord: function () {
            if (!this.startRecord) {
                this._startRecord();
            } else {
                this._stopRecord();
                this.btnRecordValue = 'saving...';
                log('Stopped recording.');
                clearInterval(this.interval);
                this.timer = 0;
                this.startRecord = false;
                this.reclist = _history;
            }
        },
        _getHint: function () {
            // get Hint for voice transcriber
            // From Chief complaint, Nurse Cheif complaint, or prefilled History
            return null;
        },
        _getUserTranscribe: function () {
            return {};
        },
        _pushBlob: function (blob, _this, isEnd) {
            _this = _this || this;
            // !! important, this code will record every single stream chunck onto server; so practically should upload only audio that is validated from speech engine
            var info = {
                _id: _this.sentBlobCount,
                name: 'stream_HN' + _this.HN_active + '.' + _this.sentBlobCount + '.wav',
                //project_id: _this.project_id,
                //size: blob.size,
                //uid: _this._uid,
                datetime: new Date().toJSON(),
                user_transcript: _this._getUserTranscribe(),
                is_end: isEnd
            };

            if ((_this.waitBlobs.length > 0) || (!_this.session_id) || (_this.session_id == '')) {
                console.log("Add blob to queue" + info)
                _this.waitBlobs.push([blob, info]);
            } else if (_this.waitBlobs.length <= 0) {
                console.log('Emit stream..' + _this.session_id + '::' + info._id + '; size=' + (blob.size / 1024) + 'KB');
                socket.emit(SS_AUDIO_STREAM, blob, info, _this.session_id, _this.project_id);
                /*var stream = ss.createStream();
                ss(socket).emit(SS_AUDIO_STREAM, stream, info, _this.session_id);
                console.log('streaming..');
                ss.createBlobReadStream(blob).pipe(stream)
                    .on('error', () => console.log('Stream ID ' + info._id + ' is error!'))
                    .on('close', () => console.log('Stream ID ' + info._id + ' closed.'))
                    .on('finish', () => console.log('Stream ID ' + info._id + ' is finished.'));*/
            }
            if (blob) {
                _this.sentBlobCount++;
                _this.sentBlobSize += blob.size;
            }
            if ((_this.waitBlobs.length > 0) && _this.session_id && (_this.session_id != '')) {
                // push all queue to server
                _this.waitBlobs.forEach(function (val, i, wB) {
                    console.log('streaming wait queue..' + i);
                    socket.emit(SS_AUDIO_STREAM, val[0], val[1], _this.session_id, _this.project_id);
                    /*var stream = ss.createStream();
                    ss(socket).emit(SS_AUDIO_STREAM, stream, val[1], _this.session_id, _this.project_id);
                    ss.createBlobReadStream(val[0]).pipe(stream);*/
                    wB.splice(0, 1);
                });
            }
            // if (blob.data && blob.data.size > 0) {
            //     recordedBlobs.push(blob.data);
            //     console.log(recordedBlobs)
            // }
        },
        _startRecord: function () {
            // Get session_id from REST API
            let _this = this;
            this.sentBlobSize = 0;
            this.sentBlobCount = 0;
            this.waitBlobs = [];

            let options = {
                type: 'audio',
                mimeType: 'audio/wav',
                sampleRate: 44100,
                desiredSampRate: 16000,
                recorderType: StereoAudioRecorder,
                numberOfAudioChannels: 1,
                timeSlice: SOUND_CHUNK_ms, // returns blob every 8s (the less time, the much chunk created)
                ondataavailable: function (blob) {
                    return _this._pushBlob(blob, _this);
                }
            };
            if (!this.microphone) {
                this._captureMicrophone(function (mic) {
                    _this.microphone = mic;
                    _this._startRecord();
                });
                return;
            }

            socket.emit(EVENT_CLIENT_INIT, this.project_id, this.langList, this._getHint(), this.multiSpeaker, { HN: this.HN_active, TXN: this.TXN });

            //lang = this.lang || this.langList;

            /* // The uid is generated in browser and the session_id is generated from REST API server. So, thess lines are not necessary.
            jQuery.get('/requestAudioSessionUID', {
                'ts': new Date().getTime(),
                'HN': this.HN_active
            }, function (result) {
                console.log(result)
            }); */
            this.recorder = RecordRTC(this.microphone, options);
            this.recorder.startRecording();
            this.interval = setInterval(_this._tick, 1000);
            this.startRecord = !this.startRecord;
            this.btnRecordValue = 'Listening...';
            log('Recording...');
        },
        _stopRecord: function () {
            var currentHN = this.checkCurrent();
            let _this = this;
            this.recorder.stopRecording(function () {
                blob = this.getBlob();

                // Pushblob with end
                if (_this.sentBlobSize < blob.size)
                    _this._pushBlob(blob.slice(_this.sentBlobSize), _this, true);
                else
                    _this._pushBlob(null, _this, true);

                _history.push({
                    _uid: _this._uid,
                    session_id: _this.session_id,
                    HN: currentHN,
                    TXN: _this.TXN,
                    url: URL.createObjectURL(blob),
                    blobsize: this.getBlob().size,
                    user_transcript: _this._getUserTranscribe()
                });
                // gather user transcipt (user input) from form
                /* var user_transcript = {};
                socket.emit(SS_AUDIO_SAVE, _this.session_id, _this.project_id, {
                    HN: currentHN,
                    size: blob.size,
                    id: _this._uid,
                    user_transcript: user_transcript
                }); */
                console.log('concatenating audio file');
                // ** Previously this was used to stream completed audioblob to server, now that we use SoX for concating wav files; these lines are not necessary
                //     // stream whole audioblob to server
                //     var stream = ss.createStream();
                //     console.log('streaming whole audio to server..');
                //     ss(socket).emit(SS_AUDIO_SAVE, stream, {
                //         HN: currentHN,
                //         size: this.getBlob().size,
                //         id: _this._uid
                //     });
                //    ss.createBlobReadStream(this.getBlob()).pipe(stream);
            });

            if (this.microphone) {
                this.microphone.stop();
                this.microphone = null;
            }
        },
        _tick: function () {
            this.timer += 1;
            this.btnRecordValue = convertTimeMMSS(this.timer) + ' (Click to stop)';
        },
        _captureMicrophone: function (callback) {
            if (this.microphone) {
                callback(this.microphone);
                return;
            }

            if (typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices
                .getUserMedia) {
                alert('This browser does not supports WebRTC getUserMedia API.');
                //  error also thrown when access via mobile without https
                if (!!navigator.getUserMedia) {
                    alert('This browser seems supporting deprecated getUserMedia API.');
                }
            }

            navigator.mediaDevices.getUserMedia({
                audio: isEdge ? true : {
                    echoCancellation: false
                }
            }).then(function (mic) {
                callback(mic);
            }).catch(function (error) {
                alert('Unable to capture your microphone. Please check console logs.');
                console.error(error);
            });
        },
        checkNumeric: function (e) {
            let char = String.fromCharCode(e.keyCode)
            if (!/[0-9]/.test(char)) {
                e.preventDefault()
            }
        },
        renderServerFiles: function (hn = null) {
            var filelist = getRecordedFilesFromServer(hn);
            this.srvfilelist = filelist;
        },
        randomuid: function () {
            return Math.round((1 + Math.random()) * Date.now());
        },
        getProject: function () {
            jQuery.get('/project_id.json', { 'uid': this.randomuid() }, function (res) {
                project_id_list = res
            });
        }
    },
    computed: {
        recordBtnClass: function () {
            return {
                transition: this.startRecord,
                red: this.startRecord
            }
        }
    },
    created: function () {
        this.getProject();
    }
})
// Miscellaneous
function log(e) {
    let time = new Date();
    let hr = time.getHours(),
        min = (time.getMinutes() < 10) ? '0' + time.getMinutes() : time.getMinutes(),
        sec = (time.getSeconds() < 10) ? '0' + time.getSeconds() : time.getSeconds();
    if (!e) {
        $("#log").html('');
        return;
    }
    $("#log").prepend('<li>(' + hr + ':' + min + ':' + sec + ') –– ' + e + '</li>')
}

function getRecordedFilesFromServer(hn = null) {
    var json = [];
    $.get('/getRecordedFiles', {
        'ts': new Date().getTime(),
        'HN': hn
    }, function (result) {
        if (!result.files) {
            json.push('No file');
            return;
        }
        result.files.forEach(file => {
            var f = file.split("/");
            json.push({
                dir_HN: f[1],
                url: file,
                filename: f[2]
            });
        });
    });
    //console.log(json);
    return json;
}

function getRecordedHN() {
    var json = [];
    $.get('/getRecordedHN', {
        'ts': new Date().getTime()
    }, function (result) {
        if (!result.files) {
            json.push('No file');
            return;
        }
        result.files.forEach(file => {
            var f = file.split("/");
            json.push({
                dir_HN: f[1]
            });
        });
    });
    //console.log(json);
    return json;
}

function convertTimeMMSS(seconds) {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
}
$(document).ready(() => {
    app.renderServerFiles();
    $('.ui.accordion').accordion();
});


socket.on(SS_RESP_SAVCPL, function (response) {
    log('file successfully saved on server: ' + response.serverFilePath);
    app.renderServerFiles(app.HN_active);
    app.btnRecordValue = "Saved, Press again to record";
});
socket.on(SS_RESP_NOSAVE, function () {
    log('not saved due to file size is too small');
    app.btnRecordValue = "Record";
});
socket.on(STREAM_ERROR, function (e) {
    alert('Error streaming: ' + e.message);
    console.error(error)
    //window.location = window.location;
});
socket.on(SS_RESP_TRNSCR, function (data) {
    // Sent transcript to form
    log(data);
});
socket.on(EVENT_SERVER_SESSION_ID, function (session_id) {
    app.session_id = session_id;
    log('New task id = ' + session_id);
});