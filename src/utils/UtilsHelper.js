import { intervalToDuration } from 'date-fns';

const msToHumanReadable = (milliseconds) => {
    const duration = intervalToDuration({ start: 0, end: milliseconds });
    const formattedDuration = [];

    if (duration.hours > 0) {
        formattedDuration.push(`${duration.hours}h`);
    }
    if (duration.minutes > 0) {
        formattedDuration.push(`${duration.minutes}m`);
    }
    if (duration.seconds > 0) {
        formattedDuration.push(`${duration.seconds}s`);
    }

    return formattedDuration.join(', ');
};

const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
};

export { msToHumanReadable, shuffle };