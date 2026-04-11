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
        img: '/images/services/wedding.png',
        accent: 'linear-gradient(135deg,#c8822a,#f0c060)',
        tag: 'Most Loved',
    },
    {
        id: 'birthday-invitations-cards',
        Icon: Gift,
        title: 'Birthday Invitations Cards',
        desc: 'Vibrant, personalised birthday cards and e-invites. Fun or formal — every theme, any age, any style you imagine.',
        cta: 'Create Yours',
        img: '/images/services/birthday.png',
        accent: 'linear-gradient(135deg,#7c3aed,#ec4899)',
        tag: 'Fan Favourite',
    },
    {
        id: 'engagement-invitations-cards',
        Icon: Gem,
        title: 'Engagement Invitations Cards',
        desc: 'Celebrate the big "Yes!" with sophisticated engagement invitations. Romantic designs that capture the joy of the moment.',
        cta: 'Design Now',
        img: '/images/services/engagement.png',
        accent: 'linear-gradient(135deg,#e91e8c,#ff6b9d)',
        tag: 'Romantic',
    },
    {
        id: 'housewarming-invitations-cards',
        Icon: Home,
        title: 'Housewarming Invitations Cards',
        desc: 'Warm, welcoming invites for your new home celebration. Charming illustrations and clean layouts that set the perfect tone.',
        cta: 'Get Started',
        img: '/images/services/housewarming.png',
        accent: 'linear-gradient(135deg,#059669,#34d399)',
        tag: 'Warm & Cozy',
    },
    {
        id: 'corporate-invitations-cards',
        Icon: Building2,
        title: 'Corporate Invitations Cards',
        desc: 'Polished, brand-aligned corporate event invitations for product launches, conferences, and annual functions.',
        cta: 'Explore',
        img: '/images/services/corporate.png',
        accent: 'linear-gradient(135deg,#1e40af,#3b82f6)',
        tag: 'Enterprise',
    },
    {
        id: 'custom-event-cards',
        Icon: CalendarDays,
        title: 'Custom Event Cards',
        desc: "Baby showers, anniversaries, graduations — any occasion. Tell us your vision and we'll craft a one-of-a-kind invite.",
        cta: 'Customise',
        img: '/images/services/custom-events.png',
        accent: 'linear-gradient(135deg,#d97706,#fbbf24)',
        tag: 'Any Occasion',
    },
    {
        id: 'banners-posters',
        Icon: ImageIcon,
        title: 'Banners & Posters',
        desc: 'High-impact social media banners, YouTube channel art, event posters, and promotional flyers that demand attention.',
        cta: 'Order Banner',
        img: '/images/services/banners-posters.png',
        accent: 'linear-gradient(135deg,#dc2626,#f97316)',
        tag: 'High Impact',
    },
    {
        id: 'wallpaper-design',
        Icon: Wallpaper,
        title: 'Wallpaper Design',
        desc: 'Stunning desktop and mobile wallpapers — abstract art, brand-themed, motivational quotes, or completely custom.',
        cta: 'Get Wallpaper',
        img: '/images/services/wallpaper-design.png',
        accent: 'linear-gradient(135deg,#6d28d9,#7c3aed)',
        tag: '4K Quality',
    },
    {
        id: 'website-development',
        Icon: Globe,
        title: 'Website Development',
        desc: 'Custom full-stack websites that are fast, responsive, and brand-aligned. From landing pages to complex web apps.',
        cta: 'Build Site',
        img: '/images/services/website-development.png',
        accent: 'linear-gradient(135deg,#0891b2,#06b6d4)',
        tag: 'Full-Stack',
    },
    {
        id: 'shopping-applications',
        Icon: ShoppingCart,
        title: 'Shopping Applications',
        desc: 'E-commerce mobile apps and UI/UX designs. Seamless shopping experiences optimized for conversions.',
        cta: 'Build App',
        img: '/images/services/shopping-applications.png',
        accent: 'linear-gradient(135deg,#10b981,#34d399)',
        tag: 'E-Commerce',
    },
    {
        id: 'restaurant-branding',
        Icon: Utensils,
        title: 'Restaurant Branding',
        desc: 'Full restaurant branding including menus, table tents, coasters, and social media appetizing visuals.',
        cta: 'Brand Now',
        img: '/images/services/restaurant-branding.png',
        accent: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
        tag: 'Appetising',
    },
    {
        id: 'logo-designs',
        Icon: PenTool,
        title: 'Logo Designs',
        desc: 'Unique, memorable, and timeless logos that perfectly capture your brand identity and vision.',
        cta: 'Design Logo',
        img: '/images/services/logo-designs.png',
        accent: 'linear-gradient(135deg,#3b82f6,#60a5fa)',
        tag: 'Brand Identity',
    },
    {
        id: 'business-cards',
        Icon: CreditCard,
        title: 'Business Cards',
        desc: 'Premium business card designs. Minimalist, luxury, or creative — leave a lasting professional impression.',
        cta: 'Order Cards',
        img: '/images/services/business-cards.png',
        accent: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        tag: 'Professional',
    },
];

export const categories = ['All', 'Design', 'Websites', 'Branding'];

export const projects = [
    {
        id: 'wedding-invitations-cards', cat: 'Design',
        img: '/images/services/wedding.png',
        title: 'Wedding Invitations Cards',
        desc: 'Elegant, timeless wedding suites — save-the-dates and full invitation cards',
    },
    {
        id: 'birthday-invitations-cards', cat: 'Design',
        img: '/images/services/birthday.png',
        title: 'Birthday Invitations Cards',
        desc: 'Vibrant, personalised birthday cards and e-invites for any theme.',
    },
    {
        id: 'engagement-invitations-cards', cat: 'Design',
        img: '/images/services/engagement.png',
        title: 'Engagement Invitations Cards',
        desc: 'Celebrate the big "Yes!" with sophisticated engagement invitations.',
    },
    {
        id: 'housewarming-invitations-cards', cat: 'Design',
        img: '/images/services/housewarming.png',
        title: 'Housewarming Invitations Cards',
        desc: 'Warm, welcoming invites for your new home celebration.',
    },
    {
        id: 'corporate-invitations-cards', cat: 'Design',
        img: '/images/services/corporate.png',
        title: 'Corporate Invitations Cards',
        desc: 'Polished, brand-aligned corporate event invitations.',
    },
    {
        id: 'custom-event-cards', cat: 'Design',
        img: '/images/services/custom-events.png',
        title: 'Custom Event Cards',
        desc: 'Baby showers, anniversaries, graduations — any occasion.',
    },
    {
        id: 'banners-posters', cat: 'Design',
        img: '/images/services/banners-posters.png',
        title: 'Banners & Posters',
        desc: 'High-impact social media banners, YouTube channel art, event posters.',
    },
    {
        id: 'wallpaper-design', cat: 'Design',
        img: '/images/services/wallpaper-design.png',
        title: 'Wallpaper Design',
        desc: 'Stunning desktop and mobile wallpapers — abstract art, brand-themed.',
    },
    {
        id: 'website-development', cat: 'Websites',
        img: '/images/services/website-development.png',
        title: 'Website Development',
        desc: 'Custom full-stack websites that are fast, responsive, and brand-aligned.',
    },
    {
        id: 'shopping-applications', cat: 'Websites',
        img: '/images/services/shopping-applications.png',
        title: 'Shopping Applications',
        desc: 'E-commerce mobile apps and UI/UX designs. Seamless shopping experiences.',
    },
    {
        id: 'restaurant-branding', cat: 'Branding',
        img: '/images/services/restaurant-branding.png',
        title: 'Restaurant Branding',
        desc: 'Full restaurant branding including menus and social media visuals.',
    },
    {
        id: 'logo-designs', cat: 'Branding',
        img: '/images/services/logo-designs.png',
        title: 'Logo Designs',
        desc: 'Unique, memorable, and timeless logos that perfectly capture your identity.',
    },
    {
        id: 'business-cards', cat: 'Branding',
        img: '/images/services/business-cards.png',
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
        text: "Complete branding package — logo, menu design, social media templates. The work transformed our restaurant's visual identity. We've seen more footfall since the rebrand.",
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
