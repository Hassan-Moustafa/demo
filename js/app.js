// replace these values with those generated in your TokBox Account
let apiKey = "46822744";
let sessionId = "1_MX40NjgyMjc0NH5-MTU5Mzc0MDI1Nzk1MH5IRkVobzlHWUUyVzdNSWJ6QnZGYnJEZit-fg";
let token = "T1==cGFydG5lcl9pZD00NjgyMjc0NCZzaWc9MTVhMDQ0NzFkMTE0NTE3ODM1OTlkNTM1YTQ0MWFlMDYxYWQyMGExMzpzZXNzaW9uX2lkPTFfTVg0ME5qZ3lNamMwTkg1LU1UVTVNemMwTURJMU56azFNSDVJUmtWb2J6bEhXVVV5VnpkTlNXSjZRblpHWW5KRVppdC1mZyZjcmVhdGVfdGltZT0xNTkzNzQwMzA1Jm5vbmNlPTAuNzk4NDY3MzU5MDU2NzAyJnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1OTYzMzIzMDMmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";

let isVoiceWorking = true;
let isVideoWorking = true;
let callIsWorking = false;

let session;
let subscriber;
let publisher;


let receiveCallsBtn = document.getElementById('receive-calls-btn');
let videoCallContainer = document.getElementById('video-call');
let voiceCallContainer = document.getElementById('voice-call');

let closeCallBtn = document.getElementsByClassName('fa-phone')[0];
let toggleVideoBtn = document.getElementById('toggle-video-btn');
let toggleMicBtn = document.getElementById('toggle-mic-btn');


function publichVideoStatus(status) {
    publisher.publishVideo(status);
}

function publichVoiceStatus(status) {
    publisher.publishAudio(status);
}

function handlePropertChange(event) {
    let subscribers = session.getSubscribersForStream(event.stream);
    if(event.changedProperty === 'hasVideo' && event.newValue !== event.oldValue && subscribers.length > 0) {
        if(event.newValue) {
            voiceCallContainer.style.display = 'none';
        } else {
            voiceCallContainer.style.display = 'block';
        }
    }
}

toggleVideoBtn.addEventListener('click', () => {
    if(isVideoWorking) {
        publichVideoStatus(false);
        toggleVideoBtn.classList.remove('fa-video');
        toggleVideoBtn.classList.add('fa-video-slash');
    } else {
        publichVideoStatus(true);
        toggleVideoBtn.classList.remove('fa-video-slash');
        toggleVideoBtn.classList.add('fa-video');
    }
    isVideoWorking = !isVideoWorking;
})


toggleMicBtn.addEventListener('click', () => {
    if(isVoiceWorking) {
        publichVoiceStatus(false);
        toggleMicBtn.classList.remove('fa-microphone');
        toggleMicBtn.classList.add('fa-microphone-slash');
    } else {
        publichVoiceStatus(true);
        toggleMicBtn.classList.remove('fa-microphone-slash');
        toggleMicBtn.classList.add('fa-microphone');
    }
    isVoiceWorking = !isVoiceWorking;
})

closeCallBtn.addEventListener('click', () => {
    // if(subscriber) {
    //     session.unsubscribe(subscriber);
    //     subscriber.destroy();
    //     subscriber = null;
    // }
    
    // if(publisher) {
    //     session.unpublish(publisher);
    //     publisher.destroy();
    //     publisher = null;
    // }

    session.disconnect();
    // session = null;

    callIsWorking = false;
    videoCallContainer.style.display = 'none';
});

receiveCallsBtn.addEventListener('click' , (e) => {

    if(!callIsWorking) {
        initializeSession();
        videoCallContainer.style.display = 'flex';
        callIsWorking = true;
    }
});


// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
      alert(error.message);
    }
}


  
function initializeSession() {

    if(!session) {
        session = OT.initSession(apiKey, sessionId);
        session.on('streamCreated', function(event) {
            console.log('subscribe');
            subscriber = session.subscribe(event.stream, 'subscriber', {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            }, handleError);
        });
    }
    // Subscribe to a newly created stream

    session.on('streamPropertyChanged', handlePropertChange);

    // Create a publisher
    publisher = OT.initPublisher('publisher', {
        insertMode: 'append',
        width: '100%',
        height: '100%'
    }, handleError);

    // Connect to the session
    session.connect(token, function(error) {
        // If the connection is successful, publish to the session
        if (error) {
        handleError(error);
        } else {
        session.publish(publisher, handleError);
        }
    });
}