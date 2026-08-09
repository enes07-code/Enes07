document.addEventListener("DOMContentLoaded", () => {
    fetchVideos();
});

// JSON Verisini Çekme ve Slaytları Oluşturma
async function fetchVideos() {
    try {
        const response = await fetch('videos.json');
        const videos = await response.json();
        
        const wrapper = document.getElementById('video-wrapper');
        wrapper.innerHTML = '';

        videos.forEach(video => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <video src="${video.videoUrl}" loop playsinline></video>
                <div class="overlay">
                    <div class="user-info">
                        <h3>${video.username}</h3>
                        <p>${video.caption}</p>
                    </div>
                    <div class="action-buttons">
                        <button class="btn-like">❤️ <span>${video.likes}</span></button>
                        <button class="btn-comment">💬 <span>${video.comments}</span></button>
                        <button class="btn-share">🔗 <span>Paylaş</span></button>
                    </div>
                </div>
            `;
            wrapper.appendChild(slide);
        });

        initSwiper();
        initInteractions();

    } catch (error) {
        console.error("Video verisi yüklenirken hata oluştu:", error);
    }
}

// Swiper Başlatma
function initSwiper() {
    const swiper = new Swiper('.mySwiper', {
        direction: 'vertical',
        loop: false,
        speed: 350,
        mousewheel: true,
        touchReleaseOnEdges: true,
        on: {
            init: function () {
                playCurrentVideo(this);
            },
            slideChangeTransitionEnd: function () {
                playCurrentVideo(this);
            }
        }
    });
}

// Aktif Videoyu Oynatma Yönetimi
function playCurrentVideo(swiperInstance) {
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(video => video.pause());

    const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
    if (!activeSlide) return;
    
    const activeVideo = activeSlide.querySelector('video');
    if (activeVideo) {
        activeVideo.currentTime = 0;
        const playPromise = activeVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("iOS Otomatik Oynatma Engeli:", error);
            });
        }
    }
}

// Tıklama ve Beğeni Etkileşimleri
function initInteractions() {
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        // Ekranın boş bir yerine basınca Videoyu Durdur/Oynat
        slide.addEventListener('click', (e) => {
            if (!e.target.closest('.action-buttons')) {
                const video = slide.querySelector('video');
                if (video) {
                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                    }
                }
            }
        });

        // Kalp / Beğeni Butonu Geçişi
        const likeBtn = slide.querySelector('.btn-like');
        if (likeBtn) {
            likeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                likeBtn.classList.toggle('liked');
            });
        }
    });
                                                       }
