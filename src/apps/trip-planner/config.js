export const DESTINATIONS = [
    {
        id: 'paris',
        name: 'Paris, France',
        description: 'The City of Light. Iconic landmarks, world-class cuisine, and romantic atmosphere.',
        price: 1200,
        type: 'City',
        coordinates: { x: 10, y: 20 },
        color: 'from-blue-500 to-purple-600',
        activities: ['Eiffel Tower', 'Louvre Museum', 'Seine Cruise']
    },
    {
        id: 'kyoto',
        name: 'Kyoto, Japan',
        description: 'Ancient temples, traditional tea houses, and sublime gardens.',
        price: 1500,
        type: 'Culture',
        color: 'from-red-500 to-pink-600',
        activities: ['Kinkaku-ji', 'Fushimi Inari', 'Arashiyama Bamboo Grove']
    },
    {
        id: 'santorini',
        name: 'Santorini, Greece',
        description: 'Stunning sunsets, white-washed buildings, and crystal clear waters.',
        price: 1800,
        type: 'Relax',
        color: 'from-cyan-400 to-blue-600',
        activities: ['Oia Sunset', 'Red Beach', 'Wine Tasting']
    },
    {
        id: 'newyork',
        name: 'New York, USA',
        description: 'The city that never sleeps. Broadway, Times Square, and Central Park.',
        price: 2000,
        type: 'City',
        color: 'from-slate-700 to-slate-900',
        activities: ['Statue of Liberty', 'Central Park', 'Broadway Show']
    },
    {
        id: 'maldives',
        name: 'Maldives',
        description: 'Private overwater bungalows and vibrant marine life.',
        price: 3000,
        type: 'Luxury',
        color: 'from-teal-400 to-emerald-600',
        activities: ['Snorkeling', 'Spa Day', 'Private Dinner']
    },
    {
        id: 'dubai',
        name: 'Dubai, UAE',
        description: 'Futuristic skyline, luxury shopping, and desert adventures.',
        price: 2500,
        type: 'Luxury',
        color: 'from-amber-400 to-orange-600',
        activities: ['Burj Khalifa', 'Desert Safari', 'Dubai Mall']
    },
    {
        id: 'bali',
        name: 'Bali, Indonesia',
        description: 'Tropical paradise with beaches, temples, and rice terraces.',
        price: 1300,
        type: 'Relax',
        color: 'from-green-400 to-emerald-600',
        activities: ['Ubud Rice Terraces', 'Beach Clubs', 'Temple Tours']
    },
    {
        id: 'rome',
        name: 'Rome, Italy',
        description: 'Ancient history, Renaissance art, and incredible cuisine.',
        price: 1600,
        type: 'Culture',
        color: 'from-rose-400 to-red-600',
        activities: ['Colosseum', 'Vatican Museums', 'Trevi Fountain']
    }
];

export const TRANSPORT_MODES = [
    { value: 'flight', label: 'Flight ✈️', icon: '✈️' },
    { value: 'train', label: 'Train 🚆', icon: '🚆' },
    { value: 'bus', label: 'Bus 🚌', icon: '🚌' },
    { value: 'car', label: 'Car 🚗', icon: '🚗' },
    { value: 'ferry', label: 'Ferry 🚢', icon: '🚢' },
    { value: 'walk', label: 'Walking 🚶', icon: '🚶' }
];

export const ACCOMMODATION_TYPES = [
    { value: 'hotel', label: 'Hotel 🏨' },
    { value: 'hostel', label: 'Hostel 🏠' },
    { value: 'airbnb', label: 'Airbnb 🏡' },
    { value: 'resort', label: 'Resort 🏖️' },
    { value: 'camping', label: 'Camping ⛺' },
    { value: 'other', label: 'Other 🏘️' }
];
