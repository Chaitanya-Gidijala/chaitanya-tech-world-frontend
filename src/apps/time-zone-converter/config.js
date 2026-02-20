// Comprehensive list of time zones using Intl API
const getExpandedZones = () => {
    try {
        const timeZones = Intl.supportedValuesOf('timeZone');
        return timeZones.map(zone => {
            const parts = zone.split('/');
            const city = parts[parts.length - 1].replace(/_/g, ' ');
            const region = parts[0];

            return {
                value: zone,
                label: `${city} (${region})`,
                city: city,
                region: region
            };
        });
    } catch (e) {
        // Fallback for older browsers
        return [
            { value: 'Asia/Kolkata', label: 'New Delhi (Asia)', city: 'New Delhi', region: 'Asia' },
            { value: 'America/New_York', label: 'New York (America)', city: 'New York', region: 'America' },
            { value: 'Europe/London', label: 'London (Europe)', city: 'London', region: 'Europe' },
            { value: 'Asia/Tokyo', label: 'Tokyo (Asia)', city: 'Tokyo', region: 'Asia' },
            { value: 'Australia/Sydney', label: 'Sydney (Australia)', city: 'Sydney', region: 'Australia' }
        ];
    }
};

export const AVAILABLE_ZONES = getExpandedZones();

export const DEFAULT_ZONES = [
    { value: 'Asia/Kolkata', label: 'New Delhi (Asia)', city: 'New Delhi', region: 'Asia' },
    { value: 'America/New_York', label: 'New York (America)', city: 'New York', region: 'America' },
    { value: 'Europe/London', label: 'London (Europe)', city: 'London', region: 'Europe' },
];
