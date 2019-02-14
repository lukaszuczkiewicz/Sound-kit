const sounds = {
    97: "clap-808",
    98: "clap-analog",
    99: "clap-crushed",
    100: "clap-fat",
    101: "clap-slapper",
    102: "clap-tape",
    103: "cowbell-808",
    104: "crash-808",
    105: "crash-acoustic",
    106: "crash-noise",
    107: "crash-tape",
    108: "hihat-acoustic01",
    109: "hihat-acoustic02",
    110: "kick-808",
    111: "kick-acoustic01",
    112: "kick-acoustic02",
    113: "kick-cultivator",
    114: "kick-deep",
    115: "kick-dry",
    116: "openhat-analog",
    117: "perc-hollow",
    118: "ride-acoustic01",
    119: "ride-acoustic02",
    120: "shaker-analog",
    121: "snare-808",
    122: "snare-analog"
}

const channels = [[],[],[],[]];
let currentChannel = 0; //index of the current channel
let isRecording = false;
let recStartTime;

document.addEventListener('DOMContentLoaded', appStart);

function appStart() { //enable buttons
    window.addEventListener('keypress', playSound);
    document.querySelector('#recordBtn').addEventListener('click', recordEvent);
    document.querySelector('#playBtn').addEventListener('click', ()=> {
        if (!isRecording) {
            playRecording(channels[currentChannel]);
        }
    });
    document.querySelector('#playAllBtn').addEventListener('click', ()=> {
        if (!isRecording) {
            playAllRecordings();
        }
    });
    document.querySelectorAll('.channel').forEach(radio => {
        radio.addEventListener('change', ()=> {
            currentChannel = parseInt(radio.getAttribute("value")-1);
        });
    });
}

function recordEvent() {
    //switch to recording/not recording
    isRecording = !isRecording;
    
    const recordBtn = document.querySelector('#recordBtn');

    if (isRecording) { //start recording
        //clear previous record on current channel
        channels[currentChannel] = [];
        //display stop rec btn text
        recordBtn.textContent = "Stop recording";
        //save the starting time
        recStartTime = Date.now();
        //play other channels in a background
        playAllNotCurrent();

    } else { //stop recording
        //display start rec btn text
        recordBtn.textContent = "Start recording";
        if (!isChannelEmpty(channels[currentChannel])) {
            calculateInterval(channels[currentChannel]);
        }
    }
}

function playRecording(channel) {

    if (!isChannelEmpty(channel)) {
        let i = 0; //loop iteration count
        const max = channel.length; //loop max literation count
    
        function timeout() {
            setTimeout(() => { 
                //play the sound
                channel[i].element.currentTime = 0;
                channel[i].element.play();
                i++;
    
                if (i >= max) {
                    return;
                }
    
                timeout(); //recursion
    
            }, channel[i].time);
        }
        timeout();
    }
}
function playAllRecordings() {
    channels.forEach((channel, i) => {
        playRecording(channels[i]);
    });
}
function playAllNotCurrent() {
    channels.forEach((channel, i) => {
        if (currentChannel !== i) {
            playRecording(channels[i]);
        }
    });
}

function playSound(e) {
    if (!(sounds.hasOwnProperty(e.charCode))) {
        console.log(e.charCode);
        //ignore if user pressed an unbinded key
        return;
    } else {
       // const audioName = sounds[e.charCode]; // load sound code
        audioDOM = document.querySelector(`[data-code="${e.charCode}"]`); // get DOM audio element
        audioDOM.currentTime = 0;
        audioDOM.play();
    
        if (isRecording) {
            channels[currentChannel].push({ //saving data to a channel
                element: audioDOM,
                time: Date.now()
            });
        }

    }
}

function calculateInterval(channel) {
    //calculate time interval between two sounds
    for (let i = channel.length - 1; i > 0; i--) {
        channel[i].time -= channel[i - 1].time;
    }
    channel[0].time -= recStartTime;
}


function isChannelEmpty(channel) {
    return (!channel.length);
}

//add 3,2,1 counting making a delay from pressing recording to starting recording

//capslock on changes the keycode!!!