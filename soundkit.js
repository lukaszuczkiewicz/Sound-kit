const channels = [
    [],
    [],
    [],
    []
];
let currentChannel = 0; //index of the current channel
let isRecording = false;
let recStartTime;
let recStopTime;


document.addEventListener('DOMContentLoaded', appStart);

function appStart() { //enable buttons
    window.addEventListener('keypress', playSound);
    document.querySelector('#recordBtn').addEventListener('click', recordEvent);
    document.querySelector('#playBtn').addEventListener('click', () => {
        if (!isRecording) {
            playRecording(channels[currentChannel]);
        }
    });
    document.querySelector('#playAllBtn').addEventListener('click', () => {
        if (!isRecording) {
            playAllRecordings();
        }
    });
    document.querySelectorAll('.channel').forEach(radio => {
        radio.addEventListener('change', () => {
            currentChannel = parseInt(radio.getAttribute("value") - 1);
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
            //save the starting time
            recStopTime = Date.now();
            //display total time
            const totalTimeEl = document.querySelector(`.channel--${currentChannel+1}__total`);
            // totalTimeEl.textContent = getTotalTime();
            totalTimeEl.textContent = `${msToSeconds(getTotalTime())} s`;

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

            }, channel[i].interval);
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
    audioDOM = document.querySelector(`[data-code="${e.charCode}"]`); // get DOM audio element
    if (!audioDOM) { //there is no element with such a code
        return;
    }

    audioDOM.currentTime = 0;
    audioDOM.play();

    if (isRecording) {
        channels[currentChannel].push({ //saving data to a channel
            element: audioDOM,
            time: Date.now(),
            interval: null
        });
    }
}

function calculateInterval(channel) {
    //calculate time interval between two sounds
    for (let i = channel.length - 1; i > 0; i--) {
        channel[i].interval = channel[i].time - channel[i - 1].time;
    }
    channel[0].interval = channel[0].time - recStartTime;
}

function getTotalTime() {
    return recStopTime - recStartTime;
}

function isChannelEmpty(channel) {
    return (!channel.length);
}
function msToSeconds(ms) {
    return (ms/1000).toFixed(2);
}
//add 3,2,1 counting making a delay from pressing recording to starting recording

//capslock on changes the keycode!!!