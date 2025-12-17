// ===============================
// GLOBAL UI SCRIPT
// ===============================
let gravityPrimed = false;
const learningCore = document.querySelector(".learning-core");


document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // FOOTER YEAR
    // ===============================
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ===============================
    // SMOOTH SCROLL (NAV LINKS)
    // ===============================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            const targetId = link.getAttribute("href");
            const target = document.querySelector(targetId);

            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });

    const logoFlip = document.getElementById("logoFlip");

    if (logoFlip) {
        logoFlip.addEventListener("click", () => {
            logoFlip.classList.toggle("active");
        });
    }


    // ===============================
    // ACTIVE NAV LINK ON SCROLL
    // ===============================
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("nav a");

    function setActiveLink() {
        let current = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", setActiveLink);

    // ===============================
    // HEADER SCROLL EFFECT
    // ===============================
    const header = document.querySelector("header");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 80) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // ===============================
    // BUTTON MICRO-INTERACTIONS
    // ===============================
    document.querySelectorAll(".btn").forEach(btn => {

        btn.addEventListener("mouseenter", () => {
            btn.style.transform = "translateY(-2px)";
        });

        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "translateY(0)";
        });

        btn.addEventListener("mousedown", () => {
            btn.style.transform = "translateY(1px)";
        });

        btn.addEventListener("mouseup", () => {
            btn.style.transform = "translateY(-2px)";
        });

    });

    // ===============================
    // CAPABILITY GRAPH (AUTO-LAYOUT)
    // ===============================
    let activeNode = null;

    function buildCapabilityGraph() {
    const wrapper = document.querySelector(".capability-wrapper");
    if (!wrapper) return;

    const svg = wrapper.querySelector(".capability-links");
    const nodes = Array.from(wrapper.querySelectorAll(".cap-node"));

    svg.innerHTML = "";

    const rect = wrapper.getBoundingClientRect();
    svg.setAttribute("width", rect.width);
    svg.setAttribute("height", rect.height);
    svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);

    const centers = nodes.map(node => {
        const r = node.getBoundingClientRect();
        return {
            x: r.left + r.width / 2 - rect.left,
            y: r.top + r.height / 2 - rect.top,
            group: node.dataset.group
        };
    });

    for (let i = 0; i < centers.length; i++) {
        for (let j = i + 1; j < centers.length; j++) {
            const a = centers[i];
            const b = centers[j];

            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist > 420) continue;

            const line = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );

            line.setAttribute("x1", a.x);
            line.setAttribute("y1", a.y);
            line.setAttribute("x2", b.x);
            line.setAttribute("y2", b.y);

            if (a.group === b.group) {
                line.style.stroke = "rgba(124,58,237,0.45)";
                line.style.strokeWidth = "1.6";
            }

            svg.appendChild(line);
        }
    }
}

window.addEventListener("load", buildCapabilityGraph);
window.addEventListener("resize", () => {
    clearTimeout(window.__capResize);
    window.__capResize = setTimeout(buildCapabilityGraph, 120);
});



    // ===============================
    // NODE HOVER → HIGHLIGHT GRAPH
    // ===============================
    document.querySelectorAll(".cap-node").forEach(node => {

        node.addEventListener("mouseenter", () => {
            node.classList.add("focus-node");

            activeNode = node;

            const rect = node.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            document.querySelectorAll(".cap-node").forEach(other => {
                if (other === node) return;

                const r = other.getBoundingClientRect();
                const ox = r.left + r.width / 2;
                const oy = r.top + r.height / 2;

                const dx = cx - ox;
                const dy = cy - oy;
                const dist = Math.hypot(dx, dy) || 1;

                const strength = Math.min(18, 120 / dist);

                other.style.transform = `
                translate(${dx / dist * strength}px,
                          ${dy / dist * strength}px)
            `;
                if (learningCore) {
                    learningCore.classList.add("active");
                }

            });

            buildGravityGraph();
            window.addEventListener("resize", () => {
                clearTimeout(window.__gravityResize);
                window.__gravityResize = setTimeout(buildGravityGraph, 150);
            });
            const strength = gravityPrimed
                ? Math.min(18, 120 / dist)
                : Math.min(32, 160 / dist);
            gravityPrimed = false;
        });

        node.addEventListener("mouseleave", () => {
            node.classList.remove("focus-node");

            activeNode = null;

            document.querySelectorAll(".cap-node").forEach(n => {
                n.style.transform = "translate(0, 0)";
                gravityPrimed = true;

                if (learningCore) {
                    learningCore.classList.remove("active");
                }


            });

            buildGravityGraph();
        });

    });


    // ===============================
    // FADE-IN SECTIONS
    // ===============================
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        { threshold: 0.15 }
    );

    document.querySelectorAll("section").forEach(section => {
        section.classList.add("fade-in");
        observer.observe(section);
    });

});


