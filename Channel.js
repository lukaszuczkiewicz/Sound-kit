import Sound from './Sound.js';
import { msToSeconds } from './other.js'

export default class Channel {
    constructor(number) {
        this.number = number;
        this.startRecTime;
        this.stopRecTime;
        this.sounds = [];
        this.endInterval;
    }
    addSound(domElement, time) {
        this.sounds.push(new Sound(domElement, time));
    }
    calculateIntervals() {
        //calculate time interval between two sounds
        for (let i = this.sounds.length - 1; i > 0; i--) {
            this.sounds[i].interval = this.sounds[i].time - this.sounds[i - 1].time;
        }
        //calculate time interval before first sound
        this.sounds[0].interval = this.sounds[0].time - this.startRecTime;
        //calculate time interval after last sound
        this.endInterval = this.stopRecTime - this.sounds[this.sounds.length - 1].time;
    }

    getTotalTimeInSeconds() {
        return msToSeconds(this.recStopTime - this.recStartTime);
    }

    isChannelEmpty() {
        return (!this.sounds.length);
    }
    animateProgressBar() {
        document.querySelector(`.progress-bar--${this.number+1}`).classList.add('progress-bar-long');
    }
    
    stopAnimateProgressBar() {
        document.querySelector(`.progress-bar--${this.number+1}`).classList.remove('progress-bar-long');
    }
    displayTotalTime() {
        const totalTimeEl = document.querySelector(`.channel--${number+1}__total`);
        // totalTimeEl.textContent = getTotalTime();
        totalTimeEl.textContent = `${this.getTotalTimeInSeconds()} s`;
    }
}