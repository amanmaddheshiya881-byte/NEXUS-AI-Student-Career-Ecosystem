
/* =====================================
   NEXUS - SMART STUDENT ECOSYSTEM
   Interactive Dashboard Engine
===================================== */

"use strict";

// NEXUS Application
const NEXUS = {

    // Application initialization
    init() {
        console.log("🚀 NEXUS Dashboard Initialized");

        this.updateDateTime();
        this.setupNavigation();
        this.setupTheme();
        this.setupSearch();
        this.setupWelcome();
        this.setupCareerEngine();

        setInterval(() => this.updateDateTime(), 1000);
    },

    // Live date and time
    updateDateTime() {
        const clock = document.getElementById("nexusClock");

        if (clock) {
            clock.textContent = new Date().toLocaleString(
                "en-IN",
                {
                    dateStyle: "medium",
                    timeStyle: "medium"
                }
            );
        }
    },

    // Sidebar navigation
    setupNavigation() {
        document.querySelectorAll(".sidebar a").forEach(link => {
            link.addEventListener("click", event => {
                event.preventDefault();

                document.querySelectorAll(".sidebar a")
                    .forEach(item => item.classList.remove("active"));

                link.classList.add("active");

                const section = link.textContent.trim();

                const heading = document.getElementById("pageTitle");

                if (heading) {
                    heading.textContent = section;
                }

                this.notify(
                    "Navigation",
                    `${section} section selected`
                );
            });
        });
    },

    // Dark and light theme
    setupTheme() {
        const themeButton = document.getElementById("themeToggle");

        if (!themeButton) return;

        themeButton.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");

            const lightMode = document.body.classList.contains("light-theme");

            themeButton.textContent = lightMode
                ? "🌙 Dark Mode"
                : "☀️ Light Mode";
        });
    },

    // Dashboard search
    setupSearch() {
        const search = document.getElementById("nexusSearch");

        if (!search) return;

        search.addEventListener("input", () => {
            const query = search.value.toLowerCase();

            document.querySelectorAll(".card").forEach(card => {
                card.style.display = card.textContent
                    .toLowerCase()
                    .includes(query) ? "" : "none";
            });
        });
    },

    // Welcome message
    setupWelcome() {
        const button = document.getElementById("welcomeButton");

        if (button) {
            button.addEventListener("click", () => {
                this.notify(
                    "Welcome to NEXUS 🚀",
                    "Your learning and career journey starts here!"
                );
            });
        }
    },

    // Sample career recommendation engine
    setupCareerEngine() {
        const button = document.getElementById("careerButton");

        if (!button) return;

        button.addEventListener("click", () => {
            const careers = [
                {
                    name: "Web Developer",
                    skills: "HTML, CSS, JavaScript, React"
                },
                {
                    name: "Python Developer",
                    skills: "Python, SQL, APIs"
                },
                {
                    name: "Data Analyst",
                    skills: "Excel, SQL, Python, Statistics"
                },
                {
                    name: "UI/UX Designer",
                    skills: "Figma, Design Principles, Prototyping"
                },
                {
                    name: "AI Developer",
                    skills: "Python, Mathematics, Machine Learning"
                }
            ];

            const selected = careers[
                Math.floor(Math.random() * careers.length)
            ];

            const result = document.getElementById("careerResult");

            if (result) {
                result.innerHTML = `
                    <h3>🎯 Sample Career Suggestion</h3>
                    <h2>${selected.name}</h2>
                    <p>Suggested skills: ${selected.skills}</p>
                    <small>Demo suggestion, not a personalized AI prediction.</small>
                `;
            }
        });
    },

    // Reusable notification
    notify(title, message) {
        let notification = document.getElementById("nexusNotification");

        if (!notification) {
            notification = document.createElement("div");
            notification.id = "nexusNotification";
            notification.className = "nexus-notification";
            document.body.appendChild(notification);
        }

        notification.innerHTML = `
            <strong>${title}</strong>
            <p>${message}</p>
        `;

        notification.classList.add("show");

        clearTimeout(this.notificationTimer);

        this.notificationTimer = setTimeout(() => {
            notification.classList.remove("show");
        }, 3500);
    }
};

// Start NEXUS
document.addEventListener("DOMContentLoaded", () => {
    NEXUS.init();
});
