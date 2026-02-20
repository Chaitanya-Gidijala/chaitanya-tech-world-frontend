export const formatTime = (date, timeZone) => {
    try {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone,
        }).format(date);
    } catch (e) {
        return "--:--";
    }
};

export const formatDate = (date, timeZone) => {
    try {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone,
        }).format(date);
    } catch (e) {
        return "Unknown Date";
    }
};

export const getTimeOffset = (timeZone) => {
    try {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone,
            timeZoneName: 'shortOffset'
        }).formatToParts(new Date());

        const offsetPart = parts.find(p => p.type === 'timeZoneName');
        return offsetPart ? offsetPart.value : '';
    } catch (e) {
        return '';
    }
};
