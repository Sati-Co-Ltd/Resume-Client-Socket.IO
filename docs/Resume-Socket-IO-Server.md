#  Resume Socket.IO Server :: Resume-Socket-IO-Server.js
Server-sided Node.JS for Resume API and Socket.IO Server management

<a name="module_Resume-Socket-IO-Server"></a>

## Resume-Socket-IO-Server

- [Resume Socket.IO Server :: Resume-Socket-IO-Server.js](#resume-socketio-server--resume-socket-io-serverjs)
  - [Resume-Socket-IO-Server](#resume-socket-io-server)
    - [Resume-Socket-IO-Server~OptionSIO](#resume-socket-io-serveroptionsio)
      - [new OptionSIO([onConnectionCallback], [onDisconnectCallback], [onNewTranscriptSessionSyncCheck], [onNewTranscriptSessionCallback], [onReceivedTranscriptionSessionID], [onEndTranscriptSessionCallback], [onReceivedEndTranscriptSessionCallback], [onReceivedSoundCallback])](#new-optionsioonconnectioncallback-ondisconnectcallback-onnewtranscriptsessionsynccheck-onnewtranscriptsessioncallback-onreceivedtranscriptionsessionid-onendtranscriptsessioncallback-onreceivedendtranscriptsessioncallback-onreceivedsoundcallback)
    - [Resume-Socket-IO-Server~OptionBindSIO](#resume-socket-io-serveroptionbindsio)
      - [new OptionBindSIO([server], [io], [nameSpace], [ioOptions], [port])](#new-optionbindsioserver-io-namespace-iooptions-port)
    - [Resume-Socket-IO-Server~newResumeSessionSyncCheck(socket) ⇒ <code>Boolean</code>](#resume-socket-io-servernewresumesessionsyncchecksocket--boolean)
    - [Resume-Socket-IO-Server~BindSIO(optionBindSIO, optionSIO) ⇒ <code>Server</code>](#resume-socket-io-serverbindsiooptionbindsio-optionsio--server)
    - [Resume-Socket-IO-Server~SIOOnConnection(optionSIO) ⇒ <code>SIOOnConnectionFunction</code>](#resume-socket-io-serversioonconnectionoptionsio--sioonconnectionfunction)
    - [Resume-Socket-IO-Server~ParamSessionID : <code>Object</code>](#resume-socket-io-serverparamsessionid--object)
    - [Resume-Socket-IO-Server~socketSIOOnConnection : <code>function</code>](#resume-socket-io-serversocketsioonconnection--function)
    - [Resume-Socket-IO-Server~sessionSIOOnConnection : <code>function</code>](#resume-socket-io-serversessionsioonconnection--function)
    - [Resume-Socket-IO-Server~receivedEndTranscriptSessionCallback : <code>function</code>](#resume-socket-io-serverreceivedendtranscriptsessioncallback--function)
    - [Resume-Socket-IO-Server~endTranscriptSessionCallback : <code>function</code>](#resume-socket-io-serverendtranscriptsessioncallback--function)
    - [Resume-Socket-IO-Server~receivedSoundCallback : <code>function</code>](#resume-socket-io-serverreceivedsoundcallback--function)
    - [Resume-Socket-IO-Server~SIOOnConnectionFunction : <code>function</code>](#resume-socket-io-serversioonconnectionfunction--function)

<a name="module_Resume-Socket-IO-Server..OptionSIO"></a>

### Resume-Socket-IO-Server~OptionSIO
**Kind**: inner class of [<code>Resume-Socket-IO-Server</code>](#module_Resume-Socket-IO-Server)
<a name="new_module_Resume-Socket-IO-Server..OptionSIO_new"></a>

#### new OptionSIO([onConnectionCallback], [onDisconnectCallback], [onNewTranscriptSessionSyncCheck], [onNewTranscriptSessionCallback], [onReceivedTranscriptionSessionID], [onEndTranscriptSessionCallback], [onReceivedEndTranscriptSessionCallback], [onReceivedSoundCallback])
OptionSIO class is the optional template for SIOOnConnection function


| Param | Type | Description |
| --- | --- | --- |
| [onConnectionCallback] | <code>socketSIOOnConnection</code> | Callback when Socket.io on('connection') |
| [onDisconnectCallback] | <code>socketSIOOnConnection</code> | Callback when Socket.io on('disconnection') |
| [onNewTranscriptSessionSyncCheck] | <code>newResumeSessionSyncCheck</code> | function called when client request for new Resume Session to check the the session before send to Resume API - return true if valid |
| [onNewTranscriptSessionCallback] | <code>sessionSIOOnConnection</code> | Callback when request for new Resume Session pass the onNewTranscriptSessionSyncCheck validation |
| [onReceivedTranscriptionSessionID] | <code>sessionSIOOnConnection</code> | Callback when API response new Resume Session ID |
| [onEndTranscriptSessionCallback] | <code>endTranscriptSessionCallback</code> | Callback when Resume.js client end the Resume session |
| [onReceivedEndTranscriptSessionCallback] | <code>receivedEndTranscriptSessionCallback</code> | Callback Resume API response that the session ended |     
| [onReceivedSoundCallback] | <code>receivedSoundCallback</code> | Callback when Resume Received sound chunk |

<a name="module_Resume-Socket-IO-Server..OptionBindSIO"></a>

### Resume-Socket-IO-Server~OptionBindSIO
**Kind**: inner class of [<code>Resume-Socket-IO-Server</code>](#module_Resume-Socket-IO-Server)
<a name="new_module_Resume-Socket-IO-Server..OptionBindSIO_new"></a>

#### new OptionBindSIO([server], [io], [nameSpace], [ioOptions], [port])
OptionBindSIO class is the optional template for BindSIO function


| Param | Type | Description |
| --- | --- | --- |
| [server] | <code>http</code> \| <code>https</code> \| <code>http2</code> | HTTP, HTTPS, or HTTP/2 server object |
| [io] | <code>Server</code> | Socket.IO Server object  - const io = require("socket.io")(); |
| [nameSpace] | <code>string</code> | optional namespace for Socket.IO |
| [ioOptions] | <code>object</code> | option for create Socket.IO server if io is undefined. |
| [port] | <code>int</code> | port for create Socket.IO server if io is undefined. |

<a name="module_Resume-Socket-IO-Server..newResumeSessionSyncCheck"></a>

### Resume-Socket-IO-Server~newResumeSessionSyncCheck(socket) ⇒ <code>Boolean</code>
The function called on new Session to check the Resume Session

**Kind**: inner method of [<code>Resume-Socket-IO-Server</code>](#module_Resume-Socket-IO-Server)
**Returns**: <code>Boolean</code> - return true if Socket Session connnection is Valid

| Param | Type | Description |
| --- | --- | --- |
| socket | <code>Socket</code> | Socket.IO socket parameter from io.on("connection", (socket) => {   }); |

<a name="module_Resume-Socket-IO-Server..BindSIO"></a>

### Resume-Socket-IO-Server~BindSIO(optionBindSIO, optionSIO) ⇒ <code>Server</code>
Bind Resume Server-sided script to Socket.IO as optionBindSIO.nameSpace or root. If optionBindSIO.io is defined the function binds to io directly. Else if 
optionBindSIO.server is given, the function creates Socket.IO server and attaches to the server. Else, the function creates Socket.IO by given ports or optionBindSIO.ioOptions.

**Kind**: inner method of [<code>Resume-Socket-IO-Server</code>](#module_Resume-Socket-IO-Server)
**Summary**: Bind Resume Server-sided script to Socket.IO as optionBindSIO.nameSpace or root.
**Returns**: <code>Server</code> - Socket.IO Server object

| Param | Type | Description |
| --- | --- | --- |
| optionBindSIO | <code>OptionBindSIO</code> | Option for server binding |
| optionSIO | <code>OptionSIO</code> | option for Resume server-sided script. |

<a name="module_Resume-Socket-IO-Server..SIOOnConnection"></a>

### Resume-Socket-IO-Server~SIOOnConnection(optionSIO) ⇒ <code>SIOOnConnectionFunction</code>
Generate Resume Server-sided Callback for io.on('connection')

**Kind**: inner method of [<code>Resume-Socket-IO-Server</code>](#module_Resume-Socket-IO-Server)
**Returns**: <code>SIOOnConnectionFunction</code> - function for  io.on('connection')

| Param | Type | Description |
| --- | --- | --- |
| optionSIO | <code>OptionSIO</code> | option for Resume server-sided script. |

<a name="module_Resume-Socket-IO-Server..ParamSessionID"></a>

### Resume-Socket-IO-Server~ParamSessionID : <code>Object</code>
The parameters of new session id event

**Kind**: inner typedef of [<code>Resume-Socket-IO-Server</code>](#module_Resume-Socket-IO-Server)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| socket | <code>Socket</code> | Socket.IO from io.on("connection", (socket) => {   }); |
| [sessionID] | <code>string</code> | Resume SessionID |
| [pseudoIdentifier] | <code>string</code> | fake (pseudo) identifier generated by Resume REST API Client and sent to server |
| identifier | <code>\*</code> | the object of identification data of patients given from ResumeOne().newSession(...) - (Transaction number, Visit number, Admission number, Hospital number) and healthcare workers (for researching or other purposes of each organization). This data will store (in local not sent outside private network. |
| sectionId | <code>int</code> \| <code>string</code> | ID of section e.g. department number, section of organization name, given from ResumeOne().newSession(...) |
| lang | <code>Array.&lt;string&gt;</code> | language hints given from ResumeOne().newSession(...) must be BCP-47 language code in string type or array of string type ordered by highest priority to suggest the speech-to-text API - the default is located in ./public/lang.json . See more detail of [BCP-47](https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers) |
| docFormat | <code>string</code> | Format of document given from ResumeOne().newSession(...) to let the speech-to-text API to generate returned data - reference the name from "C-CDA 1.1.0 on FHIR" otherwise will be "Default". Please read [README.md](../README.md) and http://hl7.org/fhir/us/ccda/artifacts.html |
| multiSpeaker | <code>Boolean</code> | mode of transcription automatically given from ResumeOne().newSession(...) |
| userStartTime | <code>Date</code> | session starting datetime automatically given from ResumeOne().newSession(...) |

<a name="module_Resume-Socket-IO-Server..socketSIOOnConnection"></a>

### Resume-Socket-IO-Server~socketSIOOnConnection : <code>function</code>
The Socket.IO SIOOnConnection callback

**Kind**: inner typedef of [<code>Resume-Socket-IO-Server</code>](#module_Resume-Socket-IO-Server)

| Param | Type | Description |
| --- | --- | --- |
| socket | <code>Socket</code> | Socket.IO socket parameter from io.on("connection", (socket) => {   }); |

<a name="module_Resume-Socket-IO-Server..sessionSIOOnConnection"></a>

### Resume-Socket-IO-Server~sessionSIOOnConnection : <code>function</code>
The Resume Session SIOOnConnection callback

**Kind**: inner typedef of [<code>Resume-Socket-IO-Server</code>](#module_Resume-Socket-IO-Server)

| Param | Type | Description |
| --- | --- | --- |
| paramSessionID | <code>ParamSessionID</code> | ParamSessionID |

<a name="module_Resume-Socket-IO-Server..receivedEndTranscriptSessionCallback"></a>

### Resume-Socket-IO-Server~receivedEndTranscriptSessionCallback : <code>function</code>
The callback Resume API response that the session ended

**Kind**: inner typedef of [<code>Resume-Socket-IO-Server</code>](#module_Resume-Socket-IO-Server)

| Param | Type | Description |
| --- | --- | --- |
| socket | <code>Socket</code> | Socket.IO socket parameter from io.on("connection", (socket) => {   }); |
| sessionID | <code>string</code> | Resume SessionID |
| sectionId | <code>int</code> \| <code>string</code> | ID of section e.g. department number, section of organization name, given from ResumeOne().newSession(...) |
| transcript | <code>Resume-REST-API-Connect~Transcript</code> | Transcript response of sent sound from Resume API |

<a name="module_Resume-Socket-IO-Server..endTranscriptSessionCallback"></a>

### Resume-Socket-IO-Server~endTranscriptSessionCallback : <code>function</code>
The callback Resume API response that the session ended

**Kind**: inner typedef of [<code>Resume-Socket-IO-Server</code>](#module_Resume-Socket-IO-Server)

| Param | Type | Description |
| --- | --- | --- |
| socket | <code>Socket</code> | Socket.IO socket parameter from io.on("connection", (socket) => {   }); |
| sessionID | <code>string</code> | Resume SessionID |
| sectionId | <code>int</code> \| <code>string</code> | ID of section e.g. department number, section of organization name, given from ResumeOne().newSession(...) |
| info | <code>Resume-REST-API-Connect~ResumeSoundInfo</code> | Information from Resume.js client to sent to Resume API |

<a name="module_Resume-Socket-IO-Server..receivedSoundCallback"></a>

### Resume-Socket-IO-Server~receivedSoundCallback : <code>function</code>
The callback when Resume Received sound chunk

**Kind**: inner typedef of [<code>Resume-Socket-IO-Server</code>](#module_Resume-Socket-IO-Server)

| Param | Type | Description |
| --- | --- | --- |
| socket | <code>Socket</code> | Socket.IO socket parameter from io.on("connection", (socket) => {   }); |
| sessionID | <code>string</code> | Resume SessionID |
| sectionId | <code>int</code> \| <code>string</code> | ID of section e.g. department number, section of organization name, given from ResumeOne().newSession(...) |
| [blob] | <code>Blob</code> | Blob object of sound chunk from Resume.js |
| info | <code>Resume-REST-API-Connect~ResumeSoundInfo</code> | Information from Resume.js client to sent to Resume API |

<a name="module_Resume-Socket-IO-Server..SIOOnConnectionFunction"></a>

### Resume-Socket-IO-Server~SIOOnConnectionFunction : <code>function</code>
**Kind**: inner typedef of [<code>Resume-Socket-IO-Server</code>](#module_Resume-Socket-IO-Server)

| Param | Type | Description |
| --- | --- | --- |
| socket | <code>Socket</code> | Socket.IO socket object |
  
  
-------
&copy; 2021 - copyright by Tanapat Kahabodeekanokkul - the founder of `RESUME`.