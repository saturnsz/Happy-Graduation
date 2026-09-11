/* ==========================================
   HAPPY GRADUATION — script.js
   Akaru-inspired interactions
   ========================================== */

// ─── 1. LENIS SMOOTH SCROLL ───────────────────────────────────────────────────
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP ScrollTrigger + Lenis integration
gsap.registerPlugin(ScrollTrigger);
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ─── 2. CUSTOM CURSOR ─────────────────────────────────────────────────────────
const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursor-follower");
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (cursor && follower) {
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + "px";
        follower.style.top = followerY + "px";
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover states
    const interactables = document.querySelectorAll(
        "a, button, .kcard, .journey-item, .menu-link"
    );
    interactables.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            cursor.style.width = "16px";
            cursor.style.height = "16px";
            follower.style.width = "60px";
            follower.style.height = "60px";
        });
        el.addEventListener("mouseleave", () => {
            cursor.style.width = "10px";
            cursor.style.height = "10px";
            follower.style.width = "36px";
            follower.style.height = "36px";
        });
    });
}

// ─── 3. MENU OVERLAY ──────────────────────────────────────────────────────────
const menuBtn = document.getElementById("menu-btn");
const menuClose = document.getElementById("menu-close");
const menuOverlay = document.getElementById("menu-overlay");
const menuLinks = document.querySelectorAll("[data-menu-link]");

function openMenu() {
    menuOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lenis.stop();
}

function closeMenu() {
    menuOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
    lenis.start();
}

menuBtn?.addEventListener("click", openMenu);
menuClose?.addEventListener("click", closeMenu);

menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
        closeMenu();
    });
});

// Close on Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuOverlay.classList.contains("is-open")) {
        closeMenu();
    }
});

// ─── 4. HERO ANIMATIONS ──────────────────────────────────────────────────────
function initHero() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Badge reveal
    tl.to(".hero-badge", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0.2,
    });

    // Title lines: staggered clip-path reveal
    const lines = document.querySelectorAll(".hero-title .line");
    lines.forEach((line, i) => {
        tl.to(
            line,
            {
                y: 0,
                duration: 1,
                ease: "power4.out",
            },
            i === 0 ? "-=0.4" : "-=0.75"
        );
    });

    // Subtitle + CTA reveal
    tl.to(
        ".hero-subtitle, .hero-actions",
        {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.15,
        },
        "-=0.5"
    );

    // Avatar
    tl.to(
        ".hero-avatar",
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "back.out(1.4)",
        },
        "-=0.6"
    );

    // Scroll indicator
    tl.to(
        ".scroll-indicator",
        { opacity: 1, duration: 0.6 },
        "-=0.3"
    );
}

// ─── 5. SCROLL REVEAL ────────────────────────────────────────────────────────
function initScrollReveal() {
    // Generic .reveal-up elements
    const revealEls = document.querySelectorAll(".reveal-up");
    const revealTexts = document.querySelectorAll(".reveal-text");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add("is-visible");
                    }, 60 * i);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));

    const textObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                }
            });
        },
        { threshold: 0.2 }
    );

    revealTexts.forEach((el) => textObserver.observe(el));

    // Section titles: line-by-line reveal
    const sectionTitles = document.querySelectorAll(".messages-title, .footer-cta-title");
    sectionTitles.forEach((title) => {
        const lines = title.querySelectorAll(".line");
        const titleObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        lines.forEach((line, i) => {
                            setTimeout(() => {
                                gsap.to(line, {
                                    y: 0,
                                    duration: 1,
                                    ease: "power4.out",
                                });
                            }, i * 100);
                        });
                    }
                });
            },
            { threshold: 0.3 }
        );
        titleObserver.observe(title);
    });

    // Footer CTA label + actions
    const ctaLabel = document.querySelector(".footer-cta-label");
    const ctaActions = document.querySelector(".footer-cta-actions");

    const ctaObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    ctaLabel?.classList.add("is-visible");
                    setTimeout(() => {
                        ctaActions?.classList.add("is-visible");
                    }, 300);
                }
            });
        },
        { threshold: 0.3 }
    );

    if (ctaLabel) ctaObserver.observe(ctaLabel);
}

// ─── 6. JOURNEY ITEMS STAGGER ─────────────────────────────────────────────────
function initJourneyItems() {
    const items = document.querySelectorAll(".journey-item.reveal-up");
    if (!items.length) return;

    const obs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add("is-visible");
                    }, i * 120);
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );
    items.forEach((el) => obs.observe(el));
}

// ─── 7. CARD STAGGER ─────────────────────────────────────────────────────────
function initCardStagger() {
    const cards = document.querySelectorAll(".kcard.reveal-up");
    if (!cards.length) return;

    const obs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add("is-visible");
                    }, i * 100);
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );
    cards.forEach((el) => obs.observe(el));
}

// ─── 8. PARALLAX BLOBS ──────────────────────────────────────────────────────
function initParallaxBlobs() {
    gsap.to(".blob-1", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
        },
    });
    gsap.to(".blob-2", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 2,
        },
    });
    gsap.to(".blob-3", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 1,
        },
    });
}

// ─── 9. HEARTS BURST ─────────────────────────────────────────────────────────
function burstHearts(x, y) {
    const container = document.getElementById("hearts-container");
    const emojis = ["♥", "✦", "★", "✿", "♡"];

    for (let i = 0; i < 18; i++) {
        const heart = document.createElement("div");
        heart.classList.add("heart-particle");
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.5;
        const radius = 60 + Math.random() * 120;
        const tx = Math.cos(angle) * radius + "px";
        const ty = Math.sin(angle) * radius + "px";

        heart.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            --tx: ${tx};
            --ty: ${ty};
            font-size: ${0.8 + Math.random() * 1.2}rem;
            animation-delay: ${Math.random() * 0.2}s;
            animation-duration: ${1.2 + Math.random() * 0.8}s;
            color: ${Math.random() > 0.5 ? "#E8785A" : "#7B9ECC"};
        `;

        container.appendChild(heart);
        setTimeout(() => heart.remove(), 2000);
    }
}

document.getElementById("hero-cta")?.addEventListener("click", (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
});

document.getElementById("love-btn")?.addEventListener("click", (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
    // Repeat a few times
    setTimeout(() => burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2), 500);
    setTimeout(() => burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2), 900);
});

// ─── 10. MENU LINK HOVER AUDIO (visual only) ─────────────────────────────────
document.querySelectorAll(".menu-link").forEach((link) => {
    link.addEventListener("mouseenter", () => {
        gsap.to(link, { x: 12, duration: 0.35, ease: "power2.out" });
    });
    link.addEventListener("mouseleave", () => {
        gsap.to(link, { x: 0, duration: 0.35, ease: "power2.out" });
    });
});

// ─── INIT ──────────────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
    // Short delay so fonts load
    setTimeout(() => {
        initHero();
        initScrollReveal();
        initJourneyItems();
        initCardStagger();
        initParallaxBlobs();
    }, 100);
});
