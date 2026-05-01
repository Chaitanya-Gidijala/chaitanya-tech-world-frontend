import { useState, useEffect, useRef } from "react"; // Refreshing system
import "./OurServices.css";

const services = [
    {
        id: 1,
        icon: "🏢",
        title: "Business Websites",
        tag: "Most Popular",
        description:
            "Stunning, conversion-focused websites for local businesses, startups, and enterprises — built to impress clients and dominate local search.",
        features: ["Custom Design", "SEO Ready", "Mobile First", "Fast Loading"],
        price: "₹4,999",
        color: "#00d4ff",
    },
    {
        id: 2,
        icon: "🛒",
        title: "E-Commerce Stores",
        tag: "High ROI",
        description:
            "Fully functional shopping platforms with payment gateways, product management, and optimized checkout flows that drive real sales.",
        features: ["Payment Gateway", "Inventory Mgmt", "Order Tracking", "Analytics"],
        price: "₹9,999",
        color: "#ff6b35",
    },
    {
        id: 3,
        icon: "👤",
        title: "Personal & Portfolio",
        tag: "Quick Launch",
        description:
            "Elegant portfolio and personal websites for freelancers, artists, and professionals that make a lasting first impression.",
        features: ["Portfolio Gallery", "Blog Section", "Contact Forms", "Custom Domain"],
        price: "₹2,499",
        color: "#7c3aed",
    },
    {
        id: 4,
        icon: "🔍",
        title: "SEO Optimization",
        tag: "Rank Higher",
        description:
            "Full on-page and technical SEO — from keyword research to schema markup — engineered to land you on Page 1 of Google.",
        features: ["Keyword Research", "Meta Optimization", "Speed Boost", "Monthly Reports"],
        price: "₹2,999",
        color: "#10b981",
    },
    {
        id: 5,
        icon: "🎨",
        title: "UI/UX Design",
        tag: "Premium",
        description:
            "Research-driven, pixel-perfect UI/UX design that turns visitors into loyal customers through intuitive and beautiful interfaces.",
        features: ["Wireframing", "Prototyping", "Design System", "User Testing"],
        price: "₹3,999",
        color: "#f59e0b",
    },
    {
        id: 6,
        icon: "📱",
        title: "Web Applications",
        tag: "Custom Build",
        description:
            "Scalable, modern web applications with robust backends, dashboards, and real-time features for businesses that need more than a website.",
        features: ["React / Next.js", "REST APIs", "Database", "Admin Panel"],
        price: "₹14,999",
        color: "#ec4899",
    },
];

const stats = [
    { number: "50+", label: "Projects Delivered" },
    { number: "100%", label: "Client Satisfaction" },
    { number: "3x", label: "Avg. Traffic Growth" },
    { number: "24hr", label: "Response Time" },
];

const testimonials = [
    {
        name: "Rajesh Kumar",
        role: "Restaurant Owner, Hyderabad",
        text: "Chaitanya Tech World built our website in just 5 days. We started getting calls from new customers within the first week!",
        avatar: "RK",
        color: "#00d4ff",
    },
    {
        name: "Priya Sharma",
        role: "Boutique Store Owner",
        text: "Our e-commerce store looks incredible and the SEO work pushed us to page 1 for our main keywords. Sales doubled in 2 months.",
        avatar: "PS",
        color: "#ff6b35",
    },
    {
        name: "Mohammed Ali",
        role: "Freelance Photographer",
        text: "My portfolio site is exactly what I envisioned — clean, fast, and my clients always compliment it. Worth every rupee!",
        avatar: "MA",
        color: "#7c3aed",
    },
];

const process = [
    { step: "01", title: "Discovery Call", desc: "We understand your business, goals, and target audience in a free 30-min consultation." },
    { step: "02", title: "Design & Plan", desc: "We craft a custom design and development plan tailored to your brand and budget." },
    { step: "03", title: "Build & Review", desc: "We build your website and share previews for your feedback at every stage." },
    { step: "04", title: "Launch & Grow", desc: "We deploy your site, set up SEO, and provide ongoing support to help you grow." },
];

function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, inView];
}

function AnimatedCounter({ target, suffix = "" }) {
    const [count, setCount] = useState(0);
    const [ref, inView] = useInView(0.5);
    const numericTarget = parseInt(target.replace(/\D/g, "")) || 0;

    useEffect(() => {
        if (!inView || numericTarget === 0) return;
        let start = 0;
        const duration = 1800;
        const step = Math.ceil(numericTarget / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= numericTarget) { setCount(numericTarget); clearInterval(timer); }
            else setCount(start);
        }, 16);
        return () => clearInterval(timer);
    }, [inView, numericTarget]);

    const display = numericTarget === 0 ? target : `${count}${suffix || target.replace(/[\d]/g, "")}`;
    return <span ref={ref}>{display}</span>;
}

export default function OurServices() {
    const [activeService, setActiveService] = useState(null);
    const [navScrolled, setNavScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [heroRef, heroInView] = useInView(0.1);
    const [statsRef, statsInView] = useInView(0.2);
    const [servicesRef, servicesInView] = useInView(0.1);
    const [processRef, processInView] = useInView(0.1);
    const [testimonialsRef, testimonialsInView] = useInView(0.1);

    useEffect(() => {
        const onScroll = () => setNavScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMenuOpen(false);
    };

    return (
        <div className="ctw-root">
            {/* Ambient background blobs */}
            <div className="ctw-blob ctw-blob-1" />
            <div className="ctw-blob ctw-blob-2" />
            <div className="ctw-blob ctw-blob-3" />

            {/* NAV */}
            <nav className={`ctw-nav ${navScrolled ? "ctw-nav--scrolled" : ""}`}>
                <div className="ctw-nav__inner">
                    <div className="ctw-nav__logo">
                        <span className="ctw-nav__logo-icon">⚡</span>
                        <span>Chaitanya<strong>TechWorld</strong></span>
                    </div>
                    <ul className={`ctw-nav__links ${menuOpen ? "ctw-nav__links--open" : ""}`}>
                        {["services", "process", "testimonials", "contact"].map((id) => (
                            <li key={id}>
                                <button onClick={() => scrollTo(id)} className="ctw-nav__link">
                                    {id.charAt(0).toUpperCase() + id.slice(1)}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button className="ctw-btn ctw-btn--sm" onClick={() => scrollTo("contact")}>
                                Get Free Quote
                            </button>
                        </li>
                    </ul>
                    <button className="ctw-nav__burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section className="ctw-hero" ref={heroRef} id="hero">
                <div className={`ctw-hero__content ${heroInView ? "ctw-animate-in" : ""}`}>
                    <div className="ctw-hero__badge">🚀 Web Design & SEO Agency — Hyderabad</div>
                    <h1 className="ctw-hero__headline">
                        We Build Websites That
                        <span className="ctw-hero__gradient"> Win Clients</span>
                        <br />& Rank on Google
                    </h1>
                    <p className="ctw-hero__sub">
                        From local businesses to full e-commerce stores — we deliver professional,
                        SEO-optimized websites that look stunning and actually drive growth.
                    </p>
                    <div className="ctw-hero__actions">
                        <button className="ctw-btn ctw-btn--primary" onClick={() => scrollTo("contact")}>
                            Get Free Consultation ✨
                        </button>
                        <button className="ctw-btn ctw-btn--ghost" onClick={() => scrollTo("services")}>
                            Explore Services →
                        </button>
                    </div>
                    <div className="ctw-hero__trust">
                        <span>⭐⭐⭐⭐⭐</span>
                        <span>Trusted by 50+ businesses across India</span>
                    </div>
                </div>
                <div className={`ctw-hero__visual ${heroInView ? "ctw-animate-in ctw-delay-3" : ""}`}>
                    <div className="ctw-hero__card ctw-hero__card--main">
                        <div className="ctw-hero__card-dot ctw-dot--green" />
                        <div className="ctw-hero__card-dot ctw-dot--yellow" />
                        <div className="ctw-hero__card-dot ctw-dot--red" />
                        <div className="ctw-hero__mockup">
                            <div className="ctw-mockup__bar" />
                            <div className="ctw-mockup__bar ctw-mockup__bar--short" />
                            <div className="ctw-mockup__grid">
                                <div className="ctw-mockup__block ctw-mockup__block--accent" />
                                <div className="ctw-mockup__block" />
                                <div className="ctw-mockup__block" />
                                <div className="ctw-mockup__block ctw-mockup__block--accent2" />
                            </div>
                            <div className="ctw-mockup__bar ctw-mockup__bar--medium" />
                            <div className="ctw-mockup__bar ctw-mockup__bar--short" />
                        </div>
                    </div>
                    <div className="ctw-hero__float ctw-hero__float--1">📈 +340% Traffic</div>
                    <div className="ctw-hero__float ctw-hero__float--2">🏆 Page 1 Rankings</div>
                    <div className="ctw-hero__float ctw-hero__float--3">⚡ 98 Speed Score</div>
                </div>
            </section>

            {/* STATS */}
            <section className="ctw-stats" ref={statsRef}>
                <div className="ctw-container">
                    <div className={`ctw-stats__grid ${statsInView ? "ctw-animate-in" : ""}`}>
                        {stats.map((s, i) => (
                            <div className="ctw-stat" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
                                <div className="ctw-stat__number">
                                    <AnimatedCounter target={s.number} />
                                </div>
                                <div className="ctw-stat__label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="ctw-services" id="services" ref={servicesRef}>
                <div className="ctw-container">
                    <div className={`ctw-section-header ${servicesInView ? "ctw-animate-in" : ""}`}>
                        <div className="ctw-section-tag">What We Offer</div>
                        <h2 className="ctw-section-title">Our <span className="ctw-gradient-text">Services</span></h2>
                        <p className="ctw-section-sub">
                            End-to-end digital solutions — from design and development to SEO and beyond.
                        </p>
                    </div>
                    <div className={`ctw-services__grid ${servicesInView ? "ctw-animate-in ctw-delay-2" : ""}`}>
                        {services.map((svc, i) => (
                            <div
                                key={svc.id}
                                className={`ctw-service-card ${activeService === svc.id ? "ctw-service-card--active" : ""}`}
                                style={{ "--card-color": svc.color, animationDelay: `${i * 0.1}s` }}
                                onMouseEnter={() => setActiveService(svc.id)}
                                onMouseLeave={() => setActiveService(null)}
                            >
                                <div className="ctw-service-card__glow" />
                                <div className="ctw-service-card__top">
                                    <span className="ctw-service-card__icon">{svc.icon}</span>
                                    <span className="ctw-service-card__tag">{svc.tag}</span>
                                </div>
                                <h3 className="ctw-service-card__title">{svc.title}</h3>
                                <p className="ctw-service-card__desc">{svc.description}</p>
                                <ul className="ctw-service-card__features">
                                    {svc.features.map((f) => (
                                        <li key={f}><span className="ctw-check">✓</span> {f}</li>
                                    ))}
                                </ul>
                                <div className="ctw-service-card__footer">
                                    <div className="ctw-service-card__price">
                                        Starting <strong>{svc.price}</strong>
                                    </div>
                                    <button className="ctw-btn ctw-btn--card" onClick={() => scrollTo("contact")}>
                                        Get Started →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROCESS */}
            <section className="ctw-process" id="process" ref={processRef}>
                <div className="ctw-container">
                    <div className={`ctw-section-header ${processInView ? "ctw-animate-in" : ""}`}>
                        <div className="ctw-section-tag">How It Works</div>
                        <h2 className="ctw-section-title">Simple <span className="ctw-gradient-text">4-Step</span> Process</h2>
                        <p className="ctw-section-sub">From idea to live website — clear, collaborative, and stress-free.</p>
                    </div>
                    <div className={`ctw-process__steps ${processInView ? "ctw-animate-in ctw-delay-2" : ""}`}>
                        {process.map((p, i) => (
                            <div className="ctw-process__step" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                                <div className="ctw-process__step-num">{p.step}</div>
                                <div className="ctw-process__connector" />
                                <div className="ctw-process__step-body">
                                    <h4>{p.title}</h4>
                                    <p>{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="ctw-testimonials" id="testimonials" ref={testimonialsRef}>
                <div className="ctw-container">
                    <div className={`ctw-section-header ${testimonialsInView ? "ctw-animate-in" : ""}`}>
                        <div className="ctw-section-tag">Client Stories</div>
                        <h2 className="ctw-section-title">What Our <span className="ctw-gradient-text">Clients Say</span></h2>
                    </div>
                    <div className={`ctw-testimonials__grid ${testimonialsInView ? "ctw-animate-in ctw-delay-2" : ""}`}>
                        {testimonials.map((t, i) => (
                            <div className="ctw-testimonial" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                                <div className="ctw-testimonial__stars">⭐⭐⭐⭐⭐</div>
                                <p className="ctw-testimonial__text">"{t.text}"</p>
                                <div className="ctw-testimonial__author">
                                    <div className="ctw-testimonial__avatar" style={{ background: t.color }}>{t.avatar}</div>
                                    <div>
                                        <div className="ctw-testimonial__name">{t.name}</div>
                                        <div className="ctw-testimonial__role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA BANNER */}
            <section className="ctw-cta-banner">
                <div className="ctw-container">
                    <div className="ctw-cta-banner__inner">
                        <div className="ctw-cta-banner__blob" />
                        <h2>Ready to Grow Your Business Online?</h2>
                        <p>Get a free consultation and custom quote within 24 hours — no commitment needed.</p>
                        <div className="ctw-cta-banner__actions">
                            <button className="ctw-btn ctw-btn--primary ctw-btn--large" onClick={() => scrollTo("contact")}>
                                Start Free Consultation 🚀
                            </button>
                            <a className="ctw-btn ctw-btn--whatsapp" href="https://wa.me/917337072766" target="_blank" rel="noreferrer">
                                <span>💬</span> Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTACT */}
            <section className="ctw-contact" id="contact">
                <div className="ctw-container">
                    <div className="ctw-contact__grid">
                        <div className="ctw-contact__info">
                            <div className="ctw-section-tag">Get In Touch</div>
                            <h2 className="ctw-section-title">Let's Build<br /><span className="ctw-gradient-text">Something Great</span></h2>
                            <p>Tell us about your project and we'll get back to you with a custom plan and quote within 24 hours.</p>
                            <div className="ctw-contact__details">
                                <div className="ctw-contact__detail">
                                    <span>📧</span>
                                    <span>support@chaitanyatechworld.com</span>
                                </div>
                                <div className="ctw-contact__detail">
                                    <span>📞</span>
                                    <span>+91 73370 72766</span>
                                </div>
                                <div className="ctw-contact__detail">
                                    <span>📍</span>
                                    <span>Hyderabad, Telangana, India</span>
                                </div>
                            </div>
                        </div>
                        <form className="ctw-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="ctw-form__row">
                                <div className="ctw-form__group">
                                    <label>Your Name</label>
                                    <input type="text" placeholder="Rajesh Kumar" />
                                </div>
                                <div className="ctw-form__group">
                                    <label>Phone / WhatsApp</label>
                                    <input type="tel" placeholder="+91 73370 72766" />
                                </div>
                            </div>
                            <div className="ctw-form__group">
                                <label>Email Address</label>
                                <input type="email" placeholder="you@business.com" />
                            </div>
                            <div className="ctw-form__group">
                                <label>Service Needed</label>
                                <select>
                                    <option value="">Select a service...</option>
                                    {services.map((s) => <option key={s.id}>{s.title}</option>)}
                                    <option>Not Sure — Need Advice</option>
                                </select>
                            </div>
                            <div className="ctw-form__group">
                                <label>Tell Us About Your Project</label>
                                <textarea placeholder="My business is... I need a website that..." rows={4} />
                            </div>
                            <button type="submit" className="ctw-btn ctw-btn--primary ctw-btn--full">
                                Send Message & Get Free Quote ✨
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="ctw-footer">
                <div className="ctw-container">
                    <div className="ctw-footer__inner">
                        <div className="ctw-nav__logo">
                            <span className="ctw-nav__logo-icon">⚡</span>
                            <span>Chaitanya<strong>TechWorld</strong></span>
                        </div>
                        <p>© 2025 ChaitanyaTechWorld. All rights reserved. Built with ❤️ in Hyderabad.</p>
                        <div className="ctw-footer__links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms</a>
                            <a href="https://wa.me/917337072766">WhatsApp</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating WhatsApp Button */}
            <a
                className="ctw-whatsapp-float"
                href="https://wa.me/917337072766"
                target="_blank"
                rel="noreferrer"
                aria-label="Chat on WhatsApp"
            >
                💬
            </a>
        </div>
    );
}
