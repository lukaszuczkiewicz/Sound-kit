import {
    Channel,
    areAllChannelsEmpty
} from './Channel.js';
import {
    svg
} from './other.js';

//create channels
const channels = [
    new Channel(1),
    new Channel(2),
    new Channel(3),
    new Channel(4)
];

//buttons
const recBtn = document.querySelector('#recordBtn');
const playAllBtn = document.querySelector('#playAllBtn');
const playChanBtn = document.querySelector('#playBtn');

let currentChannelNum = 0; //index of the current channel
let recChannelNum;
let isRecording = false;
let isPlaying = false;

function appStart() { //enable buttons
    window.addEventListener('keypress', playSound);
    recBtn.addEventListener('click', recordEvent);
    playChanBtn.addEventListener('click', playCurrentChannel);
    playAllBtn.addEventListener('click', playAllChannels);
    document.querySelectorAll('.channels__radio').forEach(radio => {
        radio.addEventListener('change', () => {
            currentChannelNum = parseInt(radio.getAttribute("value") - 1);
            changeBtnState();
        });
    });
}
async function playCurrentChannel() {
    isPlaying = true;
    changeBtnState();
    await channels[currentChannelNum].play();
    isPlaying = false;
    changeBtnState();
}
async function playAllNotCurrent() {

    isPlaying = true;
    changeBtnState(); 

    const promises = [];
    channels.forEach((c, i) => {
        if (recChannelNum !== i && !c.isChannelEmpty()) {
            promises.push(c.play());
        }
    });
    Promise.all(promises)
    .then(() => {
        isPlaying = false;
        changeBtnState();
    })
}

async function playAllChannels() {
    isPlaying = true;
    changeBtnState();

    const promises = []
    channels.forEach((c) => {
        if (!c.isChannelEmpty()) {
            promises.push(c.play());
        }
    });
    Promise.all(promises)
    .then(() => {
        isPlaying = false;
        changeBtnState();
    })
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
        channels[recChannelNum].addSound(audioDOM, Date.now()); //error if user changes channels while recording (check if fixed)
    }
}

function recordEvent() {
    //switch to recording/not recording
    isRecording = !isRecording;

    if (isRecording) { //start recording

        recChannelNum = currentChannelNum; //save index of the recording channel

        channels[recChannelNum] = new Channel(recChannelNum); //clear previous data on temporary channel           
        channels[recChannelNum].startRecTime = Date.now(); //save the starting time
        recBtn.innerHTML = svg.stop; //display stop rec img inside btn  
        playAllNotCurrent(); //play other channels in a background

    } else { //stop recording

        channels[recChannelNum].stopRecTime = Date.now(); //save the finishing time
        recBtn.innerHTML = svg.rec; //display start rec img inside btn                   
        channels[recChannelNum].displayTotalTime(); // display time length of the record

        //save channel
        if (channels[recChannelNum].isChannelEmpty()) { //user didn't clicked any keys
            // channels[recChannelNum].addSound(null, channels[recChannelNum].getTotalTime()); //add an empty interval without any sound
            channels[recChannelNum] = new Channel(recChannelNum); //clear channel
        } else { //user clicked 1 time or more
            channels[recChannelNum].calculateIntervals();
        }
    }
    changeBtnState();
}

function changeBtnState() {
    //hide or show 'rec' btn
    if (isPlaying && !isRecording) {
        recBtn.classList.add('hide');
    } else {
        recBtn.classList.remove('hide');
    }

    //hide or show 'play channel' btn;
    if (isRecording || isPlaying || channels[currentChannelNum].isChannelEmpty()) {
        // if (isRecording || isPlaying || channels[currentChannelNum].isChannelEmpty()) {
        playChanBtn.classList.add('hide');
    } else {
        playChanBtn.classList.remove('hide');
    }

    //hide or show 'play all channels' btn;
    if (isRecording || isPlaying || areAllChannelsEmpty(channels)) {
        // if (isRecording || isPlaying || areAllChannelsEmpty(channels)) {
        playAllBtn.classList.add('hide');
    } else {
        playAllBtn.classList.remove('hide');
    }
    console.log(`isplaying: ${isPlaying}, isRecording: ${isRecording}, areAllChannelsEmpty: ${areAllChannelsEmpty(channels)}`);
    debugger;
}

document.addEventListener('DOMContentLoaded', appStart);