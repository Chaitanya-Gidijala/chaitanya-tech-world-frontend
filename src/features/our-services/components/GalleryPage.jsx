import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Star, CheckCircle2, Sparkles, Clock, Award,
    Shield, Zap, ArrowRight, Phone, Mail, X, ChevronLeft, ChevronRight,
    Heart, Gift, Gem, Home, Building2, CalendarDays, ImageIcon, Wallpaper, Globe,
    Layers, Palette, Printer, Package, MessageSquare, Users, Eye, Download,
    ShoppingCart, Utensils, PenTool, CreditCard
} from 'lucide-react';
import { services, projects } from '../config/photoEditorData';
import '../styles/OurServices_v1.css';

/* â”€â”€ Perâ€‘service rich data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SERVICE_DATA = {
    'engagement-invitations-cards': {
        tagline: 'Celebrate the Big "Yes!"',
        heroImg: '/images/services/engagement.png',
        accentColor: '#e91e8c',
        accentGradient: 'linear-gradient(135deg,#e91e8c,#ff6b9d)',
        features: [
            { icon: Palette, title: 'Romantic Designs', desc: 'Blush, gold, floral, minimal â€” pick a theme that tells your love story.' },
            { icon: Printer, title: 'Print-Ready Files', desc: 'High-res 300 DPI files perfectly sized for professional printing.' },
            { icon: Download, title: 'Digital E-invites', desc: 'Shareable JPG/PDF cards optimised for WhatsApp & social media.' },
            { icon: MessageSquare, title: 'Custom Wording', desc: 'Every word personalised â€” bilingual options available on request.' },
            { icon: Clock, title: '48-hr Turnaround', desc: 'Rush deliveries available. We never miss your special date.' },
            { icon: Eye, title: 'Unlimited Previews', desc: 'Review and request changes until every detail is perfect.' },
        ],
        packages: [
            { name: 'Classic', price: '₹299', features: ['1 Design Concept', 'Print-Ready PDF', '3 Revisions', '48-hr Delivery'], popular: false },
            { name: 'Premium', price: '₹499', features: ['3 Design Concepts', 'Print + Digital Files', 'Unlimited Revisions', '24-hr Delivery', 'Matching RSVP Card'], popular: true },
            { name: 'Luxury', price: '₹999', features: ['5 Concepts + Mockups', 'Full Suite (Invite, RSVP, Thank-You)', 'Priority Support', 'Same-Day Delivery', 'Social Media Kit'], popular: false },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1607604276583-e89b153e83a3?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1546193430-c2d207739ed7?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1601314985946-4f0b90202f53?auto=format&fit=crop&w=800&q=80',
        ],
        stats: [{ val: '2,400+', label: 'Couples Served' }, { val: '4.9â˜…', label: 'Star Rating' }, { val: '48 hr', label: 'Avg Delivery' }, { val: '100%', label: 'Satisfaction' }],
        process: ['Brief & Vision', 'Concept Design', 'Your Feedback', 'Final Delivery'],
        faq: [
            { q: 'How many revisions are included?', a: 'Classic: 3, Premium: Unlimited, Luxury: Unlimited.' },
            { q: 'Do you offer bilingual invitations?', a: 'Yes! English + Hindi / Telugu / Tamil and more on request.' },
            { q: 'What formats do I receive?', a: 'Print-ready PDF (300 DPI) and web-optimised JPG/PNG for digital sharing.' },
        ],
    },
    'wedding-invitations-cards': {
        tagline: 'Begin Forever in Style',
        heroImg: '/images/services/wedding.png',
        accentColor: '#c8822a',
        accentGradient: 'linear-gradient(135deg,#c8822a,#f0c060)',
        features: [
            { icon: Palette, title: 'Bespoke Suites', desc: 'Save-the-dates, full invitations, RSVP cards & thank-you notes â€” complete wedding suite.' },
            { icon: Printer, title: 'Luxury Print Files', desc: '300 DPI files ready for offset, letterpress or foil printing.' },
            { icon: Download, title: 'Digital Invites', desc: 'Beautiful animated digital versions for social sharing.' },
            { icon: MessageSquare, title: 'Multi-language', desc: 'English, Hindi, Telugu, Tamil and more.' },
            { icon: Clock, title: 'On-time Every Time', desc: 'Rush delivery guaranteed for urgent wedding timelines.' },
            { icon: Package, title: 'Complete Stationery', desc: 'Menu cards, table numbers, program booklets â€” we do it all.' },
        ],
        packages: [
            { name: 'Intimate', price: '₹399', features: ['1 Invite Design', 'Digital PDF', '3 Revisions', '48-hr Delivery'], popular: false },
            { name: 'Grand', price: '₹799', features: ['3 Concepts', 'Full Print Suite', 'Unlimited Revisions', '24-hr Delivery', 'Envelope Liner Design'], popular: true },
            { name: 'Royal', price: '₹1,499', features: ['Complete Wedding Suite', '5 Concepts + Mockups', 'Priority Support', 'Same-Day Delivery', 'Social Media Set'], popular: false },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1607604276583-e89b153e83a3?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1601314985946-4f0b90202f53?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1546193430-c2d207739ed7?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
        ],
        stats: [{ val: '5,000+', label: 'Weddings Designed' }, { val: '4.9â˜…', label: 'Star Rating' }, { val: '6 yrs', label: 'Experience' }, { val: '100%', label: 'Love Guaranteed' }],
        process: ['Consultation', 'Mood Board', 'Design & Proof', 'Final Files'],
        faq: [
            { q: 'Can I see a physical proof?', a: 'Yes, we send a PDF proof before final delivery. Physical samples available on the Royal plan.' },
            { q: 'Do you design for Indian weddings?', a: 'Absolutely â€” traditional, fusion, or modern minimalist, we handle all cultural styles.' },
        ],
    },
    'birthday-invitations-cards': {
        tagline: 'Make Every Birthday Unforgettable',
        heroImg: '/images/services/birthday.png',
        accentColor: '#7c3aed',
        accentGradient: 'linear-gradient(135deg,#7c3aed,#ec4899)',
        features: [
            { icon: Sparkles, title: 'Any Theme', desc: "From princesses to superheroes, 1st birthdays to 100th â€” we cover every theme." },
            { icon: Palette, title: 'Vibrant Designs', desc: 'Colourful, playful and premium designs that stand out.' },
            { icon: Download, title: 'E-invite Ready', desc: 'WhatsApp & Instagram-ready files for instant sharing.' },
            { icon: Clock, title: 'Fast Turnaround', desc: '24-hr rush available so you\'re never caught off-guard.' },
            { icon: Package, title: 'Party Bundle', desc: 'Add table cards, banners, photo-frames for the party.' },
            { icon: Eye, title: 'Free Preview', desc: 'See your design before paying the remainder.' },
        ],
        packages: [
            { name: 'Fun', price: '₹99', features: ['1 Design', 'Digital JPG', '2 Revisions', '48-hr Delivery'], popular: false },
            { name: 'Party', price: '₹299', features: ['3 Designs', 'Print + Digital', 'Unlimited Revisions', '24-hr Delivery', 'Matching Banner'], popular: true },
            { name: 'Bash', price: '₹499', features: ['5 Concepts', 'Full Party Kit', 'Priority Queue', 'Same-Day', 'Social Media Story Set'], popular: false },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1601314985946-4f0b90202f53?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1530103862676-de8892ebeea0?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
        ],
        stats: [{ val: '3,200+', label: 'Happy Clients' }, { val: '4.8â˜…', label: 'Rating' }, { val: '24 hr', label: 'Rush Delivery' }, { val: '50+', label: 'Themes' }],
        process: ['Pick Theme', 'Design Draft', 'Review', 'Celebrate!'],
        faq: [
            { q: 'Can I add a photo to the invitation?', a: 'Yes! Photo-based invitations are available on all plans.' },
            { q: 'What file formats do I get?', a: 'JPG for WhatsApp sharing, PDF for printing, PNG with transparent background.' },
        ],
    },
    'housewarming-invitations-cards': {
        tagline: 'Welcome Guests to Your New Chapter',
        heroImg: '/images/services/housewarming.png',
        accentColor: '#059669',
        accentGradient: 'linear-gradient(135deg,#059669,#34d399)',
        features: [
            { icon: Home, title: 'Warm Aesthetics', desc: 'Cosy illustrations and architectural touches that say "home."' },
            { icon: Palette, title: 'Luxury to Minimal', desc: 'Vastu-themed traditional or sleek modern â€” you choose the vibe.' },
            { icon: Package, title: 'Complete Set', desc: 'Invitation + directional cards + thank-you notes.' },
            { icon: Download, title: 'Digital Ready', desc: 'WhatsApp-friendly sizes ready to forward to guests.' },
            { icon: Clock, title: 'Quick Delivery', desc: '48-hour standard; 24-hr rush available.' },
            { icon: Eye, title: 'Preview First', desc: 'Approve a proof before we send the final files.' },
        ],
        packages: [
            { name: 'Cosy', price: '₹99', features: ['1 Design', 'Digital PDF', '3 Revisions', '48-hr Delivery'], popular: false },
            { name: 'Warm', price: '₹199', features: ['3 Designs', 'Print + Digital', 'Unlimited Revisions', '24-hr Delivery', 'Direction Card'], popular: true },
            { name: 'Grand', price: '₹399', features: ['Complete Suite', '5 Concepts', 'Priority Support', 'Same-Day', 'Social Story Set'], popular: false },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1601314985946-4f0b90202f53?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583847268964-b28e50b712b7?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
        ],
        stats: [{ val: '1,800+', label: 'Homes Celebrated' }, { val: '4.9â˜…', label: 'Rating' }, { val: '48 hr', label: 'Delivery' }, { val: '100%', label: 'Satisfaction' }],
        process: ['Discuss Vision', 'Design Draft', 'Your Changes', 'Files Delivered'],
        faq: [
            { q: 'Can I include a map or directions?', a: 'Yes! Direction cards and location maps can be added on Warm and Grand plans.' },
        ],
    },
    'corporate-invitations-cards': {
        tagline: 'Impress Clients & Stakeholders',
        heroImg: '/images/services/corporate.png',
        accentColor: '#1e40af',
        accentGradient: 'linear-gradient(135deg,#1e40af,#3b82f6)',
        features: [
            { icon: Building2, title: 'Brand-Aligned', desc: 'We match your brand guidelines, logo colours and typography to the letter.' },
            { icon: Layers, title: 'Event Types', desc: 'Product launches, conferences, galas, AGMs, award nights.' },
            { icon: Package, title: 'Full Stationery', desc: 'Invitations, agenda cards, name badges, banners â€” end to end.' },
            { icon: Printer, title: 'Print-Optimal', desc: 'CMYK colour mode with bleed & crop marks for professional print.' },
            { icon: Shield, title: 'NDA Available', desc: 'We sign NDAs for confidential brand launches on request.' },
            { icon: Clock, title: 'Deadline-Driven', desc: 'Corporate timelines respected â€” no exceptions.' },
        ],
        packages: [
            { name: 'Standard', price: '₹499', features: ['1 Invite Design', 'Brand Aligned', '3 Revisions', '48-hr Delivery'], popular: false },
            { name: 'Business', price: '₹1,499', features: ['3 Concepts', 'Full Event Kit', 'Unlimited Revisions', '24-hr Delivery', 'Email Banner'], popular: true },
            { name: 'Enterprise', price: 'Custom', features: ['Full Brand Package', 'Dedicated Designer', 'Priority Support', 'Same-Day', 'NDA Included'], popular: false },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1558236714-d9450f859349?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1614717201948-389c687e52ac?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1559339352-1791c0021ee2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
        ],
        stats: [{ val: '900+', label: 'Brands Served' }, { val: '4.9â˜…', label: 'Rating' }, { val: '24 hr', label: 'Rush Delivery' }, { val: '5 yrs', label: 'Experience' }],
        process: ['Brand Brief', 'Design Build', 'Stakeholder Review', 'Print-Ready'],
        faq: [
            { q: 'Can you match our existing brand guidelines?', a: 'Absolutely. Share your brand kit and we\'ll ensure pixel-perfect brand consistency.' },
            { q: 'Do you handle bulk printing orders?', a: 'We partner with premium print houses â€” ask us for a printing quote.' },
        ],
    },
    'custom-event-cards': {
        tagline: 'Any Occasion. Any Vision.',
        heroImg: '/images/services/custom-events.png',
        accentColor: '#d97706',
        accentGradient: 'linear-gradient(135deg,#d97706,#fbbf24)',
        features: [
            { icon: CalendarDays, title: 'Every Occasion', desc: 'Baby showers, anniversaries, graduations, farewells â€” nothing is too unique.' },
            { icon: Palette, title: '100% Custom', desc: 'Your brief is our canvas. Bring any idea and we\'ll make it reality.' },
            { icon: Users, title: 'Group Discounts', desc: 'Order for large events with bulk-pricing available.' },
            { icon: Download, title: 'Multi-Format', desc: 'Digital + print-ready files included in all packages.' },
            { icon: Clock, title: 'Fast & Flexible', desc: 'Work around your timeline, not ours.' },
            { icon: Award, title: 'Award-Winning', desc: 'Recognised for creativity in independent design reviews.' },
        ],
        packages: [
            { name: 'Solo', price: '₹349', features: ['1 Custom Design', 'Digital File', '3 Revisions', '48-hr Delivery'], popular: false },
            { name: 'Duo', price: '₹799', features: ['3 Concepts', 'Print + Digital', 'Unlimited Revisions', '24-hr Delivery', 'Social Story Set'], popular: true },
            { name: 'Multi', price: '₹1,499', features: ['Full Suite Design', '5 Concepts', 'Priority Queue', 'Same-Day', 'Matching Decor Set'], popular: false },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1601314985946-4f0b90202f53?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1561726053-488f58b0ab7f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80',
        ],
        stats: [{ val: '4,000+', label: 'Events Designed' }, { val: '4.9â˜…', label: 'Rating' }, { val: '48 hr', label: 'Standard' }, { val: 'Any', label: 'Occasion' }],
        process: ['Share Brief', 'Design Magic', 'Tweaks & Review', 'Delivered!'],
        faq: [
            { q: 'Can I send a rough sketch or reference image?', a: 'Yes! We love references. Send anything that inspires you.' },
        ],
    },
    'banners-posters': {
        tagline: 'Designs That Demand Attention',
        heroImg: '/images/services/banners-posters.png',
        accentColor: '#dc2626',
        accentGradient: 'linear-gradient(135deg,#dc2626,#f97316)',
        features: [
            { icon: ImageIcon, title: 'All Formats', desc: 'Social banners, YouTube art, Flex hoardings, A4/A3 posters â€” every size.' },
            { icon: Zap, title: 'High-Impact', desc: 'Bold compositions that stop the scroll and drive action.' },
            { icon: Printer, title: 'Flex-Ready', desc: 'Large-format print files in CMYK with correct bleed.' },
            { icon: Package, title: 'Social Media Kit', desc: 'Posts, stories, covers â€” full kit in one order.' },
            { icon: Clock, title: 'Rapid Execution', desc: '24-hr turnaround for urgent campaigns.' },
            { icon: Eye, title: 'Brand-Safe', desc: 'On-brand colours and messaging, every time.' },
        ],
        packages: [
            { name: 'Single', price: '₹199', features: ['1 Banner/Poster', 'Any Size', '3 Revisions', '48-hr Delivery'], popular: false },
            { name: 'Campaign', price: '₹999', features: ['5 Creatives', 'Print + Social', 'Unlimited Revisions', '24-hr Delivery', 'Brand Consistency'], popular: true },
            { name: 'Full Kit', price: '₹1,999', features: ['Unlimited Creatives', 'All Platforms', 'Priority Queue', 'Same-Day', 'Source Files'], popular: false },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558236714-d9450f859349?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1533135091724-62cb5553b49c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
        ],
        stats: [{ val: '8,000+', label: 'Designs Delivered' }, { val: '4.9â˜…', label: 'Rating' }, { val: '24 hr', label: 'Rush' }, { val: '100%', label: 'Brand-Safe' }],
        process: ['Brief & Sizes', 'Design Creation', 'Your Approval', 'All Files Sent'],
        faq: [
            { q: 'What file format for flex printing?', a: 'We deliver AI/PDF/TIFF in CMYK at 300 DPI with 3mm bleed â€” print-house ready.' },
        ],
    },
    'wallpaper-design': {
        tagline: 'Art for Every Screen',
        heroImg: '/images/services/wallpaper-design.png',
        accentColor: '#6d28d9',
        accentGradient: 'linear-gradient(135deg,#6d28d9,#7c3aed)',
        features: [
            { icon: Wallpaper, title: 'Any Device', desc: 'Desktop 4K, mobile, tablet, dual-monitor â€” all aspect ratios.' },
            { icon: Palette, title: 'Every Style', desc: 'Abstract, minimal, dark, neon, nature, brand-themed.' },
            { icon: Package, title: 'Bulk Packs', desc: 'Monthly wallpaper packs for content creators and brands.' },
            { icon: Download, title: 'Instant Download', desc: 'High-res PNG/JPG ready to set on any device.' },
            { icon: Zap, title: 'Quick Design', desc: '24-hr standard turnaround.' },
            { icon: Eye, title: 'Custom Quotes', desc: 'Add motivational text, name or logo on request.' },
        ],
        packages: [
            { name: 'Single', price: '₹199', features: ['1 Wallpaper', '2 Sizes', '2 Revisions', '24-hr Delivery'], popular: false },
            { name: 'Pack', price: '₹599', features: ['5 Wallpapers', 'All Sizes', 'Unlimited Revisions', '24-hr Delivery', 'Custom Text'], popular: true },
            { name: 'Brand', price: '₹1,299', features: ['20 Wallpapers', 'Brand-Themed', 'Priority Queue', 'Same-Day', 'Source Files'], popular: false },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=800&q=80',
        ],
        stats: [{ val: '12K+', label: 'Downloads' }, { val: '4.8â˜…', label: 'Rating' }, { val: '24 hr', label: 'Delivery' }, { val: '4K', label: 'Max Res' }],
        process: ['Choose Style', 'Design Draft', 'Review & Adjust', 'Download!'],
        faq: [
            { q: `Can I get a wallpaper for my brand's office screens?`, a: 'Yes! Corporate brand-themed wallpacks are a popular option.' },
        ],
    },
    'website-development': {
        tagline: 'Websites That Work as Hard as You Do',
        heroImg: '/images/services/website-development.png',
        accentColor: '#0891b2',
        accentGradient: 'linear-gradient(135deg,#0891b2,#06b6d4)',
        features: [
            { icon: Globe, title: 'Full-Stack Dev', desc: 'React, Next.js, Node, Spring Boot â€” modern stack, scalable architecture.' },
            { icon: Zap, title: 'Blazing Fast', desc: '90+ Lighthouse scores, optimised assets, CDN deployed.' },
            { icon: Shield, title: 'Secure & Stable', desc: 'SSL, best-practice security headers, regular backups.' },
            { icon: Palette, title: 'Custom Design', desc: 'Pixel-perfect UI designed from scratch to match your brand.' },
            { icon: Package, title: 'SEO Ready', desc: 'Semantic HTML, meta tags, schema markup â€” built for search engines.' },
            { icon: Clock, title: 'Agile Delivery', desc: 'Sprint-based development with weekly demos.' },
        ],
        packages: [
            { name: 'Landing', price: '₹3,999', features: ['Single Page Site', 'Mobile Responsive', 'Contact Form', '7-day Delivery'], popular: false },
            { name: 'Business', price: '₹14,999', features: ['5-Page Site', 'CMS Integration', 'SEO Setup', '14-day Delivery', 'Analytics'], popular: true },
            { name: 'Enterprise', price: 'Custom', features: ['Full Web App', 'API Integrations', 'Auth System', 'Dedicated PM', '90-day Support'], popular: false },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1605379399843-5870eea9b74e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
        ],
        stats: [{ val: '200+', label: 'Sites Launched' }, { val: '4.9â˜…', label: 'Rating' }, { val: '99.9%', label: 'Uptime' }, { val: '90+', label: 'Lighthouse' }],
        process: ['Discovery', 'Design Sprint', 'Development', 'Launch & Support'],
        faq: [
            { q: 'Do you provide hosting?', a: 'Yes, we can assist with Vercel, Netlify or VPS hosting setup.' },
            { q: 'Will the site be mobile friendly?', a: 'Every site is 100% mobile-first responsive.' },
        ],
    },
    'shopping-applications': {
        tagline: 'E-Commerce Built for Growth',
        heroImg: '/images/services/shopping-applications.png',
        accentColor: '#10b981',
        accentGradient: 'linear-gradient(135deg,#10b981,#34d399)',
        features: [
            { icon: ShoppingCart, title: 'Seamless UI', desc: 'Intuitive user flows that reduce cart abandonment.' },
            { icon: Zap, title: 'High Performance', desc: 'Fast loading times essential for mobile shoppers.' },
            { icon: Shield, title: 'Secure Checkouts', desc: 'Designed to integrate with industry-standard payment gateways.' },
            { icon: Palette, title: 'Brand Focused', desc: 'Custom tailored aesthetics that build trust and loyalty.' },
            { icon: Package, title: 'Inventory Management', desc: 'Clear layouts for products, variations, and filtering.' },
            { icon: Eye, title: 'Conversion Optimized', desc: 'Strategic placement of CTAs and trust signals.' },
        ],
        packages: [
            { name: 'Starter', price: '₹9,999', features: ['UI/UX Design', 'Up to 10 Screens', 'Mobile Responsive', '14-day Delivery'], popular: false },
            { name: 'Pro', price: '₹24,999', features: ['Full App Design', 'Prototyping', 'Design System', '30-day Delivery', 'Dark Mode'], popular: true },
            { name: 'Enterprise', price: 'Custom', features: ['Complete Platform', 'User Research', 'Custom Animations', 'Dedicated Team', 'Priority Support'], popular: false },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1556741533-6e4a05e1a179?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
        ],
        stats: [{ val: '50+', label: 'Apps Designed' }, { val: '4.9â˜…', label: 'Rating' }, { val: '3x', label: 'Conversion Avg' }, { val: '100%', label: 'Responsive' }],
        process: ['Wireframing', 'Visual Design', 'Prototyping', 'Handoff'],
        faq: [
            { q: 'Do you also develop the app?', a: 'Yes, we offer both UI/UX design and full-stack development services.' },
            { q: 'Will I get the source files?', a: 'Absolutely, you will receive Figma/XD source files upon completion.' },
        ],
    },
    'restaurant-branding': {
        tagline: 'Appetizing Brand Identities',
        heroImg: '/images/services/restaurant-branding.png',
        accentColor: '#f59e0b',
        accentGradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
        features: [
            { icon: Utensils, title: 'Menu Design', desc: 'Appetizing layous that highlight your best dishes.' },
            { icon: Palette, title: 'Brand Vibe', desc: 'Colors and typography that match your culinary style.' },
            { icon: ImageIcon, title: 'Social Media', desc: 'Mouth-watering templates for Instagram and Facebook.' },
            { icon: Printer, title: 'Print Collateral', desc: 'Table tents, coasters, business cards, and flyers.' },
            { icon: Eye, title: 'Food Photography Edits', desc: 'Enhancing your food photos to look their absolute best.' },
            { icon: Building2, title: 'Signage', desc: 'Eye-catching outdoor and indoor signs.' },
        ],
        packages: [
            { name: 'Bistro', price: '₹3,999', features: ['Menu Design', 'Logo Refinement', '2 Social Templates', '7-day Delivery'], popular: false },
            { name: 'Restaurant', price: '₹12,999', features: ['Full Menu', 'Complete Brand Kit', 'Print Collateral', '14-day Delivery', 'Photo Edits'], popular: true },
            { name: 'Franchise', price: 'Custom', features: ['Brand Guidelines', 'Multiple Formats', 'Signage Design', 'Priority Support', 'Full Suite'], popular: false },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1559339352-1791c0021ee2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1559339352-1791c0021ee2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        ],
        stats: [{ val: '120+', label: 'Restaurants' }, { val: '4.9â˜…', label: 'Rating' }, { val: '100%', label: 'Delicious' }, { val: '5 yrs', label: 'Experience' }],
        process: ['Tasting/Briefing', 'Concept Creation', 'Refinement', 'Final Delivery'],
        faq: [
            { q: 'Can you design digital menu boards?', a: 'Yes, we design for both print menus and digital displays.' },
            { q: 'Do you take food photos?', a: 'We offer advanced photo editing for your existing food photography.' },
        ],
    },
    'logo-designs': {
        tagline: 'Timeless Brand Marks',
        heroImg: '/images/services/logo-designs.png',
        accentColor: '#3b82f6',
        accentGradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)',
        features: [
            { icon: PenTool, title: 'Custom Vectors', desc: '100% original, scalable vector designs.' },
            { icon: Palette, title: 'Color Psychology', desc: 'Strategic color selection to evoke the right emotions.' },
            { icon: Layers, title: 'Versatile', desc: 'Looks great on a billboard or a business card.' },
            { icon: Package, title: 'Brand Guidelines', desc: 'Rules for using your new logo correctly.' },
            { icon: Download, title: 'All Formats', desc: 'AI, EPS, SVG, PNG, and JPG files included.' },
            { icon: Shield, title: 'Full Ownership', desc: 'You retain full copyright of the final design.' },
        ],
        packages: [
            { name: 'Startup', price: '₹999', features: ['2 Concepts', 'High-Res Files', '3 Revisions', '4-day Delivery'], popular: false },
            { name: 'Business', price: '₹4,999', features: ['4 Concepts', 'Source Files', 'Unlimited Revisions', '7-day Delivery', 'Social Media Kit'], popular: true },
            { name: 'Brand', price: '₹6,999', features: ['6 Concepts', 'Brand Book', 'Stationery Design', 'Priority Support', 'Full Rights'], popular: false },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1626785774675-dd4159dd54e2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1626785774675-dd4159dd54e2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1626785774675-dd4159dd54e2?auto=format&fit=crop&w=800&q=80',
        ],
        stats: [{ val: '500+', label: 'Logos Crafted' }, { val: '4.8â˜…', label: 'Rating' }, { val: '4 days', label: 'Avg Turnaround' }, { val: '100%', label: 'Vector' }],
        process: ['Discovery', 'Sketching', 'Vectorizing', 'Finalizing'],
        faq: [
            { q: 'Will I get the vector source files?', a: 'Yes, source files (AI/EPS) are included in Business and Brand packages.' },
            { q: 'Can you refresh my existing logo?', a: 'Absolutely, we offer logo modernization and refinement services.' },
        ],
    },
    'business-cards': {
        tagline: 'Leave a Lasting Impression',
        heroImg: '/images/services/business-cards.png',
        accentColor: '#111827',
        accentGradient: 'linear-gradient(135deg,#1f2937,#4b5563)',
        features: [
            { icon: CreditCard, title: 'Premium Layouts', desc: 'Minimalist, luxury, or highly creative designs.' },
            { icon: Printer, title: 'Print-Ready', desc: 'Perfectly sized with bleed and crop marks.' },
            { icon: Layers, title: 'Double-Sided', desc: 'Make use of the front and back for maximum impact.' },
            { icon: Star, title: 'Special Finishes', desc: 'Designed with foil-stamping and spot-UV in mind.' },
            { icon: Users, title: 'Team Packages', desc: 'Consistent designs for your entire organization.' },
            { icon: Download, title: 'Digital Cards', desc: 'vCard or digital alternatives for networking.' },
        ],
        packages: [
            { name: 'Basic', price: '₹499', features: ['1 Concept', 'Single-Sided', 'Print-Ready PDF', '2-day Delivery'], popular: false },
            { name: 'Professional', price: '₹1,999', features: ['3 Concepts', 'Double-Sided', 'Unlimited Revisions', '3-day Delivery', 'Source Files'], popular: true },
            { name: 'Corporate', price: '₹4,999', features: ['Up to 10 Employees', 'Luxury Concepts', 'Priority Delivery', 'Digital vCard', 'Full Suite'], popular: false },
        ],
        gallery: [
            'https://images.unsplash.com/photo-1616628188859-75119c688395?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1614713568393-db826a7e0892?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1616628188859-75119c688395?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1563214539-775b81ae2cc1?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1616628188859-75119c688395?auto=format&fit=crop&w=800&q=80',
        ],
        stats: [{ val: '2,000+', label: 'Cards Designed' }, { val: '4.9â˜…', label: 'Rating' }, { val: '48 hr', label: 'Delivery' }, { val: '100%', label: 'Professional' }],
        process: ['Details Gathering', 'Layout Design', 'Revisions', 'Print Files Sent'],
        faq: [
            { q: 'Do you offer printing services?', a: 'We provide print-ready files that you can take to any professional printer.' },
            { q: 'Can you design a logo for my card?', a: 'Logo design is a separate service, but we can bundle it if needed.' },
        ],
    },
};

/* â”€â”€ Lightbox â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const Lightbox = ({ images, index, onClose, onPrev, onNext }) => (
    <AnimatePresence>
        <motion.div
            className="sp-lightbox-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="sp-lightbox-inner"
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.88, opacity: 0 }}
                onClick={e => e.stopPropagation()}
            >
                <button className="sp-lb-close" onClick={onClose}><X size={20} /></button>
                <button className="sp-lb-arrow sp-lb-prev" onClick={onPrev}><ChevronLeft size={24} /></button>
                <img src={images[index]} alt={`Gallery ${index + 1}`} className="sp-lb-img" />
                <button className="sp-lb-arrow sp-lb-next" onClick={onNext}><ChevronRight size={24} /></button>
                <div className="sp-lb-count">{index + 1} / {images.length}</div>
            </motion.div>
        </motion.div>
    </AnimatePresence>
);

/* â”€â”€ FAQ Item â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const FaqItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`sp-faq-item${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)}>
            <div className="sp-faq-q">
                <span>{q}</span>
                <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }} className="sp-faq-icon">+</motion.span>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                        className="sp-faq-a"
                    >{a}</motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const GalleryPage = ({ type }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lbIndex, setLbIndex] = useState(null);

    useEffect(() => { window.scrollTo(0, 0); }, [id]);

    /* Resolve data */
    const serviceItem = type === 'service' ? services.find(s => s.id === id) : null;
    const projectItem = type === 'project' ? projects.find(p => p.id === parseInt(id)) : null;
    const svcData = SERVICE_DATA[id] || null;

    const title = serviceItem?.title || projectItem?.title || 'Gallery';
    const basedesc = serviceItem?.desc || projectItem?.desc || '';
    const tagline = svcData?.tagline || title;
    const heroImg = svcData?.heroImg || '';
    const accentGradient = svcData?.accentGradient || 'var(--gradient-brand)';
    const gallery = svcData?.gallery || [];
    const features = svcData?.features || [];
    const packages = svcData?.packages || [];
    const stats = svcData?.stats || [];
    const process = svcData?.process || [];
    const faq = svcData?.faq || [];

    /* Lightbox helpers */
    const openLb = idx => setLbIndex(idx);
    const closeLb = () => setLbIndex(null);
    const prevImg = () => setLbIndex(i => (i - 1 + gallery.length) % gallery.length);
    const nextImg = () => setLbIndex(i => (i + 1) % gallery.length);

    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 36 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] },
    });

    return (
        <div className="sp-page">
            {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section
                className={`sp-hero${heroImg ? ' sp-hero--has-image' : ''}`}
                style={heroImg ? {
                    backgroundImage: `linear-gradient(135deg, rgba(8,4,20,0.82) 0%, rgba(8,4,20,0.62) 60%, rgba(8,4,20,0.45) 100%), url(${heroImg})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                } : {}}
            >
                <div className="sp-hero-orbs">
                    <div className="sp-orb sp-orb-1" style={{ background: svcData?.accentColor ? `${svcData.accentColor}26` : '' }} />
                    <div className="sp-orb sp-orb-2" />
                </div>
                <div className="container sp-hero-inner">
                    <motion.div {...fadeUp(0)}>
                        <button className={heroImg ? 'sp-back-btn-img' : 'pe-back-btn'} onClick={() => navigate('/services')}>
                            <ArrowLeft size={16} strokeWidth={2.5} /> Back to Home
                        </button>
                    </motion.div>
                    <motion.div {...fadeUp(0.1)} className="sp-hero-content">
                        <div className="sp-hero-badge" style={{ background: accentGradient }}>
                            <Sparkles size={13} /> Premium Service
                        </div>
                        <h1 className="sp-hero-h1">{title}</h1>
                        <p className="sp-hero-tagline">{tagline}</p>
                        <p className="sp-hero-desc">{basedesc}</p>
                        <div className="sp-hero-ctas">
                            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
                                className="sp-cta-primary" style={{ background: accentGradient }}>
                                <Phone size={16} /> Order via WhatsApp
                            </a>
                            <a href="mailto:hello@chaitanyatech.com" className={heroImg ? 'sp-cta-ghost-img' : 'sp-cta-ghost'}>
                                <Mail size={16} /> Email Us
                            </a>
                        </div>
                    </motion.div>
                    {/* Stats */}
                    {stats.length > 0 && (
                        <motion.div {...fadeUp(0.2)} className="sp-hero-stats">
                            {stats.map((s, i) => (
                                <div key={i} className="sp-hero-stat">
                                    <div className="sp-stat-val" style={{ background: accentGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.val}</div>
                                    <div className="sp-stat-label">{s.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* â”€â”€ FEATURES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {features.length > 0 && (
                <section className="sp-section sp-features-section">
                    <div className="container">
                        <motion.div {...fadeUp()} className="sp-section-head">
                            <div className="sp-section-tag" style={{ background: accentGradient }}>What's Included</div>
                            <h2 className="sp-section-title">Everything You <span className="text-gradient">Need</span></h2>
                            <p className="sp-section-sub">Professional quality, meticulous attention to detail â€” built into every order.</p>
                        </motion.div>
                        <div className="sp-features-grid">
                            {features.map((f, i) => (
                                <motion.div key={i} {...fadeUp(i * 0.07)} className="sp-feature-card">
                                    <div className="sp-feature-icon" style={{ background: accentGradient }}>
                                        <f.icon size={20} strokeWidth={1.8} color="#fff" />
                                    </div>
                                    <h3 className="sp-feature-title">{f.title}</h3>
                                    <p className="sp-feature-desc">{f.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}


            {/* -- TESTIMONIALS MARQUEE -------------------------------- */}
            <section className="sp-section sp-testimonials-section">
                <div className="container">
                    <motion.div {...fadeUp()} className="sp-section-head">
                        <div className="sp-section-tag" style={{ background: accentGradient }}>
                            <Star size={12} fill="#fff" /> Client Love
                        </div>
                        <h2 className="sp-section-title">What Our <span className="text-gradient">Clients Say</span></h2>
                        <p className="sp-section-sub">Hundreds of happy clients trust us with their most important moments.</p>
                    </motion.div>
                </div>
                {/* Marquee row 1 - scrolls left */}
                <div className="sp-marquee-wrap">
                    <div className="sp-marquee sp-marquee--left">
                        {[
                            { name: 'Priya Sharma', role: 'Bride', text: 'Absolutely stunning wedding invite! Everyone was in awe. The attention to detail was beyond our expectations.', rating: 5 },
                            { name: 'Rahul Mehta', role: 'Business Owner', text: 'Our corporate event banners looked incredibly professional. Got so many compliments from stakeholders.', rating: 5 },
                            { name: 'Ananya Reddy', role: 'Event Organiser', text: 'Fast turnaround, beautiful designs, zero hassle. Will definitely use again for our next event!', rating: 5 },
                            { name: 'Vikram Singh', role: 'Entrepreneur', text: 'The logo they designed perfectly captures our brand identity. Worth every rupee!', rating: 5 },
                            { name: 'Meera Nair', role: 'Mother', text: 'The birthday invitation was so cute and vibrant! My daughter absolutely loved her fairy tale theme.', rating: 5 },
                            { name: 'Arjun Patel', role: 'Restaurant Owner', text: 'Our menu design transformed the entire dining experience. Customers compliment it every day!', rating: 5 },
                            { name: 'Priya Sharma', role: 'Bride', text: 'Absolutely stunning wedding invite! Everyone was in awe. Duplicate for seamless loop.', rating: 5 },
                            { name: 'Rahul Mehta', role: 'Business Owner', text: 'Our corporate event banners looked incredibly professional. Duplicate for seamless loop.', rating: 5 },
                            { name: 'Ananya Reddy', role: 'Event Organiser', text: 'Fast turnaround, beautiful designs, zero hassle. Duplicate for seamless loop.', rating: 5 },
                        ].map((t, i) => (
                            <div key={i} className="sp-testi-card">
                                <div className="sp-testi-stars">
                                    {Array.from({ length: t.rating }).map((_, si) => (
                                        <Star key={si} size={14} fill={svcData?.accentColor || '#fbbf24'} color={svcData?.accentColor || '#fbbf24'} />
                                    ))}
                                </div>
                                <p className="sp-testi-text">"{t.text}"</p>
                                <div className="sp-testi-author">
                                    <div className="sp-testi-avatar" style={{ background: accentGradient }}>
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="sp-testi-name">{t.name}</div>
                                        <div className="sp-testi-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Marquee row 2 - scrolls right */}
                <div className="sp-marquee-wrap" style={{ marginTop: '1.25rem' }}>
                    <div className="sp-marquee sp-marquee--right">
                        {[
                            { name: 'Kavya Iyer', role: 'Homeowner', text: 'The housewarming card was elegant, warm, and exactly what I envisioned. Super quick delivery too!', rating: 5 },
                            { name: 'Deepak Kumar', role: 'IT Professional', text: 'My business card design is sleek and impressive. Clients are always asking who designed it!', rating: 5 },
                            { name: 'Sneha Joshi', role: 'Wedding Planner', text: 'I recommend Chaitanya Tech World to all my couples. Consistently excellent quality every time.', rating: 5 },
                            { name: 'Ravi Teja', role: 'Startup Founder', text: 'The website they built is blazing fast and looks gorgeous. Our conversions went up by 40%!', rating: 5 },
                            { name: 'Pooja Devi', role: 'Teacher', text: 'They made a beautiful invitation for my retirement party. Everyone loved it, felt very premium!', rating: 5 },
                            { name: 'Aditya Rao', role: 'Photographer', text: 'The wallpaper designs for my studio screens are absolutely breathtaking. Pure art!', rating: 5 },
                            { name: 'Kavya Iyer', role: 'Homeowner', text: 'The housewarming card duplicate for seamless loop.', rating: 5 },
                            { name: 'Deepak Kumar', role: 'IT Professional', text: 'My business card design duplicate for seamless loop.', rating: 5 },
                            { name: 'Sneha Joshi', role: 'Wedding Planner', text: 'I recommend Chaitanya Tech World duplicate for seamless loop.', rating: 5 },
                        ].map((t, i) => (
                            <div key={i} className="sp-testi-card">
                                <div className="sp-testi-stars">
                                    {Array.from({ length: t.rating }).map((_, si) => (
                                        <Star key={si} size={14} fill={svcData?.accentColor || '#fbbf24'} color={svcData?.accentColor || '#fbbf24'} />
                                    ))}
                                </div>
                                <p className="sp-testi-text">"{t.text}"</p>
                                <div className="sp-testi-author">
                                    <div className="sp-testi-avatar" style={{ background: accentGradient }}>
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="sp-testi-name">{t.name}</div>
                                        <div className="sp-testi-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* -- WHY CHOOSE US ---------------------------------------- */}
            <section className="sp-section sp-why-section">
                <div className="sp-why-bg-orb sp-why-orb-1" style={{ background: svcData?.accentColor ? `${svcData.accentColor}18` : 'hsla(260,100%,65%,0.1)' }} />
                <div className="sp-why-bg-orb sp-why-orb-2" />
                <div className="container">
                    <motion.div {...fadeUp()} className="sp-section-head">
                        <div className="sp-section-tag" style={{ background: accentGradient }}>
                            <Award size={12} /> Why Choose Us
                        </div>
                        <h2 className="sp-section-title">The <span className="text-gradient">Difference</span> You'll Feel</h2>
                        <p className="sp-section-sub">We don't just design — we craft experiences that leave a lasting impression.</p>
                    </motion.div>
                    <div className="sp-why-grid">
                        {[
                            { icon: Zap, num: '01', title: 'Lightning Fast Delivery', desc: 'We respect your deadlines like our own. Most orders delivered within 24-48 hours, with same-day rush available.', highlight: 'Same-Day Available' },
                            { icon: Shield, num: '02', title: 'Unlimited Revisions', desc: 'Not happy? We revise until you are — with no hidden charges and no questions asked on premium plans.', highlight: 'Zero Extra Cost' },
                            { icon: Star, num: '03', title: 'Premium Quality Always', desc: 'Every pixel is crafted with care. We use industry-standard tools to deliver print-ready, screen-perfect files.', highlight: '4.9 Star Average' },
                            { icon: Users, num: '04', title: 'Dedicated Support', desc: "You get a real human to talk to — not a bot. WhatsApp, email, or call — we're always reachable.", highlight: 'Reply in 30 min' },
                            { icon: Gem, num: '05', title: 'Transparent Pricing', desc: 'No surprises. What you see is what you pay. Clear packages with everything spelled out upfront.', highlight: 'No Hidden Fees' },
                            { icon: Gift, num: '06', title: 'Personalised Attention', desc: 'Every project is treated as unique. We invest time to understand your vision before a single pixel is placed.', highlight: '100% Custom Work' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                {...fadeUp(i * 0.08)}
                                className="sp-why-card"
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            >
                                <div className="sp-why-num" style={{ background: accentGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                    {item.num}
                                </div>
                                <div className="sp-why-icon-wrap" style={{ background: accentGradient }}>
                                    <item.icon size={20} color="#fff" strokeWidth={1.8} />
                                </div>
                                <h3 className="sp-why-title">{item.title}</h3>
                                <p className="sp-why-desc">{item.desc}</p>
                                <div className="sp-why-highlight" style={{ borderColor: svcData?.accentColor ? `${svcData.accentColor}40` : 'hsla(260,100%,65%,0.25)', color: svcData?.accentColor || 'var(--color-primary)' }}>
                                    <CheckCircle2 size={13} />
                                    {item.highlight}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* â”€â”€ PRICING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {packages.length > 0 && (
                <section className="sp-section sp-pricing-section">
                    <div className="container">
                        <motion.div {...fadeUp()} className="sp-section-head">
                            <div className="sp-section-tag" style={{ background: accentGradient }}>Transparent Pricing</div>
                            <h2 className="sp-section-title">Choose Your <span className="text-gradient">Package</span></h2>
                            <p className="sp-section-sub">No hidden charges. Clear pricing for every budget.</p>
                        </motion.div>
                        <div className="sp-pricing-grid">
                            {packages.map((pkg, i) => (
                                <motion.div
                                    key={i} {...fadeUp(i * 0.1)}
                                    className={`sp-pkg-card${pkg.popular ? ' popular' : ''}`}
                                >
                                    {pkg.popular && (
                                        <div className="sp-pkg-popular-badge" style={{ background: accentGradient }}>
                                            <Star size={11} fill="#fff" /> Most Popular
                                        </div>
                                    )}
                                    <div className="sp-pkg-name">{pkg.name}</div>
                                    <div className="sp-pkg-price" style={pkg.popular ? { background: accentGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}}>
                                        {pkg.price}
                                    </div>
                                    <ul className="sp-pkg-list">
                                        {pkg.features.map((feat, j) => (
                                            <li key={j} className="sp-pkg-item">
                                                <CheckCircle2 size={15} className="sp-pkg-check" style={{ color: svcData?.accentColor || 'var(--color-primary)' }} />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href="https://wa.me/919876543210"
                                        target="_blank" rel="noreferrer"
                                        className="sp-pkg-cta"
                                        style={pkg.popular ? { background: accentGradient } : {}}
                                    >
                                        Get Started <ArrowRight size={14} />
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* â”€â”€ PROCESS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {process.length > 0 && (
                <section className="sp-section sp-process-section">
                    <div className="container">
                        <motion.div {...fadeUp()} className="sp-section-head">
                            <div className="sp-section-tag" style={{ background: accentGradient }}>How It Works</div>
                            <h2 className="sp-section-title">Simple <span className="text-gradient">Process</span></h2>
                        </motion.div>
                        <div className="sp-process-steps">
                            {process.map((step, i) => (
                                <motion.div key={i} {...fadeUp(i * 0.1)} className="sp-process-step">
                                    <div className="sp-process-num" style={{ background: accentGradient }}>{i + 1}</div>
                                    {i < process.length - 1 && <div className="sp-process-connector" />}
                                    <div className="sp-process-label">{step}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {faq.length > 0 && (
                <section className="sp-section sp-faq-section">
                    <div className="container sp-faq-wrap">
                        <motion.div {...fadeUp()} className="sp-section-head">
                            <div className="sp-section-tag" style={{ background: accentGradient }}>FAQ</div>
                            <h2 className="sp-section-title">Common <span className="text-gradient">Questions</span></h2>
                        </motion.div>
                        <div className="sp-faq-list">
                            {faq.map((item, i) => <FaqItem key={i} {...item} />)}
                        </div>
                    </div>
                </section>
            )}

            {/* â”€â”€ CTA BANNER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="sp-section sp-cta-section">
                <div className="container">
                    <motion.div {...fadeUp()} className="sp-cta-card" style={{ background: accentGradient }}>
                        <div className="sp-cta-orb sp-cta-orb-1" />
                        <div className="sp-cta-orb sp-cta-orb-2" />
                        <h2 className="sp-cta-h2">Ready to Get Started?</h2>
                        <p className="sp-cta-sub">Let's bring your vision to life. Reach out now and we'll reply within 30 minutes.</p>
                        <div className="sp-cta-btns">
                            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="sp-cta-btn-white">
                                <Phone size={16} /> WhatsApp Us
                            </a>
                            <a href="mailto:hello@chaitanyatech.com" className="sp-cta-btn-outline">
                                <Mail size={16} /> Send an Email
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Lightbox */}
            {lbIndex !== null && (
                <Lightbox images={gallery} index={lbIndex} onClose={closeLb} onPrev={prevImg} onNext={nextImg} />
            )}
        </div>
    );
};

export default GalleryPage;
