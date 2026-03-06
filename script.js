let date = new Date();
let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
let currentSelectedDate = "";
const bgMusic = new Audio();
bgMusic.loop = true;
bgMusic.volume = 0.5;
const weatherApiKey = "6668e999a1e856610b5995f2365c3d34"; 

//  ---------------------------
function toBengaliNumber(num) {
    const symbols = {
        '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
        '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return String(num).replace(/[0-9]/g, s => symbols[s]).trim(); 
}
// ---------------------------------------------------------------------------------

const monthSettings = [
    { name: "January", season: "❄️ শীত", color: "radial-gradient(circle at 20% 30%, #1a2a6c, #b21f1f, #fdbb2d)", music: "music/jan.mpeg", holidays: { 1: "ইংরেজি নববর্ষ" } },
    { name: "February", season: "🌸 বসন্ত", color: "radial-gradient(circle at 50% 50%, #ff9966, #ff5e62)", music: "music/fab.mpeg", holidays: { 4: "শব‌ে বারাত ✨", 21: "আন্তর্জাতিক মাতৃভাষা দিবস ✨" } },
    { name: "March", season: "🌸 বসন্ত", color: "radial-gradient(circle at 10% 20%, #00b09b, #96c93d)", music: "music/mar.mpeg", holidays: { 17: "শব‌ে কদর ✨", 19: "ঈদুল ফিতর শুরু", 20: "জুমাতুল বিদা ✨", 21: "ঈদুল ফিতর ✨", 26: "স্বাধীনতা দিবস ✨" } },
    { name: "April", season: "☀️ গ্রীষ্ম", color: "radial-gradient(circle at center, #F7971E, #FFD200)", music: "music/apr.mpeg", holidays: { 14: "পহেলা বৈশাখ ✨" } },
    { name: "May", season: "☀️ গ্রীষ্ম", color: "radial-gradient(circle at 70% 30%, #4facfe, #00f2fe)", music: "music/may.mpeg", holidays: { 1: "মে দিবস ✨", 26: "ঈদ-উল-আজহা ✨" } },
    { name: "June", season: "🌧️ বর্ষা", color: "radial-gradient(circle at center, #13547a, #80d0c7)", music: "music/jun.mpeg", holidays: { 26: "আশুরা ✨" } },
    { name: "July", season: "🌧️ বর্ষা", color: "radial-gradient(circle at 20% 80%, #5d77d4, #2575fc)", music: "music/jul.mpeg", holidays: { 1: "ব্যাংক হলিডে" } },
    { name: "August", season: "☁️ শরৎ", color: "radial-gradient(circle at center, #243B55, #141E30)", music: "music/aug.mpeg", holidays: { 5: "ছাত্র জনতা দিবস ✨", 26: "ঈদ-ই-মিলাদুন্নবী ✨" } },
    { name: "September", season: "☁️ শরৎ", color: "radial-gradient(circle at 50% 50%, #e96443, #904e95)", music: "music/sep.mpeg", holidays: { 4: "জন্মাষ্টমী ✨" } },
    { name: "October", season: "🌾 হেমন্ত", color: "radial-gradient(circle at center, #606c88, #3f4c6b)", music: "music/oct.mpeg", holidays: { 21: "বিজয়া দশমী ✨" } },
    { name: "November", season: "🌾 হেমন্ত", color: "radial-gradient(circle at 10% 90%, #3a1c71, #d76d77, #ffaf7b)", music: "music/nov.mpeg", holidays: {} },
    { name: "December", season: "❄️ শীত", color: "radial-gradient(circle at center, #000000, #434343)", music: "music/dec.mpeg", holidays: { 16: "বিজয় দিবস ✨", 25: "বড় দিন ✨" } }
];


function getBengaliDate() {
    return `বঙ্গাব্দ ১৪৩২ - ১৪৩৩`;
}


function applyNightMode() {
    const hour = new Date().getHours();
    const card = document.querySelector('.calendar-card');
    const seasonLabel = document.getElementById("season-name");
    
    let timeText = "";
    let timeIcon = "";

    if (hour >= 6 && hour < 12) {
        timeText = "সকাল";
        timeIcon = "☀️";
    } else if (hour >= 12 && hour < 16) {
        timeText = "দুপুর";
        timeIcon = "☀️";
    } else if (hour >= 16 && hour < 18) {
        timeText = "বিকেল/সন্ধ্যা";
        timeIcon = "🌆";
    } else {
        timeText = "রাত";
        timeIcon = "🌙";
        document.body.style.background = "radial-gradient(circle at center, #0f172a, #020617, #000000)";
        if (card) card.style.background = "rgba(0, 0, 0, 0.65)";
    }

    if (seasonLabel) {
        if (!seasonLabel.innerHTML.includes(timeIcon)) {
            seasonLabel.innerHTML += ` <span style='color: #fbbf24;'> ${timeIcon} ${timeText}</span>`;
        }
    }
}


function renderCalendar() {
    const monthYear = document.getElementById("month-year");
    const daysContainer = document.getElementById("days-container");
    const seasonLabel = document.getElementById("season-name");
    const holidayList = document.getElementById("holiday-list");

    const monthIndex = date.getMonth();
    const config = monthSettings[monthIndex];

    document.body.style.background = config.color;

    monthYear.innerText = `${config.name} ${date.getFullYear()}`;
    seasonLabel.innerText = config.season;

    if (holidayList) {
        holidayList.innerHTML = Object.keys(config.holidays).length > 0 
            ? Object.entries(config.holidays).map(([d, name]) => `<li>${toBengaliNumber(d)} তারিখ: ${name}</li>`).join('') // এখানেও সংখ্যা বাংলা করা হয়েছে
            : "<li>এই মাসে সরকারি ছুটি নেই</li>";
    }

    if (bgMusic.src.indexOf(config.music) === -1) {
        bgMusic.src = config.music;
    }

    daysContainer.innerHTML = "";
    const banglaDays = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];
    banglaDays.forEach(d => {
        const dayNameDiv = document.createElement("div");
        dayNameDiv.className = "day-name";
        dayNameDiv.innerText = d;
        daysContainer.appendChild(dayNameDiv);
    });

    const firstDay = new Date(date.getFullYear(), monthIndex, 1).getDay();
    const lastDay = new Date(date.getFullYear(), monthIndex + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        daysContainer.appendChild(Object.assign(document.createElement("div"), {className: "day empty"}));
    }

    for (let i = 1; i <= lastDay; i++) {
        let dateKey = `${date.getFullYear()}-${monthIndex + 1}-${i}`;
        let isToday = (i === new Date().getDate() && monthIndex === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) ? "today" : "";
        let hasEvent = events[dateKey] ? "has-event" : "";
        
        const dayDiv = document.createElement("div");
        dayDiv.className = `day ${isToday} ${hasEvent}`;
        
        //  ---------------------------
        dayDiv.innerText = toBengaliNumber(i); 
        // ---------------------------------------------------------------
        
        if (config.holidays[i]) {
            dayDiv.style.color = "#ffd700";
            dayDiv.title = config.holidays[i];
        }

        dayDiv.onclick = () => openModal(dateKey);
        daysContainer.appendChild(dayDiv);
    }

    applyNightMode();
    checkNotification();
}

// 
function openModal(dateKey) { 
    currentSelectedDate = dateKey; 
    document.getElementById("selected-date-text").innerText = "তারিখ: " + dateKey;
    document.getElementById("event-input").value = events[dateKey] || "";
    document.getElementById("event-modal").style.display = "flex";
}

function closeModal() { document.getElementById("event-modal").style.display = "none"; }

function saveEvent() {
    const task = document.getElementById("event-input").value;
    if (task.trim()) events[currentSelectedDate] = task;
    else delete events[currentSelectedDate];
    localStorage.setItem('calendarEvents', JSON.stringify(events));
    closeModal();
    renderCalendar();
}

function checkNotification() {
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const notif = document.getElementById("notification");
    if (events[dateKey] && notif) {
        document.getElementById("notif-text").innerText = "রিমাইন্ডার: " + events[dateKey];
        notif.classList.add("show");
        setTimeout(() => notif.classList.remove("show"), 6000);
    }
}


// 
function fetchWeather() {
    const weatherElement = document.getElementById("weather-info");
    if (navigator.geolocation && weatherElement) {
        navigator.geolocation.getCurrentPosition((position) => {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${weatherApiKey}&units=metric&lang=bn`;
            fetch(url).then(res => res.json()).then(data => {
                const weatherMain = data.weather[0].main.toLowerCase();
                if (weatherMain.includes("rain")) {
                    document.body.style.background = "radial-gradient(circle, #203a43, #2c5364)";
                    weatherElement.innerHTML = `🌧️ বৃষ্টি হচ্ছে: ${toBengaliNumber(Math.round(data.main.temp))}°C`; // তাপমাত্রা বাংলা করা হয়েছে
                } else {
                    weatherElement.innerHTML = `📍 ${data.name}: ${toBengaliNumber(Math.round(data.main.temp))}°C, ${data.weather[0].description}`; // তাপমাত্রা বাংলা করা হয়েছে
                }
            }).catch(() => weatherElement.innerHTML = "❌ ওয়েদার লোড হয়নি");
        });
    }
}

setInterval(() => { 
    const clock = document.getElementById("clock");
    if (clock) clock.innerText = new Date().toLocaleTimeString('bn-BD');
}, 1000);

// ৬.
function changeVolume(val) { bgMusic.volume = val; }
function toggleMute() { bgMusic.muted = !bgMusic.muted; }
function playMusic() { 
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log("Music play blocked"));
    }
}

function toggleMenu() {
    let menu = document.getElementById("side-menu");
    if (menu.style.width === "300px") {
        menu.style.width = "0";
    } else {
        menu.style.width = "300px";
    }
}

function changeMonth(dir) { 
    date.setMonth(date.getMonth() + dir); 
    renderCalendar(); 
    playMusic();
}

window.onclick = function(event) {
    let menu = document.getElementById("side-menu");
    let menuIcon = document.querySelector(".menu-icon");
    if (menu && !menu.contains(event.target) && !menuIcon.contains(event.target)) {
        if (menu.style.width === "300px") {
            menu.style.width = "0";
        }
    }
}

window.addEventListener('click', () => { playMusic(); }, { once: true });
renderCalendar();
fetchWeather();