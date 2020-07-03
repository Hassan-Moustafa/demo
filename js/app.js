// replace these values with those generated in your TokBox Account
let apiKey = "46822744";
let sessionId = "1_MX40NjgyMjc0NH5-MTU5Mzc0MDI1Nzk1MH5IRkVobzlHWUUyVzdNSWJ6QnZGYnJEZit-fg";
let token = "T1==cGFydG5lcl9pZD00NjgyMjc0NCZzaWc9MTVhMDQ0NzFkMTE0NTE3ODM1OTlkNTM1YTQ0MWFlMDYxYWQyMGExMzpzZXNzaW9uX2lkPTFfTVg0ME5qZ3lNamMwTkg1LU1UVTVNemMwTURJMU56azFNSDVJUmtWb2J6bEhXVVV5VnpkTlNXSjZRblpHWW5KRVppdC1mZyZjcmVhdGVfdGltZT0xNTkzNzQwMzA1Jm5vbmNlPTAuNzk4NDY3MzU5MDU2NzAyJnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1OTYzMzIzMDMmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";


let onGoingCall = false;

let receiveCallsBtn = document.getElementById('receive-calls-btn');
let videoCallContainer = document.getElementById('video-call');
let voiceCallContainer = document.getElementById('voice-call');

let videoOnBtn = document.getElementsByClassName('fa-video')[0];
let videoOffNtn = document.getElementsByClassName('fa-video-slash')[0];

videoOnBtn.addEventListener('click', () => {
    videoCallContainer.style.display = 'none';
    voiceCallContainer.style.display = 'block';
});

videoOffNtn.addEventListener('click', () => {
    videoCallContainer.style.display = 'flex';
    voiceCallContainer.style.display = 'none';
})

receiveCallsBtn.addEventListener('click' , (e) => {
    onGoingCall = true;
    initializeSession();
    videoCallContainer.style.display = 'flex';    
});



// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
      alert(error.message);
    }
}
  
function initializeSession() {
    let session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on('streamCreated', function(event) {
        session.subscribe(event.stream, 'subscriber', {
          insertMode: 'append',
          width: '100%',
          height: '100%'
        }, handleError);
    });

    // Create a publisher
    let publisher = OT.initPublisher('publisher', {
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