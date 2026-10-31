
document.addEventListener("DOMContentLoaded", () => {

    // 1. Live Digital Clock
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


    // 2. Theme Switcher
    const themeButton = document.getElementById("themeToggle");

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");

            const isLight =
                document.body.classList.contains("light-theme");

            themeButton.textContent = isLight
                ? "🌙 Switch to Dark"
                : "☀️ Switch Theme";

            showNotification(
                isLight ? "Light theme activated!" : "Dark theme activated!"
            );
        });
    }


    // 3. Dashboard Search
    const searchInput = document.getElementById("nexusSearch");
    const cards = document.querySelectorAll(".card");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.trim().toLowerCase();

            cards.forEach(card => {
                const content = card.textContent.toLowerCase();

                card.style.display =
                    content.includes(query) ? "" : "none";
            });
        });
    }


    // 4. Welcome Button
    const welcomeButton =
        document.getElementById("welcomeButton");

    if (welcomeButton) {
        welcomeButton.addEventListener("click", () => {
            showNotification("Welcome to your NEXUS ecosystem! 🚀");
        });
    }


    // 5. Career Suggestion Demo
    const careerButton =
        document.getElementById("careerButton");

    const careerResult =
        document.getElementById("careerResult");

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
            const random =
                Math.floor(Math.random() * careerIdeas.length);

            careerResult.textContent =
                "Sample Career Idea: " + careerIdeas[random];

            showNotification("Your career idea is ready!");
        });
    }


    // 6. Sidebar Active Navigation
    const navLinks = document.querySelectorAll(".sidebar nav a");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.forEach(item =>
                item.classList.remove("active")
            );

            link.classList.add("active");
        });
    });


    // 7. Notification System
    let notificationTimer;

    function showNotification(message) {
        const notification =
            document.getElementById("nexusNotification");

        if (!notification) return;

        notification.textContent = message;
        notification.classList.add("show");

        clearTimeout(notificationTimer);

        notificationTimer = setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }

    console.log("NEXUS Dashboard initialized successfully 🚀");

});
