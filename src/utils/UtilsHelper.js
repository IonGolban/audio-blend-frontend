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

export { msToHumanReadable };