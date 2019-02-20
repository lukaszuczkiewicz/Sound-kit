export {msToSeconds, svg, wait};

function msToSeconds(ms) {
    return (ms/1000).toFixed(2);
}

async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

const svg = {
    rec: `<svg viewBox="0 0 20 20"><path d="M10 3c-3.866 0-7 3.133-7 7 0 3.865 3.134 7 7 7s7-3.135 7-7c0-3.867-3.134-7-7-7z"></path></svg>`,
    stop: `<svg viewBox="0 0 20 20"><path d="M16 4.995v9.808c0 0.661-0.536 1.197-1.196 1.197h-9.807c-0.551 0-0.997-0.446-0.997-0.997v-9.807c0-0.66 0.536-1.196 1.196-1.196h9.808c0.55 0 0.996 0.446 0.996 0.995z"></path></svg>`
}