# Resume REST API Connector ::  Resume-REST-API-Connect.js
Node.JS module for HTTPS RESTful Resume API Client

<a name="module_Resume-REST-API-Connect"></a>

## Resume-REST-API-Connect

- [Resume REST API Connector ::  Resume-REST-API-Connect.js](#resume-rest-api-connector---resume-rest-api-connectjs)
  - [Resume-REST-API-Connect](#resume-rest-api-connect)
    - [Resume-REST-API-Connect~ResumeHttpAPIClient](#resume-rest-api-connectresumehttpapiclient)
      - [new ResumeHttpAPIClient([host], [username], [password])](#new-resumehttpapiclienthost-username-password)
      - [resumeHttpAPIClient.test()](#resumehttpapiclienttest)
      - [resumeHttpAPIClient.newSession() ⇒ <code>Promise.&lt;ResumeSessionResponse&gt;</code>](#resumehttpapiclientnewsession--promiseresumesessionresponse)
      - [resumeHttpAPIClient.sendSound(sessionId, sectionID, info, soundStream, cookies) ⇒ <code>Promise.&lt;ResumeSoundInfo&gt;</code>](#resumehttpapiclientsendsoundsessionid-sectionid-info-soundstream-cookies--promiseresumesoundinfo)
      - [resumeHttpAPIClient.updateResult(sessionId, sectionID, [lastUpdate], cookies) ⇒ <code>Promise.&lt;ResumeSoundInfo&gt;</code>](#resumehttpapiclientupdateresultsessionid-sectionid-lastupdate-cookies--promiseresumesoundinfo)
      - [ResumeHttpAPIClient.responseResolve(res) ⇒ <code>ResumeSoundInfo</code>](#resumehttpapiclientresponseresolveres--resumesoundinfo)
    - [Resume-REST-API-Connect~ResumeNewSessionData](#resume-rest-api-connectresumenewsessiondata)
    - [Resume-REST-API-Connect~GroupText : <code>Object.&lt;string, Array.&lt;string&gt;&gt;</code>](#resume-rest-api-connectgrouptext--objectstring-arraystring)
    - [Resume-REST-API-Connect~Transcript : <code>object</code>](#resume-rest-api-connecttranscript--object)
    - [Resume-REST-API-Connect~ResumeSoundInfo : <code>object</code>](#resume-rest-api-connectresumesoundinfo--object)
    - [Resume-REST-API-Connect~ResumeSessionResponse](#resume-rest-api-connectresumesessionresponse)

<a name="module_Resume-REST-API-Connect..ResumeHttpAPIClient"></a>

### Resume-REST-API-Connect~ResumeHttpAPIClient
Class for connect Resume API via HTTPS/1.1 REST API

**Kind**: inner class of [<code>Resume-REST-API-Connect</code>](#module_Resume-REST-API-Connect)

- [Resume REST API Connector ::  Resume-REST-API-Connect.js](#resume-rest-api-connector---resume-rest-api-connectjs)
  - [Resume-REST-API-Connect](#resume-rest-api-connect)
    - [Resume-REST-API-Connect~ResumeHttpAPIClient](#resume-rest-api-connectresumehttpapiclient)
      - [new ResumeHttpAPIClient([host], [username], [password])](#new-resumehttpapiclienthost-username-password)
      - [resumeHttpAPIClient.test()](#resumehttpapiclienttest)
      - [resumeHttpAPIClient.newSession() ⇒ <code>Promise.&lt;ResumeSessionResponse&gt;</code>](#resumehttpapiclientnewsession--promiseresumesessionresponse)
      - [resumeHttpAPIClient.sendSound(sessionId, sectionID, info, soundStream, cookies) ⇒ <code>Promise.&lt;ResumeSoundInfo&gt;</code>](#resumehttpapiclientsendsoundsessionid-sectionid-info-soundstream-cookies--promiseresumesoundinfo)
      - [resumeHttpAPIClient.updateResult(sessionId, sectionID, [lastUpdate], cookies) ⇒ <code>Promise.&lt;ResumeSoundInfo&gt;</code>](#resumehttpapiclientupdateresultsessionid-sectionid-lastupdate-cookies--promiseresumesoundinfo)
      - [ResumeHttpAPIClient.responseResolve(res) ⇒ <code>ResumeSoundInfo</code>](#resumehttpapiclientresponseresolveres--resumesoundinfo)
    - [Resume-REST-API-Connect~ResumeNewSessionData](#resume-rest-api-connectresumenewsessiondata)
    - [Resume-REST-API-Connect~GroupText : <code>Object.&lt;string, Array.&lt;string&gt;&gt;</code>](#resume-rest-api-connectgrouptext--objectstring-arraystring)
    - [Resume-REST-API-Connect~Transcript : <code>object</code>](#resume-rest-api-connecttranscript--object)
    - [Resume-REST-API-Connect~ResumeSoundInfo : <code>object</code>](#resume-rest-api-connectresumesoundinfo--object)
    - [Resume-REST-API-Connect~ResumeSessionResponse](#resume-rest-api-connectresumesessionresponse)

<a name="new_module_Resume-REST-API-Connect..ResumeHttpAPIClient_new"></a>

#### new ResumeHttpAPIClient([host], [username], [password])
Create ResumeHttpAPIClient


| Param | Type | Description |
| --- | --- | --- |
| [host] | <code>string</code> | full host path for Resume API (https://resume.sati.co.th) |
| [username] | <code>string</code> | API username if leave blank Resume will load from credentials.json or environmental variable by config.js |
| [password] | <code>string</code> | API password if leave blank Resume will load from credentials.json or environmental variable by config.js |

<a name="module_Resume-REST-API-Connect..ResumeHttpAPIClient+test"></a>

#### resumeHttpAPIClient.test()
Test Resume API connection

**Kind**: instance method of [<code>ResumeHttpAPIClient</code>](#module_Resume-REST-API-Connect..ResumeHttpAPIClient)
<a name="module_Resume-REST-API-Connect..ResumeHttpAPIClient+newSession"></a>

#### resumeHttpAPIClient.newSession() ⇒ <code>Promise.&lt;ResumeSessionResponse&gt;</code>
Request new Resume Transcript Session from Resume API.

**Kind**: instance method of [<code>ResumeHttpAPIClient</code>](#module_Resume-REST-API-Connect..ResumeHttpAPIClient)
**Returns**: <code>Promise.&lt;ResumeSessionResponse&gt;</code> - Promise object of Session ID
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| sectionId | <code>int</code> \| <code>string</code> | ID of section e.g. department number, section of organization name |
| lang | <code>Array.&lt;string&gt;</code> | language hints must be BCP-47 language code in string type or array of string type ordered by highest priority to suggest the speech-to-text API - the default is located in ./public/lang.json . See more detail of [BCP-47](https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers) |
| docFormat | <code>string</code> | Format of document to let the speech-to-text API to generate returned data - reference the name from "C-CDA 1.1.0 on FHIR" otherwise will be "Default". Please read [README.md](../README.md) and http://hl7.org/fhir/us/ccda/artifacts.html |
| multiSpeaker | <code>Boolean</code> | mode of transcription automatically given from ResumeOne().newSession(...) |
| userStartTime | <code>Date</code> | session starting datetime automatically given from ResumeOne().newSession(...) |

<a name="module_Resume-REST-API-Connect..ResumeHttpAPIClient+sendSound"></a>

#### resumeHttpAPIClient.sendSound(sessionId, sectionID, info, soundStream, cookies) ⇒ <code>Promise.&lt;ResumeSoundInfo&gt;</code>
Send sound chunk to Resume API

**Kind**: instance method of [<code>ResumeHttpAPIClient</code>](#module_Resume-REST-API-Connect..ResumeHttpAPIClient)
**Returns**: <code>Promise.&lt;ResumeSoundInfo&gt;</code> - Promise object of ResumeSoundInfo from Resume API

| Param | Type | Description |
| --- | --- | --- |
| sessionId | <code>string</code> | Resume API Session ID from newSession method |
| sectionID | <code>string</code> \| <code>int</code> | ID of section e.g. department number, section of organization name |
| info | <code>ResumeSoundInfo</code> | sound chunk information for Resume API |
| soundStream | <code>Blob</code> | chunk of sound in WAV format |
| cookies | <code>string</code> | HTTP header-encoded cookies string from newSession return, important for Resume API server process |

<a name="module_Resume-REST-API-Connect..ResumeHttpAPIClient+updateResult"></a>

#### resumeHttpAPIClient.updateResult(sessionId, sectionID, [lastUpdate], cookies) ⇒ <code>Promise.&lt;ResumeSoundInfo&gt;</code>
Request for Resume API transcription result

**Kind**: instance method of [<code>ResumeHttpAPIClient</code>](#module_Resume-REST-API-Connect..ResumeHttpAPIClient)
**Returns**: <code>Promise.&lt;ResumeSoundInfo&gt;</code> - Promise object of ResumeSoundInfo from Resume API, **null** if there is no new update for lastUpdate time.

| Param | Type | Description |
| --- | --- | --- |
| sessionId | <code>string</code> | Resume API Session ID from newSession method |
| sectionID | <code>string</code> \| <code>int</code> | ID of section e.g. department number, section of organization name |
| [lastUpdate] | <code>Date</code> | Last update datetime if user has caching. |
| cookies | <code>string</code> | HTTP header-encoded cookies string from newSession return, important for Resume API server process |

<a name="module_Resume-REST-API-Connect..ResumeHttpAPIClient.responseResolve"></a>

#### ResumeHttpAPIClient.responseResolve(res) ⇒ <code>ResumeSoundInfo</code>
Process Response from Resume HTTP REST API

**Kind**: static method of [<code>ResumeHttpAPIClient</code>](#module_Resume-REST-API-Connect..ResumeHttpAPIClient)
**Returns**: <code>ResumeSoundInfo</code> - response from Resume API

| Param | Type | Description |
| --- | --- | --- |
| res | <code>AxiosResponse</code> | AxiosResponse object |

<a name="module_Resume-REST-API-Connect..ResumeNewSessionData"></a>

### Resume-REST-API-Connect~ResumeNewSessionData
Response data in ResumeSessionResponse

**Kind**: inner typedef of [<code>Resume-REST-API-Connect</code>](#module_Resume-REST-API-Connect)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| session_id | <code>string</code> | Session ID of Resume Transcription API |
| section_id | <code>string</code> \| <code>int</code> | Section ID given by user, response for feedback checking |

<a name="module_Resume-REST-API-Connect..GroupText"></a>

### Resume-REST-API-Connect~GroupText : <code>Object.&lt;string, Array.&lt;string&gt;&gt;</code>
Object contains keys - part of document following Terminology of "C-CDA 1.1.0 on FHIR resource profile" (see README.md), and values - array of sentences or pharse (join into one string). `{"problem_section":["This is sentence one.","more pharse here..."]}`

**Kind**: inner typedef of [<code>Resume-REST-API-Connect</code>](#module_Resume-REST-API-Connect)
**Summary**: Object contains keys - part of document (as C-CDA on FHIR), and values - array of string.
<a name="module_Resume-REST-API-Connect..Transcript"></a>

### Resume-REST-API-Connect~Transcript : <code>object</code>
Transcript response of sent sound from Resume API

**Kind**: inner typedef of [<code>Resume-REST-API-Connect</code>](#module_Resume-REST-API-Connect)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [RawTxt] | <code>Array.&lt;Array.&lt;string&gt;&gt;</code> | array of sentence. Each sentence is array of word. `[["This","is","first","sentence","."],["...","next","and","more"]]` |
| [RawSpk] | <code>Array.&lt;int&gt;</code> | array of speaker index correlated with sentence in RawTxt, starting from zero. |
| [MlGroupTxt] | <code>GroupText</code> | object of formatted and groupped text by Resume API Algorithm |
| [TagRawTxt] | <code>GroupText</code> | object of raw sentence groupped by client tag (`ResumeOne.tag`). |
| [user_transcript] | <code>GroupText</code> | object of user-input form data |

<a name="module_Resume-REST-API-Connect..ResumeSoundInfo"></a>

### Resume-REST-API-Connect~ResumeSoundInfo : <code>object</code>
Main format for sound chunk request and Transcript response of sent sound from Resume API

**Kind**: inner typedef of [<code>Resume-REST-API-Connect</code>](#module_Resume-REST-API-Connect)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [RawTxt] | <code>Array.&lt;Array.&lt;string&gt;&gt;</code> | array of sentence. Each sentence is array of word. `[["This","is","first","sentence","."],["...","next","and","more"]]` |
| datetime | <code>Date</code> | datetime that Resume.js send chunk of sound |
| is_end | <code>Boolean</code> | true if user or Resume.js end the transcription Resume session |
| [tag] | <code>string</code> | tag (form input name) used in Dictation or Combination mode should correlate Terminology of "C-CDA 1.1.0 on FHIR resource profile" (see README.md) |
| [_id] | <code>Array.&lt;int&gt;</code> | array of sound chunk index |
| [user_transcript] | <code>GroupText</code> | object of user-input form data |

<a name="module_Resume-REST-API-Connect..ResumeSessionResponse"></a>

### Resume-REST-API-Connect~ResumeSessionResponse
Returns from newSession method

**Kind**: inner typedef of [<code>Resume-REST-API-Connect</code>](#module_Resume-REST-API-Connect)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| status | <code>int</code> | HTTP response status |
| data | <code>ResumeNewSessionData</code> | response from Resume API containing session id and its information |
| clientStartTime | <code>Date</code> | time that function called in server-sided Node.JS (client of API) |
| userStartTime | <code>Date</code> | time that user (client-sided JavaScript) requests new Resume Session ID |
| [pseudoIdentifier] | <code>string</code> | fake (pseudo) identifier generated by Resume REST API Client and sent to server |
| cookies | <code>string</code> | HTTP header-encoded cookies string that Resume API responses. It must be included in consequenct resquest in same Session ID. Because it is important for API server routing. |
  
  
-------
&copy; 2021 - copyright by Tanapat Kahabodeekanokkul - the founder of `RESUME`.