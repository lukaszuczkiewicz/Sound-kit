import Channel from './Channel.js';

//create channels
const channels = [
    new Channel(1),
    new Channel(2),
    new Channel(3),
    new Channel(4)
];

let currentChannelNum = 0; //index of the current channel
let isRecording = false;


document.addEventListener('DOMContentLoaded', appStart);

function appStart() { //enable buttons
    window.addEventListener('keypress', playSound);
    document.querySelector('#recordBtn').addEventListener('click', recordEvent);
    document.querySelector('#playBtn').addEventListener('click', () => {
        if (!isRecording) {
            playRecording(currentChannelNum);
        }
    });
    document.querySelector('#playAllBtn').addEventListener('click', () => {
        if (!isRecording) {
            playAllRecordings();
        }
    });
    document.querySelectorAll('.channel').forEach(radio => {
        radio.addEventListener('change', () => {
            currentChannelNum = parseInt(radio.getAttribute("value") - 1);
        });
    });
}

function playAllNotCurrent() {
    channels.forEach((channel, i) => {
        if (currentChannelNum !== i) {
            playRecording(i);
        }
    });
}

function playAllRecordings() {
    channels.forEach((channel, i) => {
        playRecording(i);
    });
}

function playSound(e) {
    const audioDOM = document.querySelector(`[data-code="${e.charCode}"]`); // get DOM audio element
    if (!audioDOM) { //there is no element with such a code
        return;
    }
    //play sound
    audioDOM.currentTime = 0;
    audioDOM.play();

    if (isRecording) {
        //add sound to the current channel
        channels[currentChannelNum].addSound(audioDOM, Date.now());
    }
}

function playRecording(channelNum) {
    // const channel = channels[channelNum];
    if (!channels[channelNum].isChannelEmpty()) {
        // turn on progress bar animation
        channels[channelNum].animateProgressBar();

        let i = 0; //loop iteration count
        const max = channels[channelNum].sounds.length; //loop max literation count

        function timeout() {
            setTimeout(() => {
                //play the sound
                channels[channelNum].sounds[i].element.currentTime = 0;
                channels[channelNum].sounds[i].element.play();
                i++;

                if (i >= max) { //there are no more sounds
                   // channels[channelNum].stopAnimateProgressBar();
                    return;
                }

                timeout(); //recursion

            }, channels[channelNum].sounds[i].interval);
        }
        timeout();
    }
}

function recordEvent() {
    const recordBtn = document.querySelector('#recordBtn');

    //switch to recording/not recording
    isRecording = !isRecording;

    if (isRecording) { //start recording
        //clear previous record on current channel
        channels[currentChannelNum] = new Channel(currentChannelNum);
        //save the starting time
        channels[currentChannelNum].startRecTime = Date.now();
        //display stop rec btn text
        recordBtn.textContent = "Stop recording";
        //play other channels in a background
        playAllNotCurrent();

    } else { //stop recording
        //display start rec btn text
        recordBtn.textContent = "Start recording";
        if (!channels[currentChannelNum].isChannelEmpty()) {
            //save the finishing time
            channels[currentChannelNum].stopRecTime = Date.now();

            channels[currentChannelNum].calculateIntervals();
            // display time length of the record
            channels[currentChannelNum].displayTotalTime();
        }
    }
}