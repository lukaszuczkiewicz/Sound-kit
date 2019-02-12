document.addEventListener('DOMContentLoaded', appStart);

function appStart() { //enable buttons
    window.addEventListener('keypress', playSound);
    document.querySelector('#start').addEventListener('click', startRecording);
    document.querySelector('#stop').addEventListener('click', stopRecording);
    document.querySelector('#play').addEventListener('click', playRecording);
}

const sounds = {
    97: "clap-808",
    115: "clap-analog",
    100: "clap-crushed",
    102: "clap-fat",
    103: "clap-slapper",
    104: "clap-tape",
    105: "cowbell-808",
    106: "crash-808"
}

const channel1 = [];
let isRecording = false;
let recStart;

function playRecording() {
    channel = channel1;
    if (!isChannelEmpty(channel)) {
        i = 0; //loop iteration count
        max = channel.length; //loop max literation count
    
        function timeout() {
            setTimeout(() => { 
                //play the sound
                console.log(channel[i])
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

function startRecording(e) {
    isRecording = true;
    recStart = Date.now(); //save the starting time
    //block start btn
}

function stopRecording(e) {
    isRecording = false;
    //block stop btn (also block it initially)
    if (!isChannelEmpty(channel1)) {
        calculateInterval(channel1);
    }
}

function playSound(e) {
    //to do --- ignore if user pressed not binded key
    const audioName = sounds[e.charCode]; // load sound code
    audioDOM = document.querySelector(`#${audioName}`); // get DOM audio element
    audioDOM.currentTime = 0;
    audioDOM.play();

    if (isRecording) {
        channel1.push({ //saving data to a channel
            element: audioDOM,
            time: Date.now()
        });
    }
}

function calculateInterval(channel) {
    for (let i = channel.length - 1; i > 0; i--) {
        //calculate time inteval between two sounds
        channel[i].time -= channel[i - 1].time;
    }
    channel[0].time -= recStart; //to improve what if the channel is empty?
}
//add 3,2,1 counting making a delay from pressing recording to starting recording


function isChannelEmpty(channel) {
    return (!channel.length);
}