#  Resume.js
Client-sided Javascript for recorder and Socket.IO Client management

## Classes

<dl>
<dt><a href="#IDENTIFIER">IDENTIFIER</a></dt>
<dd><p>IDENTIFIER class for implementation as patient, healthcare team. Its format can be customized by each hospital. This class is default format for Resume.</p>
</dd>
<dt><a href="#RESUME_DEFAULT_OPTION">RESUME_DEFAULT_OPTION</a></dt>
<dd><p>RESUME_DEFAULT_OPTION class for implementation as object of Resume Option</p>
</dd>
<dt><a href="#AbstractResume">AbstractResume</a> &lArr; <code><a href="#RESUME_DEFAULT_OPTION">RESUME_DEFAULT_OPTION</a></code></dt>
<dd><p>Abstract class for any Resume</p>
</dd>
<dt><a href="#ResumeChild">ResumeChild</a> &lArr; <code><a href="#AbstractResume">AbstractResume</a></code></dt>
<dd><p>ResumeChild class - manage the socket.io and session ID</p>
</dd>
<dt><a href="#ResumeRecorder">ResumeRecorder</a></dt>
<dd><p>Class handling microphone and media recorder for Resume</p>
</dd>
<dt><a href="#ResumeOne">ResumeOne</a> &lArr; <code><a href="#ResumeChild">ResumeChild</a></code></dt>
<dd><p>ResumeOne is a class to manage microphone and sound chunk streaming via socket.io</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#EVENT_CLIENT_INIT">EVENT_CLIENT_INIT</a> : <code>string</code></dt>
<dd><p>when Socket.IO client start to record</p>
</dd>
<dt><a href="#EVENT_SERVER_SESSION_ID">EVENT_SERVER_SESSION_ID</a> : <code>string</code></dt>
<dd><p>when Socket.IO server response session ID</p>
</dd>
<dt><a href="#STREAM_ERROR">STREAM_ERROR</a> : <code>string</code></dt>
<dd><p>when Socket.IO error occurs in server</p>
</dd>
<dt><a href="#SS_AUDIO_STREAM">SS_AUDIO_STREAM</a> : <code>string</code></dt>
<dd><p>when client streams sound to server</p>
</dd>
<dt><a href="#SS_RESP_TRNSCR">SS_RESP_TRNSCR</a> : <code>string</code></dt>
<dd><p>when server send transcript result back to client</p>
</dd>
<dt><a href="#REC_PAUSED">REC_PAUSED</a> : <code>string</code></dt>
<dd><p><code>REC_PAUSED = &quot;paused&quot;;</code> when recorder is paused.</p>
</dd>
<dt><a href="#REC_STOP">REC_STOP</a> : <code>string</code></dt>
<dd><p><code>REC_STOP = &quot;stopped&quot;;</code> when recorder is stopped.</p>
</dd>
<dt><a href="#REC_INACTIVE">REC_INACTIVE</a> : <code>string</code></dt>
<dd><p><code>REC_INACTIVE = &quot;inactive&quot;;</code> when recorder is inactive.</p>
</dd>
<dt><a href="#REC_RECORDING">REC_RECORDING</a> : <code>string</code></dt>
<dd><p><code>REC_RECORDING = &quot;recording&quot;;</code> when recorder is recording.</p>
</dd>
<dt><a href="#REC_NULL">REC_NULL</a> : <code>string</code></dt>
<dd><p><code>REC_NULL = null;</code> when recorder object is null or undefined.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#isFunc">isFunc(obj)</a> &lArr; <code>Boolean</code></dt>
<dd><p>check if given object is function</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#SoundHistory">SoundHistory</a> : <code>Object</code></dt>
<dd><p>History object argument of onRecorderStop</p>
</dd>
<dt><a href="#GroupText">GroupText</a> : <code>Object.&lt;string, Array.&lt;string&gt;&gt;</code></dt>
<dd><p>Object contains keys - part of document following Terminology of &quot;C-CDA 1.1.0 on FHIR resource profile&quot; (see README.md), and values - array of sentences or pharse (join into one string). <code>{&quot;problem_section&quot;:[&quot;This is sentence one.&quot;,&quot;more pharse here...&quot;]}</code></p>
</dd>
<dt><a href="#Transcript">Transcript</a> : <code>object</code></dt>
<dd><p>Transcript response of sent sound from Resume API</p>
</dd>
<dt><a href="#getIntermediateUserTranscript">getIntermediateUserTranscript</a> &lArr; <code><a href="#GroupText">GroupText</a></code></dt>
<dd><p>Callback to get intermediate user transcript in object, called when client send sound chunk to server.</p>
</dd>
<dt><a href="#onReceiveTranscript">onReceiveTranscript</a> : <code>function</code></dt>
<dd><p>Callback to recieved intermediate and final result from server.</p>
</dd>
<dt><a href="#onReceiveFinalTranscript">onReceiveFinalTranscript</a> : <code>function</code></dt>
<dd><p>Callback to recieved final result from server.</p>
</dd>
<dt><a href="#onRecorderStop">onRecorderStop</a> : <code>function</code></dt>
<dd><p>Callback to received record history when the voice recorder stopped</p>
</dd>
<dt><a href="#onError">onError</a> : <code>function</code></dt>
<dd><p>Callback to be called when error occurs</p>
</dd>
</dl>

<a name="IDENTIFIER"></a>

## IDENTIFIER
IDENTIFIER class for implementation as patient, healthcare team. Its format can be customized by each hospital. This class is default format for Resume.
  
**Kind**: global class  
<a name="new_IDENTIFIER_new"></a>

### new IDENTIFIER(TXN, [HN], [Location], [Practioner], [extraDetail])

| Param | Type | Description |
| --- | --- | --- |
| TXN | <code>string</code> \| <code>int</code> | Transaction number of action (e.g. Visit number , Admission number) |
| [HN] | <code>string</code> \| <code>int</code> | Hospital number of patient |
| [Location] | <code>string</code> \| <code>int</code> | that action is performed (e.g. OPD, IPD, Ward, Room) |
| [Practioner] | <code>string</code> \| <code>int</code> | Identification information of main practioner (e.g. doctor, surgeon) |
| [extraDetail] | <code>string</code> | Extra detail of identifier e.g. note. |

<a name="RESUME_DEFAULT_OPTION"></a>

## RESUME\_DEFAULT\_OPTION
RESUME_DEFAULT_OPTION class for implementation as object of Resume Option
  
**Kind**: global class  
<a name="new_RESUME_DEFAULT_OPTION_new"></a>

### new RESUME\_DEFAULT\_OPTION([sioOnConnectionCallback], [sioOnConnectionCallback], [langSuggest], [multiSpeaker], [defaultSectionID], [defaultDocFormat], [msSoundChuck], [alertError], [getIntermediateUserTranscript], [onReceiveTranscript], [onReceiveFinalTranscript], [onRecorderStop], [onError])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [sioOnConnectionCallback] | <code>callable</code> | <code></code> | Callback when Socket.IO connects to server successfully. |
| [sioOnConnectionCallback] | <code>callable</code> | <code></code> | Callback when Socket.IO disconnects from server. |
| [langSuggest] | <code>Array.&lt;string&gt;</code> \| <code>string</code> | <code>[&#x27;th-TH&#x27;]</code> | list of suggest voice language |
| [multiSpeaker] | <code>Boolean</code> | <code></code> | enable multispeaker mode (conversation mode) for API, set to false for dictation mode |
| [defaultSectionID] | <code>string</code> \| <code>int</code> | <code>0</code> | default section of client's organization for billing and statistics |
| [defaultDocFormat] | <code>String</code> | <code></code> | default document format for transcriptor to summary response data |
| [msSoundChuck] | <code>float</code> | <code>8000</code> | size of sound chunk for sent to server in millisecond |
| [alertError] | <code>Boolean</code> | <code>true</code> | alert if error |
| [getIntermediateUserTranscript] | [<code>getIntermediateUserTranscript</code>](#getIntermediateUserTranscript) | <code></code> | callback get intermediate user transcript in object |
| [onReceiveTranscript] | [<code>onReceiveTranscript</code>](#onReceiveTranscript) | <code></code> | callback to recieved intermediate (and final) result from server. |
| [onReceiveFinalTranscript] | [<code>onReceiveFinalTranscript</code>](#onReceiveFinalTranscript) | <code></code> | callback to recieved final result from server. |
| [onRecorderStop] | [<code>onRecorderStop</code>](#onRecorderStop) | <code></code> | callback to received record history when the voice recorder stopped |
| [onError] | [<code>onError</code>](#onError) | <code></code> | callback to handle error object or error message string, consist of err argument that can be error object or error message string. |

<a name="AbstractResume"></a>

## AbstractResume &lArr; [<code>RESUME\_DEFAULT\_OPTION</code>](#RESUME_DEFAULT_OPTION)
Abstract class for any Resume
  
**Kind**: global class  
**Extends**: [<code>RESUME\_DEFAULT\_OPTION</code>](#RESUME_DEFAULT_OPTION)  
<a name="ResumeChild"></a>

## ResumeChild &lArr; [<code>AbstractResume</code>](#AbstractResume)
ResumeChild class - manage the socket.io and session ID
  
**Kind**: global class  
**Extends**: [<code>AbstractResume</code>](#AbstractResume)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [tag] | <code>string</code> \| <code>int</code> | for marking the time position (second) of sound chunk which let the API to return the text position. It is important in dictation mode - to tell which part of form is correlated with sent sound. |
| [sentBlobSize] | <code>Array.&lt;float&gt;</code> | size (byte) of sent sound chunk |
| SessionId | <code>string</code> | ID of active session of sound listening |
| sectionId | <code>string</code> \| <code>int</code> | ID of active section |
| transcript | [<code>Transcript</code>](#Transcript) | Transcripted result from the API |
| isFinalTranscript | <code>Boolean</code> | true if the transcript response is final (ended). |


* [ResumeChild](#ResumeChild) &lArr; [<code>AbstractResume</code>](#AbstractResume)
    * [.getRecordTime()](#ResumeChild+getRecordTime) &lArr; <code>float</code>
    * [.getActiveSessionID()](#ResumeChild+getActiveSessionID) &lArr; <code>string</code>

<a name="ResumeChild+getRecordTime"></a>

### resumeChild.getRecordTime() &lArr; <code>float</code>
getRecordTime() get recorded time of actual session
  
**Kind**: instance method of [<code>ResumeChild</code>](#ResumeChild)  
**Returns**: <code>float</code> - recorded time in seconds  
<a name="ResumeChild+getActiveSessionID"></a>

### resumeChild.getActiveSessionID() &lArr; <code>string</code>
getActiveSessionID() get active session ID
  
**Kind**: instance method of [<code>ResumeChild</code>](#ResumeChild)  
**Returns**: <code>string</code> - active session ID  
<a name="ResumeRecorder"></a>

## ResumeRecorder
Class handling microphone and media recorder for Resume
  
**Kind**: global class  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [recorder] | <code>RecordRTC</code> |  | RecordRTC variable |
| [microphone] | <code>MediaStream</code> |  | Microphone variable |
| [alertError] | <code>Boolean</code> |  | call alert() if error |
| [msSoundChuck] | <code>float</code> | <code>1000</code> | time interval to send sound chunk to Socket.IO |


* [ResumeRecorder](#ResumeRecorder)
    * [.getStatus()](#ResumeRecorder+getStatus) &lArr; <code>string</code> \| <code>null</code>
    * [.pause()](#ResumeRecorder+pause)

<a name="ResumeRecorder+getStatus"></a>

### resumeRecorder.getStatus() &lArr; <code>string</code> \| <code>null</code>
Get status of recoder can be one of REC_PAUSED = "paused", REC_STOP = "stopped", REC_INACTIVE = "inactive", REC_RECORDING = "recording", REC_NULL = null
  
**Kind**: instance method of [<code>ResumeRecorder</code>](#ResumeRecorder)  
**Summary**: get status of recoder  
**Returns**: <code>string</code> \| <code>null</code> - recorder status null, "recording", "paused", "stopped" or "inactive".  
<a name="ResumeRecorder+pause"></a>

### resumeRecorder.pause()
pause the recorder
  
**Kind**: instance method of [<code>ResumeRecorder</code>](#ResumeRecorder)  
<a name="ResumeOne"></a>

## ResumeOne &lArr; [<code>ResumeChild</code>](#ResumeChild)
ResumeOne is a class to manage microphone and sound chunk streaming via socket.io
  
**Kind**: global class  
**Extends**: [<code>ResumeChild</code>](#ResumeChild)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| recorder | [<code>ResumeRecorder</code>](#ResumeRecorder) | object of resume recorder to manage microphone. |


* [ResumeOne](#ResumeOne) &lArr; [<code>ResumeChild</code>](#ResumeChild)
    * [new ResumeOne(socket, [resumeOption])](#new_ResumeOne_new)
    * _instance_
        * [.getStatus()](#ResumeOne+getStatus) &lArr; <code>string</code>
        * [.newSession([hint], identifier, sectionID, docFormat, [langSuggest])](#ResumeOne+newSession)
        * [.endSession([userTranscript], [callback])](#ResumeOne+endSession)
        * [.pause()](#ResumeOne+pause)
        * [.resume()](#ResumeOne+resume)
        * [.getRecordTime()](#ResumeChild+getRecordTime) &lArr; <code>float</code>
        * [.getActiveSessionID()](#ResumeChild+getActiveSessionID) &lArr; <code>string</code>
    * _static_
        * [.loadSectionList(urlSectionJSON)](#ResumeOne.loadSectionList) &lArr; <code>Promise</code>

<a name="new_ResumeOne_new"></a>

### new ResumeOne(socket, [resumeOption])
class constructor and set the event listener of socket.io


| Param | Type | Description |
| --- | --- | --- |
| socket | <code>Socket.IO</code> | Socket.IO client object, e.g. create from io(url,option) |
| [resumeOption] | [<code>RESUME\_DEFAULT\_OPTION</code>](#RESUME_DEFAULT_OPTION) \| <code>Object</code> | option for ResumeBase Class |

<a name="ResumeOne+getStatus"></a>

### resumeOne.getStatus() &lArr; <code>string</code>
getStatus() get status of recorder
  
**Kind**: instance method of [<code>ResumeOne</code>](#ResumeOne)  
**Returns**: <code>string</code> - recorder status as the `const REC_PAUSED = "paused", REC_STOP = "stopped", REC_INACTIVE = "inactive", REC_RECORDING = "recording", REC_NULL = null;`  
<a name="ResumeOne+newSession"></a>

### resumeOne.newSession([hint], identifier, sectionID, docFormat, [langSuggest])
newSession - tell the speech API to create new session ID and create recording object. Then the API will response to sessionID property
  
**Kind**: instance method of [<code>ResumeOne</code>](#ResumeOne)  
**Summary**: create new session ID which will be stored in sessionID property.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [hint] | <code>Array.&lt;string&gt;</code> \| <code>string</code> | <code></code> | hint for the voice-to-text transcripter |
| identifier | <code>\*</code> |  | the object of identification data of patients (Transaction number, Visit number, Admission number, Hospital number) and healthcare workers (for researching or other purposes of each organization). This data will store (in local not sent outside private network. |
| sectionID | <code>string</code> \| <code>int</code> |  | e.g. department number, section of organization name |
| docFormat | <code>string</code> |  | Format of document to let the speech-to-text API to generate returned data - reference the name from "C-CDA 1.1.0 on FHIR" otherwise will be "Default". Please read [README.md](../README.md) and http://hl7.org/fhir/us/ccda/artifacts.html |
| [langSuggest] | <code>Array.&lt;string&gt;</code> \| <code>string</code> |  | BCP-47 language code in string type or array of string type ordered by highest priority to suggest the speech-to-text API - the default is located in ./public/lang.json . See more detail of [BCP-47](https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers) |

<a name="ResumeOne+endSession"></a>

### resumeOne.endSession([userTranscript], [callback])
endSession(userTranscript, callback) - end the listening session, send user-filled form to the speech API (for R&D). Then the API will response to onReceiveFinalTranscript and onReceiveTranscript callable.
  
**Kind**: instance method of [<code>ResumeOne</code>](#ResumeOne)  
**Summary**: end the session, send form data to the API  

| Param | Type | Description |
| --- | --- | --- |
| [userTranscript] | <code>Object</code> | User-filled form data, should be followed the field name in "C-CDA 1.1.0 on FHIR" otherwise will be "other" - http://hl7.org/fhir/us/ccda/artifacts.html |
| [callback] | <code>callable</code> | to be called when the recorder javascript already stopped (already terminated microphone) and it do not wait for API response. |

<a name="ResumeOne+pause"></a>

### resumeOne.pause()
pause() - Pause the recording session if allowPause is true.
  
**Kind**: instance method of [<code>ResumeOne</code>](#ResumeOne)  
<a name="ResumeOne+resume"></a>

### resumeOne.resume()
resume() - Resume the paused session if allowPause is true.
  
**Kind**: instance method of [<code>ResumeOne</code>](#ResumeOne)  
<a name="ResumeChild+getRecordTime"></a>

### resumeOne.getRecordTime() &lArr; <code>float</code>
getRecordTime() get recorded time of actual session
  
**Kind**: instance method of [<code>ResumeOne</code>](#ResumeOne)  
**Overrides**: [<code>getRecordTime</code>](#ResumeChild+getRecordTime)  
**Returns**: <code>float</code> - recorded time in seconds  
<a name="ResumeChild+getActiveSessionID"></a>

### resumeOne.getActiveSessionID() &lArr; <code>string</code>
getActiveSessionID() get active session ID
  
**Kind**: instance method of [<code>ResumeOne</code>](#ResumeOne)  
**Overrides**: [<code>getActiveSessionID</code>](#ResumeChild+getActiveSessionID)  
**Returns**: <code>string</code> - active session ID  
<a name="ResumeOne.loadSectionList"></a>

### ResumeOne.loadSectionList(urlSectionJSON) &lArr; <code>Promise</code>
static loadSectionList(urlSectionJSON) - load preset section information in json file.
  
**Kind**: static method of [<code>ResumeOne</code>](#ResumeOne)  
**Returns**: <code>Promise</code> - Promise(response) from jQuery.get method - containing section information JSON data  

| Param | Type | Description |
| --- | --- | --- |
| urlSectionJSON | <code>string</code> \| <code>URL</code> | URL to preset section information |

<a name="EVENT_CLIENT_INIT"></a>

## EVENT\_CLIENT\_INIT : <code>string</code>
when Socket.IO client start to record
  
**Kind**: global constant  
<a name="EVENT_SERVER_SESSION_ID"></a>

## EVENT\_SERVER\_SESSION\_ID : <code>string</code>
when Socket.IO server response session ID
  
**Kind**: global constant  
<a name="STREAM_ERROR"></a>

## STREAM\_ERROR : <code>string</code>
when Socket.IO error occurs in server
  
**Kind**: global constant  
<a name="SS_AUDIO_STREAM"></a>

## SS\_AUDIO\_STREAM : <code>string</code>
when client streams sound to server
  
**Kind**: global constant  
<a name="SS_RESP_TRNSCR"></a>

## SS\_RESP\_TRNSCR : <code>string</code>
when server send transcript result back to client
  
**Kind**: global constant  
<a name="REC_PAUSED"></a>

## REC\_PAUSED : <code>string</code>
`REC_PAUSED = "paused";` when recorder is paused.
  
**Kind**: global constant  
<a name="REC_STOP"></a>

## REC\_STOP : <code>string</code>
`REC_STOP = "stopped";` when recorder is stopped.
  
**Kind**: global constant  
<a name="REC_INACTIVE"></a>

## REC\_INACTIVE : <code>string</code>
`REC_INACTIVE = "inactive";` when recorder is inactive.
  
**Kind**: global constant  
<a name="REC_RECORDING"></a>

## REC\_RECORDING : <code>string</code>
`REC_RECORDING = "recording";` when recorder is recording.
  
**Kind**: global constant  
<a name="REC_NULL"></a>

## REC\_NULL : <code>string</code>
`REC_NULL = null;` when recorder object is null or undefined.
  
**Kind**: global constant  
<a name="isFunc"></a>

## isFunc(obj) &lArr; <code>Boolean</code>
check if given object is function
  
**Kind**: global function  
**Returns**: <code>Boolean</code> - true if obj is function, otherwise false.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>\*</code> | object to be check |

<a name="SoundHistory"></a>

## SoundHistory : <code>Object</code>
History object argument of onRecorderStop
  
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| session_id | <code>string</code> | session ID. |
| identifier | <code>\*</code> | identification data for location, patients and practitioner |
| url | <code>URL</code> | Blob URL of total sound |
| blobsize | <code>int</code> | size of Blob |
| user_transcript | <code>object</code> | user-filled form data |

<a name="GroupText"></a>

## GroupText : <code>Object.&lt;string, Array.&lt;string&gt;&gt;</code>
Object contains keys - part of document following Terminology of "C-CDA 1.1.0 on FHIR resource profile" (see README.md), and values - array of sentences or pharse (join into one string). `{"problem_section":["This is sentence one.","more pharse here..."]}`
  
**Kind**: global typedef  
**Summary**: Object contains keys - part of document (as C-CDA on FHIR), and values - array of string.  
<a name="Transcript"></a>

## Transcript : <code>object</code>
Transcript response of sent sound from Resume API
  
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [RawTxt] | <code>Array.&lt;Array.&lt;string&gt;&gt;</code> | array of sentence. Each sentence is array of word. `[["This","is","first","sentence","."],["...","next","and","more"]]` |
| [RawSpk] | <code>Array.&lt;int&gt;</code> | array of speaker index correlated with sentence in RawTxt, starting from zero. |
| [MlGroupTxt] | [<code>GroupText</code>](#GroupText) | object of formatted and groupped text by Resume API Algorithm |
| [TagRawTxt] | [<code>GroupText</code>](#GroupText) | object of raw sentence groupped by client tag (`ResumeOne.tag`). |
| [user_transcript] | [<code>GroupText</code>](#GroupText) | object of user-input form data |

<a name="getIntermediateUserTranscript"></a>

## getIntermediateUserTranscript &lArr; [<code>GroupText</code>](#GroupText)
Callback to get intermediate user transcript in object, called when client send sound chunk to server.
  
**Kind**: global typedef  
**Returns**: [<code>GroupText</code>](#GroupText) - Object of user transcript  
<a name="onReceiveTranscript"></a>

## onReceiveTranscript : <code>function</code>
Callback to recieved intermediate and final result from server.
  
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| transcript | [<code>Transcript</code>](#Transcript) | object of transcript text from server in document format that set when client create new session ID. |
| isEnd | <code>Boolean</code> | true if this transcript is final and session close completely. |

<a name="onReceiveFinalTranscript"></a>

## onReceiveFinalTranscript : <code>function</code>
Callback to recieved final result from server.
  
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| transcript | [<code>Transcript</code>](#Transcript) | object of transcript text from server in document format that set when client create new session ID. |

<a name="onRecorderStop"></a>

## onRecorderStop : <code>function</code>
Callback to received record history when the voice recorder stopped
  
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| history | [<code>SoundHistory</code>](#SoundHistory) | Object of history |

<a name="onError"></a>

## onError : <code>function</code>
Callback to be called when error occurs
  
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>Object</code> \| <code>string</code> | error object or error message string. |


-------
&copy; 2021 - copyright by Tanapat Kahabodeekanokkul - the founder of `RESUME`.