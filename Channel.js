import Sound from './Sound.js';
import { msToSeconds} from './other.js'

export default class Channel {
    constructor(number) {
        this.number = number; //from 0 to 3
        this.startRecTime;
        this.stopRecTime;
        this.sounds = [];
        this.endInterval;
        this.progressBar = document.getElementById(`progress--${this.number+1}`);
    }

    addSound(domElement, time) {
        this.sounds.push(new Sound(domElement, time));
    }

    animateProgressBar() {
        const startPlayDate = Date.now();
        const totalTime = this.getTotalTime();
        const progressBar = this.progressBar;
        
        function reload() {
            let percentage = 100 * (Date.now() - startPlayDate)/totalTime;
            
            if (percentage <= 100) {
                requestAnimationFrame(reload);
            }
            //display bar's progress
            progressBar.value = percentage;
        }  
        requestAnimationFrame(reload);
    }

    calculateIntervals() {
        //calculate time interval between two sounds
        for (let i = this.sounds.length - 1; i > 0; i--) {
            this.sounds[i].interval = this.sounds[i].time - this.sounds[i - 1].time;
        }
        //calculate time interval before the first sound
        this.sounds[0].interval = this.sounds[0].time - this.startRecTime;
        //calculate time interval after the last sound
        this.endInterval = this.stopRecTime - this.sounds[this.sounds.length - 1].time;
    }

    isChannelEmpty() {
        return (!this.sounds.length);
    }
    
    displayTotalTime() {
        const totalTimeEl = document.querySelector(`.channels__time--${this.number+1}`);
        totalTimeEl.textContent = `${msToSeconds(this.getTotalTime())} s`;
    }

    getTotalTime() {
        return this.stopRecTime - this.startRecTime;
    }
}