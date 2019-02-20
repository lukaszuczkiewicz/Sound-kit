import Sound from './Sound.js';
import {
    msToSeconds,
    wait
} from './other.js';

export class Channel {
    constructor(number) {
        this.number = number; //from 0 to 3
        this.startRecTime;
        this.stopRecTime;
        this.sounds = [];
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
            let percentage = 100 * (Date.now() - startPlayDate) / totalTime;

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
        const endInterval = this.stopRecTime - this.sounds[this.sounds.length - 1].time;
        this.sounds.push(new Sound(null, null, endInterval));
    }

    displayTotalTime() {
        const totalTimeEl = document.querySelector(`.channels__time--${this.number+1}`);
        if (this.isChannelEmpty()) {
            totalTimeEl.textContent = 'empty';
        } else {
            totalTimeEl.textContent = `${msToSeconds(this.getTotalTime())} s`;
        }
    }

    getTotalTime() {
        return this.stopRecTime - this.startRecTime;
    }

    isChannelEmpty() {
        return (!this.sounds.length);
    }

    async play() {
        this.animateProgressBar();

        for (let i = 0; i < this.sounds.length; i++) {
            await wait(this.sounds[i].interval);
            if (this.sounds[i].element) {
                this.sounds[i].element.currentTime = 0;
                this.sounds[i].element.play();
            }
        }
    }
}

export function areAllChannelsEmpty(channels) {
    let isEmpty = true;
    channels.forEach(c => {
        if (!c.isChannelEmpty()) {
            isEmpty = false;
        }
    });
    return isEmpty;
}