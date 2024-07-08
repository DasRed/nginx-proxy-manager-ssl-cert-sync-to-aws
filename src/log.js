import commandline from './commandline.js';

export function LOG(...args) {
    console.log(`[${(new Date()).toJSON()}]`, ...args);
}

export function DEBUG(...args) {
    if (commandline.verbose === true) {
        console.log(`[${(new Date()).toJSON()}]`, ...args);
    }
}
