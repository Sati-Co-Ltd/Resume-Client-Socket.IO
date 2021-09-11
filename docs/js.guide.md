# Guide for Javascript and Node.js Client

- [Guide for Javascript and Node.js Client](#guide-for-javascript-and-nodejs-client)
  - [Conclusion of different](#conclusion-of-different)
  - [Conversation Mode](#conversation-mode)
    - [Prepare HTML page for script <a name="prepare"></a>](#prepare-html-page-for-script-)
    - [Write essential callbacks <a name="conv-call"></a>](#write-essential-callbacks-)
    - [Create `Socket.IO` client and `ResumeOne` object <a name="conv-create"></a>](#create-socketio-client-and-resumeone-object-)
    - [Start new session for recording](#start-new-session-for-recording)
    - [Pause and Resume](#pause-and-resume)
    - [Update the Result](#update-the-result)
    - [Stop recording and End session <a name="end-sess"></a>](#stop-recording-and-end-session-)
  - [Dictation Mode <a name="dictate"></a>](#dictation-mode-)
    - [Prepare HTML page for script](#prepare-html-page-for-script)
    - [Write essential callbacks <a name="dict-call"></a>](#write-essential-callbacks--1)
    - [Create `Socket.IO` client and `ResumeOne` object <a name="dict-create"></a>](#create-socketio-client-and-resumeone-object--1)
    - [Start new session for recording <a name="dict-start"></a>](#start-new-session-for-recording-)
    - [Pause, Resume  and Stop recording and End session <a name="dict-control"></a>](#pause-resume--and-stop-recording-and-end-session-)
    - [Update the Result  <a name="dict-update"></a>](#update-the-result--)
  - [Combinatory Conversation-Dictation Mode](#combinatory-conversation-dictation-mode)
    - [Prepare HTML page for script](#prepare-html-page-for-script-1)
    - [Write essential callbacks](#write-essential-callbacks)
    - [Create `Socket.IO` client and `ResumeOne` object](#create-socketio-client-and-resumeone-object)
    - [Start new session for recording](#start-new-session-for-recording-1)
    - [Pause, Resume  and Stop recording and End session](#pause-resume--and-stop-recording-and-end-session)
    - [Update the Result](#update-the-result-1)
  - [More Information](#more-information)
   
## Conclusion of different

| Part                                                                                                                                                                                                   | Conversation Mode                                                        | Dictation Mode                                                                                                | Combinatory Mode                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **Prepare HTML page for script**                                                                                                                                                                       | [All are same.](#prepare)                                                | [All are same.](#prepare)                                                                                     | [All are same.](#prepare)                  |
| **Object callbacks and get updated [`transcript` result](Resume.js.md#Transcript)**                                                                                                                    | have only [`MlGroupTxt`](Resume.js.md#GroupText) - [details](#conv-call) | both [`MlGroupTxt`](Resume.js.md#GroupText) and [`TagRawTxt`](Resume.js.md#GroupText) - [details](#dict-call) | same to [Dictation Mode](#dict-call)       |
| **Value of [`multiSpeaker` key](Resume.js.md#RESUME_DEFAULT_OPTION) of [`resumeOption` argument](Resume.js.md#new-resumeonesocket-resumeoption) in [`ResumeOne`](Resume.js.md#ResumeOne) constructor** | [`true`](#conv-create)                                                   | ***[`false`](#dict-create)***                                                                                 | [`true`](#conv-create)                     |
| **Need to set [`tag` property](Resume.js.md#ResumeChild) before start and change input field**                                                                                                         | No                                                                       | Yes: [before start](#dict-start) and [change input form](#dict-control)                                       | Yes: same to [Dictation Mode](#dict-start) |
| **Ending session**                                                                                                                                                                                     | Only if **[change patients or close windows](#end-sess)**                | same to [Conversation Mode](#end-sess)                                                                        | same to [Conversation Mode](#end-sess)     |

  
  <br/>


## Conversation Mode
The Resume will listen to your conversation and rearrange into document format.

### Prepare HTML page for script <a name="prepare"></a>
`ResumeOne` requires [RecordRTC](https://github.com/muaz-khan/RecordRTC) to control microphone, [Socket.IO](https://socket.io/) to connect with server and [jQuery](https://jquery.com/) if you want to use [`ResumeOne.loadSectionList()`](public/js/Resume.js) method.
```HTML
<head>
    <!-- Other tags -->

    <script src="./js/jquery.min.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script src="./js/Resume.js"></script>

    <!-- more other tags -->
</head>
<body>
    <!-- Other tags -->

    <script src="./js/RecordRTC.min.js"></script>
    <!-- Your script here -->
</body>
```


  

### Write essential callbacks <a name="conv-call"></a>
Write callbacks for [`getIntermediateUserTranscript`](Resume.js.md#getIntermediateUserTranscript) and [`onReceiveTranscript`](Resume.js.md#onReceiveTranscript)   

The return object from [`getIntermediateUserTranscript`](Resume.js.md#getIntermediateUserTranscript) should follow [the Name of "C-CDA 1.1.0 on FHIR resource profile"](../README.md#freq-doc). Also, the [`MlGroupTxt`](Resume.js.md#GroupText) key of [transcript](Resume.js.md#Transcript) argument of [`onReceiveTranscript`](Resume.js.md#onReceiveTranscript) is the object which keys' name follow the [Terminology of "C-CDA 1.1.0 on FHIR resource profile"](../README.md#freq-doc).  

The [`MlGroupTxt`](Resume.js.md#GroupText) key contains array of formatted string - could be sentence or pharse (`["This is sentence one.","next pharse","It can be pharse or sentence.","..."]`). please read [Resume.js.md](Resume.js.md#GroupText) for more details.
  
For more information about ["C-CDA 1.1.0 on FHIR resource profile"](http://hl7.org/fhir/us/ccda/artifacts.html#structures-resource-profiles), please see [README.md](../README.md#freq-doc).    

```JS
function _getUserTranscribe () {
    // this format follows C-CDA, http://hl7.org/fhir/us/ccda/artifacts.html#structures-resource-profiles  .
    return {
        chief_complaint_section: this.CC,
        history_of_present_illness_section: this.PI,
        past_medical_history_section: this.PHx,
        problem_section: this.Dx,
        follow_up_section: this.FU
    };
}
function _onReceiveTranscript (transcript, isEnd) {
    log('Recieved Transcript.. ' + JSON.stringify(transcript));
    if (isEnd) {
        // Action when API stop session completely.
    }
    if (transcript.MlGroupTxt) {
        // The response will have keys like the Terminology of "C-CDA 1.1.0 on FHIR resource profile".
        rPI = transcript.MlGroupTxt.history_of_present_illness_section;
        // and more field rPHx = transcript.MlGroupTxt.......

        rPI.push(...transcript.TagRawTxt.other);
        // More code here
        ////

    }
}
```


### Create `Socket.IO` client and `ResumeOne` object <a name="conv-create"></a>
Place [`ResumeOne`](Resume.js.md#ResumeOne) object construction in callback after loading page. The [`resumeOption`](Resume.js.md#new-resumeonesocket-resumeoption) argument should follow [`RESUME_DEFAULT_OPTION`](Resume.js.md#RESUME_DEFAULT_OPTION) object.

```JS
var socket = io();

//// If you use Socket.IO server from different Domain or Path,
//// Please check out  https://socket.io/docs/v4/client-initialization/#From-a-different-domain .

///
/// in completely loaded callback
var resume = new ResumeOne(socket,
    {
        getIntermediateUserTranscript: _getUserTranscribe,  // from above
        onReceiveTranscript: this._onReceiveTranscript,   // from above
        multiSpeaker: true   // this is conversation Mode!
    });
```
  

### Start new session for recording
When user trigers start event, the [`ResumeOne.newSession`](Resume.js.md#resumeonenewsessionhint-identifier-sectionid-docformat-langsuggest) will obtain new Session ID from `Resume API`, concurrently  initiate [microphone recorder](Resume.js.md#ResumeRecorder).
```JS
// under start callback
resume.newSession(Hint,
    { HN: HN, TXN: TXN, Practioner: Practioner, Location:Location }, // Patient and Healthcare worker identifier for sending to local logging server, Not send to Resume API publically.
    sectionID, // Section to logging on Resume usage DB
    sectionFormat  // Document format  must follows C-CDA. Please see README.md and Resume.js.md documentation
);
/// Other code here..
log('Recording...');
```


### Pause and Resume

```JS
// to pause
resume.pause();
// to resume
resume.resume();
```
  
### Update the Result
The [`ResumeOne`](Resume.js.md#ResumeOne) object automatically updates the `Resume API` response to client. It will call the [`onReceiveTranscript`](#conv-call). It also stores result in [`transcript` property](Resume.js.md#ResumeChild)

```JS
// Normally, ResumeOne always automatically calls onReceiveTranscript when recieved Resume API response.
// If you prefer to get result from property, use this
let response = resume.transcript;
```
### Stop recording and End session <a name="end-sess"></a>
***Warning!*** for better `Resume API` accuracy, please end session only if change the patients or close the page.
```JS
resume.endSession(_getUserTranscribe()); //get final user transcript from function
// Can be omitted like below,
// resume.endSession();
// if you provide `getIntermediateUserTranscript`

//// Another code here
log('Stopped recording.');

```
  
-------  
<br/>  
  
## Dictation Mode <a name="dictate"></a>

### Prepare HTML page for script
As same as [Conversation Mode](#prepare)

### Write essential callbacks <a name="dict-call"></a>
Write callbacks for [`getIntermediateUserTranscript`](Resume.js.md#getIntermediateUserTranscript) and [`onReceiveTranscript`](Resume.js.md#onReceiveTranscript) as same as [Conversation Mode](#conv-call).    

**The different** point between [Dictation Mode](#dictate) and [Conversation Mode](#conv-call) is that the [transcript](Resume.js.md#Transcript) argument of [`onReceiveTranscript`](Resume.js.md#onReceiveTranscript) has **`MlGroupTxt` and `TagRawTxt` keys**. Both are the object which keys' name follow the [Terminology of "C-CDA 1.1.0 on FHIR resource profile"](../README.md#freq-doc).  
  
For more information about ["C-CDA 1.1.0 on FHIR resource profile"](http://hl7.org/fhir/us/ccda/artifacts.html#structures-resource-profiles), please see [README.md](../README.md#freq-doc).    

```JS
function _getUserTranscribe () {
            // this format follows C-CDA, http://hl7.org/fhir/us/ccda/artifacts.html#structures-resource-profiles  .
            // Same to conversation Mode
            return {
                chief_complaint_section: this.CC,
                history_of_present_illness_section: this.PI,
                past_medical_history_section: this.PHx,
                problem_section: this.Dx,
                follow_up_section: this.FU
            };
        }
function _onReceiveTranscript (transcript, isEnd) {
            log('Recieved Transcript.. ' + JSON.stringify(transcript));
            if (isEnd) {
                // Action when API stop session completely.
            }
            if (transcript.MlGroupTxt) {
                // The response will have keys like the Terminology of "C-CDA 1.1.0 on FHIR resource profile".
                rPI = transcript.MlGroupTxt.history_of_present_illness_section;
                // .. and more rPHx = transcript.MlGroupTxt.....

                // More code here
                ////

                if(transcript.TagRawTxt.other)
                    rPI.push(...transcript.TagRawTxt.other);
            }
            
            //////////////////////////////////////////////////////
            /// This below lines differ from Conversation Mode ///
            //////////////////////////////////////////////////////
            if (transcript.TagRawTxt) {
                // The response will have keys like the Terminology of "C-CDA 1.1.0 on FHIR resource profile".
                tCC = transcript.TagRawTxt.chief_complaint_section;
                tPI = transcript.TagRawTxt.history_of_present_illness_section;
                
                // More code here
                /////
            }
        }
```

### Create `Socket.IO` client and `ResumeOne` object <a name="dict-create"></a>
Place [`ResumeOne`](Resume.js.md#ResumeOne) object construction in callback after loading page. The [`resumeOption`](Resume.js.md#new-resumeonesocket-resumeoption) argument should follow [`RESUME_DEFAULT_OPTION`](Resume.js.md#RESUME_DEFAULT_OPTION) object.

**The different** of [Dictation Mode](#dictate) from [Conversation Mode](#conv-call) is the **`multiSpeaker: false`** in [`resumeOption`](Resume.js.md#new-resumeonesocket-resumeoption).

```JS
var socket = io();

///
/// in completely loaded callback
var resume = new ResumeOne(socket,
    {
        getIntermediateUserTranscript: _getUserTranscribe,  // from above
        onReceiveTranscript: this._onReceiveTranscript,   // from above
        multiSpeaker: false   // this is dictation Mode!
    });
```
  

### Start new session for recording <a name="dict-start"></a>
When user trigers start event, you should set [`tag` property](Resume.js.md#ResumeChild) of `Resume Object` when start new session or change to other input field.
```JS
// !!Before start: set tag of input 
resume.tag = "chief_complaint_section";
// under start callback
resume.newSession(Hint,
    { HN: HN, TXN: TXN, Practioner: Practioner, Location:Location }, // Patient and Healthcare worker identifier for sending to local logging server, Not send to Resume API publically.
    sectionID, // Section to logging on Resume usage DB
    sectionFormat  // Document format  must follows C-CDA. Please see README.md and Resume.js.md documentation
);
/// Other code here..
log('Recording...');
```


### Pause, Resume  and Stop recording and End session <a name="dict-control"></a>
As same as [Conversation Mode](#prepare)   
***Warning!*** for better `Resume API` accuracy, please end session only if change the patients or close the page. If you want to change to other input field. Please change the value of [`tag` property](Resume.js.md#ResumeChild), and control by pause and resume.


```JS
// When use record on other input field, change the tag to corresponding name
resume.tag = "history_of_present_illness_section";


// to pause, or when user stop recording at some field
resume.pause();
// to resume, or when user start recording at some field
resume.resume();

// !!Only if change to other patient or close windows
resume.endSession(_getUserTranscribe()); //get final user transcript from function
// Can be omitted like below,
// resume.endSession();
// if you provide `getIntermediateUserTranscript`
```
  

### Update the Result  <a name="dict-update"></a>
As same as, [Conversation Mode](#prepare), the [`ResumeOne`](Resume.js.md#ResumeOne) object automatically updates the `Resume API` response to client. It will call the [`onReceiveTranscript`](#conv-call). It also stores result in [`transcript` property](Resume.js.md#ResumeChild)
**The different** of [Dictation Mode](#dictate) from [Conversation Mode](#conv-call) is that the [`transcript property`](Resume.js.md#Transcript) has both **`MlGroupTxt` and `TagRawTxt` keys**. Both are the object which keys' name follow the [Terminology of "C-CDA 1.1.0 on FHIR resource profile"](../README.md#freq-doc).  

```JS
// Normally, ResumeOne always automatically calls onReceiveTranscript when recieved Resume API response.
// If you prefer to get result from property, use this
let response = resume.transcript;
```

-------  
<br/>  
  



## Combinatory Conversation-Dictation Mode
### Prepare HTML page for script
Same to [Conversation and Dictation Mode](#prepare)

### Write essential callbacks
Same to [Dictation Mode](#dict-call)
 
### Create `Socket.IO` client and `ResumeOne` object
Same to [Conversation Mode](#conv-create)

### Start new session for recording
Same to [Dictation Mode](#dict-start)

### Pause, Resume  and Stop recording and End session
Same to [Dictation Mode](#dict-control)

### Update the Result
Same to [Dictation Mode](#dict-update)
  

-------  
<br/>  

## More Information
 - [Read me file](../README.md)
 - [Quick Start Guide for Server-sided Node.JS](node.guide.md)
 - [Quick Start Guide for Client-sided Resume.js](js.guide.md)
 - [Resume Socket.IO Server](Resume-Socket-IO-Server.md)
 - [Client-sided Resume.js](Resume.js.md)

&copy; 2021 - copyright by Tanapat Kahabodeekanokkul - the founder of [Resume](https://sati.co.th).

