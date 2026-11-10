
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // 1. STORAGE
    const STORAGE = {
        theme: "nexusTheme",
        goals: "nexusDailyGoals",
        xp: "nexusXP",
        streak: "nexusStreak",
        lastActive: "nexusLastActive",
        activities: "nexusActivities"
    };

    function saveData(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn("Storage unavailable:", error);
        }
    }

    function loadData(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value !== null ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function getDate(offset = 0) {
        const date = new Date();
        date.setDate(date.getDate() + offset);

        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
        ].join("-");
    }

    const today = getDate();

    // 2. INITIAL DATA
    let xp = Math.max(0, Number(loadData(STORAGE.xp, 0)) || 0);
    let streak = Math.max(0, Number(loadData(STORAGE.streak, 0)) || 0);
    let lastActive = loadData(STORAGE.lastActive, "");
    let activities = loadData(STORAGE.activities, []);

    if (!Array.isArray(activities)) activities = [];

    let savedGoals = loadData(STORAGE.goals, {
        date: today,
        completed: [],
        rewarded: []
    });

    if (
        !savedGoals ||
        savedGoals.date !== today ||
        !Array.isArray(savedGoals.completed)
    ) {
        savedGoals = {
            date: today,
            completed: [],
            rewarded: []
        };
    }

    if (!Array.isArray(savedGoals.rewarded)) {
        savedGoals.rewarded = [];
    }

    // 3. NOTIFICATIONS
    let notificationTimer;

    function showNotification(message) {
        let notification = document.getElementById("nexusNotification");

        if (!notification) {
            notification = document.createElement("div");
            notification.id = "nexusNotification";
            notification.className = "nexus-notification";
            document.body.appendChild(notification);
        }

        notification.textContent = message;
        notification.classList.add("show");

        clearTimeout(notificationTimer);

        notificationTimer = setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }

    // 4. LIVE CLOCK
    const clock = document.getElementById("nexusClock");

    function updateClock() {
        if (!clock) return;

        clock.textContent = new Date().toLocaleString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    updateClock();
    setInterval(updateClock, 1000);

    // 5. THEME
    const themeButton = document.getElementById("themeToggle");
    const savedTheme = loadData(STORAGE.theme, "dark");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }

    function updateThemeButton() {
        if (!themeButton) return;

        themeButton.textContent =
            document.body.classList.contains("light-theme")
                ? "🌙 Switch to Dark"
                : "☀️ Switch Theme";
    }

    updateThemeButton();

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");

            const isLight =
                document.body.classList.contains("light-theme");

            saveData(STORAGE.theme, isLight ? "light" : "dark");
            updateThemeButton();

            showNotification(
                isLight ? "Light theme activated!" : "Dark theme activated!"
            );
        });
    }

    // 6. SEARCH
    const searchInput = document.getElementById("nexusSearch");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.trim().toLowerCase();

            document.querySelectorAll(".card").forEach(card => {
                card.style.display =
                    card.textContent.toLowerCase().includes(query)
                        ? ""
                        : "none";
            });
        });
    }

    // 7. ACHIEVEMENTS
    function renderAchievements() {
        const container = document.getElementById("nexusBadges");
        if (!container) return;

        const achievements = [
            {
                name: "First Steps",
                icon: "🌱",
                description: "Complete your first daily goal",
                unlocked: savedGoals.completed.length >= 1
            },
            {
                name: "Rising Star",
                icon: "⚡",
                description: "Earn 50 XP",
                unlocked: xp >= 50
            },
            {
                name: "Century Club",
                icon: "🏆",
                description: "Earn 100 XP",
                unlocked: xp >= 100
            },
            {
                name: "3 Day Streak",
                icon: "🔥",
                description: "Maintain a 3-day learning streak",
                unlocked: streak >= 3
            },
            {
                name: "Weekly Champion",
                icon: "💎",
                description: "Maintain a 7-day learning streak",
                unlocked: streak >= 7
            }
        ];

        container.replaceChildren();

        achievements.forEach(item => {
            const card = document.createElement("div");
            card.className = `achievement-card ${
                item.unlocked ? "unlocked" : "locked"
            }`;

            const icon = document.createElement("span");
            icon.className = "achievement-icon";
            icon.textContent = item.unlocked ? item.icon : "🔒";

            const content = document.createElement("div");

            const title = document.createElement("strong");
            title.textContent = item.name;

            const description = document.createElement("p");
            description.textContent = item.description;

            const status = document.createElement("small");
            status.textContent = item.unlocked
                ? "✓ Unlocked"
                : "Not unlocked yet";

            content.append(title, description, status);
            card.append(icon, content);
            container.appendChild(card);
        });
    }

    // 8. GAMIFICATION
    function updateGamification() {
        const xpDisplay = document.querySelector(".xp-stat h2");
        const streakDisplay = document.querySelector(".streak-stat h2");
        const levelDisplay = document.querySelector(".level-stat h2");

        const level = Math.floor(xp / 100) + 1;

        if (xpDisplay) xpDisplay.textContent = xp + " XP";
        if (streakDisplay) streakDisplay.textContent = streak + " Days";
        if (levelDisplay) levelDisplay.textContent = "Level " + level;

        renderAchievements();
    }

    // 9. RECENT ACTIVITY
    const activityList = document.getElementById("activityList");

    function renderActivities() {
        if (!activityList) return;

        activityList.replaceChildren();

        activities.slice(0, 6).forEach(activity => {
            const item = document.createElement("li");
            item.textContent = activity;
            activityList.appendChild(item);
        });
    }

    function addActivity(message) {
        const time = new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });

        activities.unshift(`${message} — ${time}`);
        activities = activities.slice(0, 6);

        saveData(STORAGE.activities, activities);
        renderActivities();

        if (lastActive !== today) {
            streak = lastActive === getDate(-1) ? streak + 1 : 1;
            lastActive = today;

            saveData(STORAGE.streak, streak);
            saveData(STORAGE.lastActive, lastActive);

            updateGamification();
        }
    }

    renderActivities();

    // 10. XP REWARDS
    function awardXP(points, reason) {
        xp += points;

        saveData(STORAGE.xp, xp);
        updateGamification();

        showNotification(`+${points} XP earned! ⭐`);
        addActivity(reason);
    }

    // 11. DAILY GOALS
    const goals = document.querySelectorAll(".nexus-goal");
    const goalCounter = document.getElementById("goalCounter");

    goals.forEach((goal, index) => {
        goal.checked = savedGoals.completed.includes(index);

        goal.addEventListener("change", () => {
            const wasCompleted = savedGoals.completed.includes(index);

            if (goal.checked && !wasCompleted) {
                savedGoals.completed.push(index);

                if (!savedGoals.rewarded.includes(index)) {
                    savedGoals.rewarded.push(index);
                    awardXP(10, "Completed a daily goal");
                }

                showNotification("Daily goal completed! 🎉");

            } else if (!goal.checked && wasCompleted) {
                savedGoals.completed =
                    savedGoals.completed.filter(item => item !== index);

                showNotification("Goal updated");
            }

            saveData(STORAGE.goals, savedGoals);
            updateGoals();

            if (
                savedGoals.completed.length === goals.length &&
                goals.length > 0
            ) {
                showNotification("All daily goals completed! 🏆");
            }

            updateGamification();
        });
    });

    // 12. PROGRESS TRACKER
    const learningProgress = document.getElementById("learningProgress");
    const learningBar = document.getElementById("learningBar");

    const skillsProgress = document.getElementById("skillsProgress");
    const skillsBar = document.getElementById("skillsBar");

    const projectProgress = document.getElementById("projectProgress");
    const projectBar = document.getElementById("projectBar");

    function updateProgress() {
        const completed =
            document.querySelectorAll(".nexus-goal:checked").length;

        const total = goals.length;

        const percentage = total > 0
            ? Math.round((completed / total) * 100)
            : 0;

        const learning = Math.min(100, 35 + percentage * 0.3);
        const skills = Math.min(100, 20 + percentage * 0.4);
        const projects = Math.min(100, 10 + percentage * 0.5);

        if (learningProgress) {
            learningProgress.textContent = Math.round(learning) + "%";
        }

        if (learningBar) learningBar.style.width = learning + "%";

        if (skillsProgress) {
            skillsProgress.textContent = Math.round(skills) + "%";
        }

        if (skillsBar) skillsBar.style.width = skills + "%";

        if (projectProgress) {
            projectProgress.textContent = Math.round(projects) + "%";
        }

        if (projectBar) projectBar.style.width = projects + "%";
    }

    function updateGoals() {
        const completed =
            document.querySelectorAll(".nexus-goal:checked").length;

        if (goalCounter) {
            goalCounter.textContent =
                `${completed} of ${goals.length} goals completed`;
        }

        updateProgress();
    }

    updateGoals();

    // 13. WELCOME BUTTON
    const welcomeButton = document.getElementById("welcomeButton");

    if (welcomeButton) {
        welcomeButton.addEventListener("click", () => {
            showNotification("Welcome to NEXUS! 🚀");
            addActivity("Opened NEXUS ecosystem");

            document.getElementById("commandCenter")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        });
    }

    // 14. CAREER SUGGESTION
    const careerButton = document.getElementById("careerButton");
    const careerResult = document.getElementById("careerResult");

    const careerIdeas = [
        "Web Developer 💻",
        "Python Developer 🐍",
        "Software Engineer 🚀",
        "Data Analyst 📊",
        "UI/UX Designer 🎨",
        "AI & Machine Learning Explorer 🤖"
    ];

    if (careerButton && careerResult) {
        careerButton.addEventListener("click", () => {
            const idea =
                careerIdeas[Math.floor(Math.random() * careerIdeas.length)];

            careerResult.textContent = "Sample Career Idea: " + idea;

            showNotification("Career idea generated!");
            addActivity("Generated career idea: " + idea);
        });
    }

    // 15. 3D CARD EFFECT
    const supportsFinePointer =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (supportsFinePointer) {
        document.querySelectorAll(".performance-card, .card")
            .forEach(card => {
                card.addEventListener("mousemove", event => {
                    const rect = card.getBoundingClientRect();

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX =
                        ((event.clientY - rect.top - centerY) / centerY) * -5;

                    const rotateY =
                        ((event.clientX - rect.left - centerX) / centerX) * 5;

                    card.style.transform =
                        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                });

                card.addEventListener("mouseleave", () => {
                    card.style.transform = "";
                });
            });
    }

    // 16. SIDEBAR NAVIGATION
    const navLinks = document.querySelectorAll(".sidebar nav a");

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // 17. INITIALIZATION
    updateGamification();

    console.log("NEXUS Premium Dashboard initialized successfully 🚀");
    showNotification("NEXUS Command Center is ready!");

});
