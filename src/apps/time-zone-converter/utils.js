export const formatTime = (date, timeZone) => {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZone,
    }).format(date);
};

export const formatDate = (date, timeZone) => {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone,
    }).format(date);
};

export const getDayDifference = (date, timeZone) => {
    const localDate = new Date(date.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
    const targetDateString = date.toLocaleString('en-US', { timeZone });
    const targetDate = new Date(targetDateString);

    // Simple day comparison logic might be tricky due to parsing, 
    // but let's stick to comparing formatted date strings for simplicity in "Yesterday/Tomorrow" logic if needed.
    // For now, returning the raw string or let the UI handle it is safer.
    return '';
};

export const getTimeOffset = (timeZone) => {
    // This is an approximation or needs complex calculation.
    // Simpler: Use formatted string to show e.g., "GMT+5:30"
    // But for now, let's just return the detailed time zone name or abbreviations.
    try {
        const str = new Intl.DateTimeFormat('en-US', {
            timeZone,
            timeZoneName: 'shortOffset'
        }).format(new Date());
        // extracted part usually at the end
        const parts = str.split(' ');
        return parts[parts.length - 1]; // e.g. GMT-5
    } catch (e) {
        return '';
    }
};
