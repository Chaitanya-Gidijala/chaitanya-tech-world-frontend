import {
    Heart, Gift, Gem, Home, Building2, CalendarDays,
    ImageIcon, Wallpaper, Globe, ShoppingCart, Utensils, PenTool, CreditCard,
    Palette, Code2, ArrowRight, Sparkles, Star, MonitorSmartphone,
    Layers, Printer, Package, MessageSquare, Users, Eye, Download,
    Zap, Smartphone, ShieldCheck, MessageCircle, Pencil, RefreshCcw, CheckCircle2
} from 'lucide-react';

let galleryData = {};
try {
    galleryData = JSON.parse(import.meta.env.VITE_PHOTO_EDITOR_GALLERY_JSON || '{}');
} catch (e) {
    console.warn('Could not parse gallery JSON from env');
}

export const heroStats = [
    { num: '12+', label: 'Designs Delivered' },
    { num: '3+', label: 'Websites Built' },
    { num: '2+', label: 'Years Experience' },
    { num: '100%', label: 'Client Satisfaction' },
];

export const services = [
    {
        id: 'wedding-invitations-cards',
        Icon: Heart,
        title: 'Wedding Invitations Cards',
        desc: 'Elegant, timeless wedding suites — save-the-dates, full invitation cards, digital & print-ready. Luxury typography meets your love story.',
        cta: 'Order Now',
    },
    {
        id: 'birthday-invitations-cards',
        Icon: Gift,
        title: 'Birthday Invitations Cards',
        desc: 'Vibrant, personalised birthday cards and e-invites. Fun or formal — every theme, any age, any style you imagine.',
        cta: 'Create Yours',
    },
    {
        id: 'engagement-invitations-cards',
        Icon: Gem,
        title: 'Engagement Invitations Cards',
        desc: 'Celebrate the big "Yes!" with sophisticated engagement invitations. Romantic designs that capture the joy of the moment.',
        cta: 'Design Now',
    },
    {
        id: 'housewarming-invitations-cards',
        Icon: Home,
        title: 'Housewarming Invitations Cards',
        desc: 'Warm, welcoming invites for your new home celebration. Charming illustrations and clean layouts that set the perfect tone.',
        cta: 'Get Started',
    },
    {
        id: 'corporate-invitations-cards',
        Icon: Building2,
        title: 'Corporate Invitations Cards',
        desc: 'Polished, brand-aligned corporate event invitations for product launches, conferences, and annual functions.',
        cta: 'Explore',
    },
    {
        id: 'custom-event-cards',
        Icon: CalendarDays,
        title: 'Custom Event Cards',
        desc: "Baby showers, anniversaries, graduations — any occasion. Tell us your vision and we'll craft a one- of - a - kind invite.",
        cta: 'Customise',
    },
    {
        id: 'banners-posters',
        Icon: ImageIcon,
        title: 'Banners & Posters',
        desc: 'High-impact social media banners, YouTube channel art, event posters, and promotional flyers that demand attention.',
        cta: 'Order Banner',
    },
    {
        id: 'wallpaper-design',
        Icon: Wallpaper,
        title: 'Wallpaper Design',
        desc: 'Stunning desktop and mobile wallpapers — abstract art, brand-themed, motivational quotes, or completely custom.',
        cta: 'Get Wallpaper',
    },
    {
        id: 'website-development',
        Icon: Globe,
        title: 'Website Development',
        desc: 'Custom full-stack websites that are fast, responsive, and brand-aligned. From landing pages to complex web apps.',
        cta: 'Build Site',
    },
    {
        id: 'shopping-applications',
        Icon: ShoppingCart,
        title: 'Shopping Applications',
        desc: 'E-commerce mobile apps and UI/UX designs. Seamless shopping experiences optimized for conversions.',
        cta: 'Build App',
    },
    {
        id: 'restaurant-branding',
        Icon: Utensils,
        title: 'Restaurant Branding',
        desc: 'Full restaurant branding including menus, table tents, coasters, and social media appetizing visuals.',
        cta: 'Brand Now',
    },
    {
        id: 'logo-designs',
        Icon: PenTool,
        title: 'Logo Designs',
        desc: 'Unique, memorable, and timeless logos that perfectly capture your brand identity and vision.',
        cta: 'Design Logo',
    },
    {
        id: 'business-cards',
        Icon: CreditCard,
        title: 'Business Cards',
        desc: 'Premium business card designs. Minimalist, luxury, or creative — leave a lasting professional impression.',
        cta: 'Order Cards',
    },
];

export const categories = ['All', 'Design', 'Websites', 'Branding'];

export const projects = [
    {
        id: 'wedding-invitations-cards', cat: 'Design',
        img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
        title: 'Wedding Invitations Cards',
        desc: 'Elegant, timeless wedding suites — save-the-dates and full invitation cards',
    },
    {
        id: 'birthday-invitations-cards', cat: 'Design',
        img: 'https://images.unsplash.com/photo-1530103862676-de8892ebeea0?auto=format&fit=crop&w=800&q=80',
        title: 'Birthday Invitations Cards',
        desc: 'Vibrant, personalised birthday cards and e-invites for any theme.',
    },
    {
        id: 'engagement-invitations-cards', cat: 'Design',
        img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
        title: 'Engagement Invitations Cards',
        desc: 'Celebrate the big "Yes!" with sophisticated engagement invitations.',
    },
    {
        id: 'housewarming-invitations-cards', cat: 'Design',
        img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
        title: 'Housewarming Invitations Cards',
        desc: 'Warm, welcoming invites for your new home celebration.',
    },
    {
        id: 'corporate-invitations-cards', cat: 'Design',
        img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
        title: 'Corporate Invitations Cards',
        desc: 'Polished, brand-aligned corporate event invitations.',
    },
    {
        id: 'website-development', cat: 'Websites',
        img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
        title: 'Website Development',
        desc: 'Custom full-stack websites that are fast, responsive, and brand-aligned.',
    },
    {
        id: 'shopping-applications', cat: 'Websites',
        img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
        title: 'Shopping Applications',
        desc: 'E-commerce mobile apps and UI/UX designs. Seamless shopping experiences.',
    },
    {
        id: 'restaurant-branding', cat: 'Branding',
        img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        title: 'Restaurant Branding',
        desc: 'Full restaurant branding including menus and social media visuals.',
    },
    {
        id: 'logo-designs', cat: 'Branding',
        img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
        title: 'Logo Designs',
        desc: 'Unique, memorable, and timeless logos that perfectly capture your identity.',
    },
    {
        id: 'business-cards', cat: 'Branding',
        img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
        title: 'Business Cards',
        desc: 'Premium business card designs. Minimalist, luxury, or creative.',
    },
];

export const processSteps = [
    {
        num: '01',
        Icon: MessageCircle,
        title: 'Consultation',
        desc: 'We discuss your vision, requirements, and style preferences in detail.',
    },
    {
        num: '02',
        Icon: Pencil,
        title: 'Concept Creation',
        desc: 'Initial concepts and mood board crafted based on your brief.',
    },
    {
        num: '03',
        Icon: Eye,
        title: 'Design Preview',
        desc: 'Share the first draft for your review with a visual walkthrough.',
    },
    {
        num: '04',
        Icon: RefreshCcw,
        title: 'Revisions',
        desc: "Refine until it's perfect — up to 3 revision rounds included.",
    },
    {
        num: '05',
        Icon: CheckCircle2,
        title: 'Final Delivery',
        desc: 'Production-ready files delivered in all required formats.',
    },
];

export const webDevFeatures = [
    {
        Icon: Code2,
        title: 'Custom Built From Scratch',
        desc: 'No templates, no page builders. Every line of code is crafted uniquely for your brand and goals.',
    },
    {
        Icon: Smartphone,
        title: 'Fully Responsive Design',
        desc: 'Pixel-perfect on every device — mobile, tablet, and desktop — ensuring a seamless user experience.',
    },
    {
        Icon: Zap,
        title: 'Blazing Fast Performance',
        desc: 'Optimised for speed and SEO. Your visitors get instant load times and search engines reward you.',
    },
    {
        Icon: ShieldCheck,
        title: 'Secure & Scalable',
        desc: 'Built with security best practices and architecture that grows with your business without limits.',
    },
];

export const webDevStats = [
    { num: '40+', label: 'Sites Delivered' },
    { num: '3+', label: 'Years in Dev' },
    { num: '100%', label: 'On-Time' },
];

export const testimonials = [
    {
        name: 'Priya S.',
        role: 'Bride — Wedding Invitation Client',
        initials: 'PS',
        color: '#c084fc',
        text: '"My wedding invitations were absolutely stunning. Every guest complimented them. The attention to detail and the luxury feel was exactly what I dreamed of. Highly recommend!"',
        stars: 5,
    },
    {
        name: 'Rohan M.',
        role: 'Startup Founder — Website Client',
        initials: 'RM',
        color: '#60a5fa',
        text: '"Chaitanya built our product landing page from scratch. Clean code, blazing fast, and the design wowed our investors. Delivered ahead of schedule with zero issues."',
        stars: 5,
    },
    {
        name: 'Sneha K.',
        role: 'Event Organiser — Design Client',
        initials: 'SK',
        color: '#f472b6',
        text: '"The birthday invitation suite was vibrant and perfectly on-theme. Quick turnaround, multiple revisions accommodated, and the final files were print-ready. Brilliant work!"',
        stars: 5,
    },
    {
        name: 'Arjun D.',
        role: 'Restaurant Owner — Branding Client',
        initials: 'AD',
        color: '#34d399',
        text: "Complete branding package — logo, menu design, social media templates. The work transformed our restaurant's visual identity.We've seen more footfall since the rebrand.",
        stars: 5,
    },
    {
        name: 'Kavya R.',
        role: 'Blogger — Portfolio Website',
        initials: 'KR',
        color: '#fb923c',
        text: '"My new portfolio site is everything I envisioned and more. Dark/light mode, smooth animations, and it loads so fast. My clients are seriously impressed."',
        stars: 5,
    },
];
