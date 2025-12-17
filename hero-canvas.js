document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("hero-canvas");
    if (!container) return;

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // ===============================
    // LEARNING GRAPH NODES
    // ===============================
    const NODE_COUNT = 18;
    const nodes = [];
    const links = [];
    let time = 0;

    for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            r: i === 0 ? 6 : 3.2, // core node
            type: i === 0 ? "core" : "skill"
        });
    }

    // Pre-build connections
    for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
            if (Math.random() > 0.85) {
                links.push([i, j]);
            }
        }
    }

    // ===============================
    // ANIMATION LOOP
    // ===============================
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Background fade
        ctx.fillStyle = "rgba(6, 8, 25, 0.35)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Move nodes
        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 40 || n.x > canvas.width - 40) n.vx *= -1;
            if (n.y < 40 || n.y > canvas.height - 40) n.vy *= -1;
        });

        // Draw connections
        links.forEach(([a, b]) => {
            const n1 = nodes[a];
            const n2 = nodes[b];
            const dx = n1.x - n2.x;
            const dy = n1.y - n2.y;
            const d = Math.sqrt(dx * dx + dy * dy);

            if (d < 200) {
                ctx.strokeStyle = `rgba(99,102,241,${0.25 - d / 900})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(n1.x, n1.y);
                ctx.lineTo(n2.x, n2.y);
                ctx.stroke();
            }
        });

        let phase = 0;

function syncHeader() {
    phase += 0.15;

    document.documentElement.style.setProperty(
        "--system-phase",
        `${phase}deg`
    );

    const glow = `rgba(124,58,237,${0.35 + Math.sin(phase * 0.02) * 0.1})`;
    const glowAlt = `rgba(6,182,212,${0.35 + Math.cos(phase * 0.02) * 0.1})`;

    document.documentElement.style.setProperty("--system-glow", glow);
    document.documentElement.style.setProperty("--system-glow-alt", glowAlt);
}
        syncHeader();


        // Draw nodes
        nodes.forEach((n, i) => {
            ctx.beginPath();
            ctx.arc(
                n.x,
                n.y + Math.sin(time + i) * (n.type === "core" ? 2 : 1),
                n.r,
                0,
                Math.PI * 2
            );

            if (n.type === "core") {
                ctx.fillStyle = "#22d3ee";
                ctx.shadowBlur = 18;
                ctx.shadowColor = "#22d3ee";
            } else {
                ctx.fillStyle = "#a855f7";
                ctx.shadowBlur = 6;
                ctx.shadowColor = "#7c3aed";
            }

            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }

    animate();
});
