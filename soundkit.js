document.addEventListener('DOMContentLoaded', appStart)

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
let recStart = 0;

function appStart() {
    window.addEventListener('keypress', playSound);
    document.querySelector('#play').addEventListener('click', playMusic);
    document.querySelector('#rec').addEventListener('click', recMusic);
}
function playMusic() {
    channel1.forEach(sound => {
        setTimeout(() => {
            audioDOM = document.querySelector(`#${sound.name}`);
            // odtwórz dźwięk
            audioDOM.currentTime = 0;
            audioDOM.play();
        }, sound.time
        )
    })
}
function recMusic(e) {
    // zapamietaj czas
    recStart = Date.now();
    // zmień tryb nagrywania/ odtwarzania
    isRecording = !isRecording;
    // zaktualizuj napis na buttonie
    e.target.innerHTML = isRecording ? 'Zakończ' : 'Nagrywaj';
}

function playSound(e) {
    // pobierz kod znaku
    audioName = sounds[e.charCode];
    // pobierz obiekt audio z dom
    audioDOM = document.querySelector(`#${audioName}`);
    // odtwórz dźwięk
    audioDOM.currentTime = 0;
    audioDOM.play();

    // zapisywanie do ścieżki 1
    if (isRecording) {
        channel1.push({
            name: 'audioName',
            time: Date.now() - recStart
        });
    }
}

//add 3,2,1 counting making a delay from pressing recording to starting recording