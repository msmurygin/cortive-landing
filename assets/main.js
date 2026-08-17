/* ─── THEME TOGGLE ─── */
(function () {
    const root = document.documentElement;
    const saved = localStorage.getItem("qk-theme") || "light";
    root.setAttribute("data-theme", saved);
    document
        .getElementById("themeBtn")
        .addEventListener("click", () => {
            const next =
                root.getAttribute("data-theme") === "dark"
                    ? "light"
                    : "dark";
            root.setAttribute("data-theme", next);
            localStorage.setItem("qk-theme", next);
        });
})();

/* Live console — types out the onboarding session */
(function () {
    const body = document.getElementById("consoleBody");
    if (!body) return;
    const lines = [
        {
            t: '<span class="c-mute">// onboarding · session #cs_8421</span>',
        },
        {
            t: '<span class="c-q">quark</span> <span class="c-mute">›</span> what type of warehouse?',
        },
        {
            t: '  <span class="c-fade">→</span> 3PL, multi-client, pharma',
        },
        {
            t: '<span class="c-q">quark</span> <span class="c-mute">›</span> upload a photo of your aisles',
        },
        {
            t: '  <span class="c-fade">→</span> aisle_photo.jpg <span class="c-mute">· 4032×3024</span>',
        },
        {
            t: '  <span class="c-q">✓</span> 4 zones · 12 aisles · 3 staging · cold chain detected',
        },
        {
            t: '<span class="c-q">quark</span> <span class="c-mute">›</span> import products.xlsx',
        },
        {
            t: '  <span class="c-q">✓</span> 12,847 SKUs · 4 categories · 23 suppliers',
        },
        {
            t: '<span class="c-mute">// generating metadata configuration ███████████░░ 78%</span>',
        },
        {
            t: '  <span class="c-q">✓</span> 48 forms · 12 lists · 6 roles · 156 locations',
        },
        {
            t: '<span class="c-w">!</span> <span class="c-fade">3 mutations require human approval</span>',
        },
        {
            t: '<span class="c-q">quark</span> <span class="c-mute">›</span> review in studio? <span class="cur"></span>',
        },
    ];
    let i = 0;
    function add() {
        if (i >= lines.length) {
            // restart cycle after pause
            setTimeout(() => {
                body.innerHTML = "";
                i = 0;
                add();
            }, 4500);
            return;
        }
        const div = document.createElement("div");
        div.className = "row";
        div.innerHTML = lines[i].t;
        body.appendChild(div);
        // cap visible lines
        while (body.children.length > 12)
            body.removeChild(body.firstChild);
        i++;
        setTimeout(add, 480 + Math.random() * 240);
    }
    add();
})();

/* Mutation card — cycles draft → validate → approve → apply → reset */
(function () {
    const stage = document.getElementById("mutStage");
    const count = document.getElementById("mutCount");
    if (!stage) return;
    const labels = ["Draft", "Validate", "Approve", "Apply"];
    const states = [
        // [Draft, Validate, Approve, Apply], status text
        { s: [1, 0, 0, 0], txt: "3 mutations · drafting" },
        { s: [2, 1, 0, 0], txt: "3 mutations · validating" },
        { s: [2, 2, 1, 0], txt: "1 mutation · awaiting approval" },
        { s: [2, 2, 2, 1], txt: "3 mutations · applying" },
        { s: [2, 2, 2, 2], txt: "3 mutations · live" },
    ];
    let idx = 0;
    function render() {
        const cur = states[idx];
        [...stage.children].forEach((el, i) => {
            el.classList.remove("is-active", "is-done");
            if (cur.s[i] === 1) el.classList.add("is-active");
            else if (cur.s[i] === 2) el.classList.add("is-done");
            el.textContent = labels[i];
        });
        count.textContent = cur.txt;
        idx = (idx + 1) % states.length;
    }
    render();
    setInterval(render, 2200);
})();

/* ─── waitlist submit ─── */
(function () {
    var f = document.getElementById("waitlistForm");
    if (!f) return;
    var msg = document.getElementById("waitlistMsg");
    f.addEventListener("submit", function (e) {
        e.preventDefault();
        var btn = f.querySelector("button");
        var orig = btn.textContent;
        btn.textContent = "Sending…";
        btn.disabled = true;
        fetch(f.action, {
            method: "POST",
            body: new FormData(f),
            headers: { Accept: "application/json" },
        })
            .then(function (r) {
                if (r.ok) {
                    f.style.display = "none";
                    msg.classList.add("show");
                } else {
                    btn.textContent = orig;
                    btn.disabled = false;
                    alert(
                        "Something went wrong. Please email maxim.smurygin@gmail.com directly.",
                    );
                }
            })
            .catch(function () {
                btn.textContent = orig;
                btn.disabled = false;
                alert(
                    "Network error. Please email maxim.smurygin@gmail.com directly.",
                );
            });
    });
})();

/* ─── SCREENSHOTS: strip arrows + full-size viewer ─── */
(function () {
    const box = document.getElementById("lightbox");
    if (!box) return;

    const imgEl = document.getElementById("lbImg");
    const capEl = document.getElementById("lbCap");
    const countEl = document.getElementById("lbCount");

    /* Every screenshot on the page, in reading order. */
    /* only the plate visible in the current theme belongs in the viewer */
    const shots = [
        ...document.querySelectorAll(".figure img, .strip-card img, .mfig img"),
    ].filter((img) => getComputedStyle(img).display !== "none");
    let index = 0;
    let opener = null;

    /* A JPEG paints as it downloads. Wrap each shot so the placeholder shows
       instead, and reveal the image only once the whole file has decoded. */
    shots.forEach((img) => {
        const frame = document.createElement("span");
        frame.className = "shot-frame";
        img.parentNode.insertBefore(frame, img);
        frame.appendChild(img);

        const reveal = () => frame.classList.add("is-loaded");
        if (img.complete && img.naturalWidth) {
            reveal();
        } else {
            img.addEventListener("load", reveal, { once: true });
            img.addEventListener("error", reveal, { once: true });
        }
    });

    shots.forEach((img, i) => {
        img.classList.add("zoomable");
        img.tabIndex = 0;
        img.setAttribute("role", "button");
        img.addEventListener("click", () => open(i));
        img.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open(i);
            }
        });
    });

    /* The caption lives next to the image — figcaption, or the card's own <p>. */
    function captionFor(img) {
        const holder = img.closest("figure, .strip-card");
        const text = holder && holder.querySelector("figcaption, p");
        return text ? text.innerHTML : "";
    }

    function show(i) {
        index = (i + shots.length) % shots.length;
        const img = shots[index];
        imgEl.src = img.currentSrc || img.src;
        imgEl.alt = img.alt;
        capEl.innerHTML = captionFor(img);
        countEl.textContent = index + 1 + " / " + shots.length;
    }

    function open(i) {
        opener = shots[i];
        show(i);
        box.hidden = false;
        box.setAttribute("open", "");
        document.body.style.overflow = "hidden";
        box.querySelector('[data-lb="close"]').focus();
    }

    function close() {
        box.hidden = true;
        box.removeAttribute("open");
        document.body.style.overflow = "";
        if (opener) opener.focus();
    }

    box.addEventListener("click", (e) => {
        const action = e.target.dataset && e.target.dataset.lb;
        if (action === "next") show(index + 1);
        else if (action === "prev") show(index - 1);
        else if (action === "close" || e.target === box) close();
    });

    document.addEventListener("keydown", (e) => {
        if (box.hidden) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowRight") show(index + 1);
        else if (e.key === "ArrowLeft") show(index - 1);
    });

    /* Arrows for the strip — a mouse wheel won't scroll it sideways. */
    const rail = document.querySelector(".strip-rail");
    if (rail) {
        document.querySelectorAll("[data-strip]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const card = rail.querySelector(".strip-card");
                const step = card ? card.offsetWidth + 20 : rail.clientWidth;
                rail.scrollBy({
                    left: btn.dataset.strip === "next" ? step : -step,
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                        .matches
                        ? "auto"
                        : "smooth",
                });
            });
        });
    }
})();
