document.addEventListener("DOMContentLoaded", () => {
    const ageGate = document.getElementById("age-gate");
    const mainApp = document.getElementById("main-app");
    const enterBtn = document.getElementById("enter-btn");
    const unmuteBtn = document.getElementById("unmute-btn");

    // 18+ Giriş Onayı
    enterBtn.addEventListener("click", () => {
        ageGate.classList.add("hidden");
        mainApp.classList.remove("hidden");
        fetchVideos();
    });

    // Unmute Butonu
    let isMuted = true;
    unmuteBtn.addEventListener("click", () => {
        isMuted = !isMuted;
        document.querySelectorAll("video").forEach(v => v.muted = isMuted);
        unmuteBtn.innerText = isMuted ? "Unmute 🔇" : "Mute 🔊";
    });
});

async function fetchVideos() {
    try {
        const res = await fetch("videos.json");
        const videos = await res.json();
        
        const wrapper = document.getElementById("video-wrapper");
        wrapper.innerHTML = "";

        videos.forEach(v => {
            const slide = document.createElement("div");
            slide.className = "swiper-slide";
            slide.innerHTML = `
                <video src="${v.videoUrl}" loop playsinline muted></video>
                <div class="feed-overlay">
                    <div class="bottom-left-info">
                        ${v.isExplicit ? '<span class="explicit-badge">EXPLICIT</span>' : ''}
                        <div class="user-handle">${v.username}</div>
                        <div class="video-caption">${v.caption}</div>
                        <div class="view-count">▶ ${v.views}</div>
                    </div>
                    <div class="side-actions">
                        <div class="profile-avatar-wrapper">
                            <div class="profile-avatar">👤</div>
                            <span class="follow-tag">Follow</span>
                        </div>
                        <div class="action-item">
                            <span class="action-icon">↗</span>
                        </div>
                        <div class="action-item">
                            <span class="action-icon">💬</span>
                            <span>${v.comments}</span>
                        </div>
                        <div class="action-item">
                            <span class="action-icon">🤍</span>
                            <span>${v.likes}</span>
                        </div>
                    </div>
                </div>
            `;
            wrapper.appendChild(slide);
        });

        initSwiper();

    } catch (e) {
        console.error("Video yükleme hatası:", e);
    }
}

function initSwiper() {
    const swiper = new Swiper('.mySwiper', {
        direction: 'vertical',
        speed: 300,
        mousewheel: true,
        on: {
            init: function() { playVideo(this); },
            slideChangeTransitionEnd: function() { playVideo(this); }
        }
    });
}

function playVideo(swiper) {
    document.querySelectorAll("video").forEach(v => v.pause());
    const activeSlide = swiper.slides[swiper.activeIndex];
    if (activeSlide) {
        const video = activeSlide.querySelector("video");
        if (video) video.play();
    }
}
