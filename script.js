document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    const navBar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    // Toggle mobile navigation
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }

            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Slideshow functionality
    class Slideshow {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            this.slides = [];
            this.currentIndex = 0;
            this.dotsContainer = this.container.parentElement.querySelector('.slideshow-dots');
            this.prevBtn = this.container.parentElement.querySelector('.prev');
            this.nextBtn = this.container.parentElement.querySelector('.next');
            
            this.init();
        }

        init() {
            // Add event listeners
            this.prevBtn.addEventListener('click', () => this.showPrev());
            this.nextBtn.addEventListener('click', () => this.showNext());
            
            // Add keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (this.container.parentElement.closest('.section.active')) {
                    if (e.key === 'ArrowLeft') this.showPrev();
                    if (e.key === 'ArrowRight') this.showNext();
                }
            });

            // Add touch events
            let touchStartX = 0;
            let touchEndX = 0;

            this.container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            this.container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            });
        }

        addSlide(src) {
            const slide = document.createElement('div');
            slide.className = 'slide';
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Memory';
            slide.appendChild(img);
            this.container.appendChild(slide);
            this.slides.push(slide);
            
            // Create dot
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.addEventListener('click', () => this.showSlide(this.slides.length - 1));
            this.dotsContainer.appendChild(dot);

            // Show first slide if it's the first one
            if (this.slides.length === 1) {
                this.showSlide(0);
            }
        }

        showSlide(index) {
            this.slides.forEach((slide, i) => {
                slide.classList.remove('active');
                // Hide slides that are not the current, previous, or next for better control
                if (i !== index && i !== (index - 1 + this.slides.length) % this.slides.length && i !== (index + 1) % this.slides.length) {
                     slide.style.display = 'none';
                 } else {
                     slide.style.display = 'flex'; // Or whatever the original display was
                 }
            });
            this.dotsContainer.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
            
            this.slides[index].classList.add('active');
            this.dotsContainer.children[index].classList.add('active');
            this.currentIndex = index;

            // Update z-index for stacking
            this.updateSlideStack();
        }

        updateSlideStack() {
            const total = this.slides.length;
            this.slides.forEach((slide, index) => {
                 // Adjust z-index for active, previous, and next slides
                 if (index === this.currentIndex) {
                     slide.style.zIndex = total + 2;
                 } else if (index === (this.currentIndex - 1 + total) % total || index === (this.currentIndex + 1) % total) {
                     slide.style.zIndex = total + 1;
                 } else {
                     slide.style.zIndex = total - Math.abs(this.currentIndex - index);
                 }
            });
        }

        showPrev() {
            const newIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
            this.showSlide(newIndex);
        }

        showNext() {
            const newIndex = (this.currentIndex + 1) % this.slides.length;
            this.showSlide(newIndex);
        }

        handleSwipe(startX, endX) {
            const swipeThreshold = 50;
            if (endX < startX - swipeThreshold) {
                this.showNext();
            } else if (endX > startX + swipeThreshold) {
                this.showPrev();
            }
        }

        addSlideWithElement(slideElement) {
            slideElement.classList.add('slide');
            this.container.appendChild(slideElement);
            this.slides.push(slideElement);

            // Create dot
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.addEventListener('click', () => this.showSlide(this.slides.length - 1));
            this.dotsContainer.appendChild(dot);

            // Show first slide if it's the first one
            if (this.slides.length === 1) {
                this.showSlide(0);
            }
        }
    }

    // Initialize slideshows
    const memoriesPortraitSlideshow = new Slideshow('memoriesPortraitSlideshow');
    const memoriesLandscapeSlideshow = new Slideshow('memoriesLandscapeSlideshow');
    const appreciationPortraitSlideshow = new Slideshow('appreciationPortraitSlideshow');
    const appreciationLandscapeSlideshow = new Slideshow('appreciationLandscapeSlideshow');
    const videoSlideshow = new Slideshow('videoSlideshow');

    // Function to check if an image is portrait or landscape
    function categorizeImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const isPortrait = img.height > img.width;
                resolve(isPortrait);
            };
            img.src = src;
        });
    }

    // Load memories photos (1-16)
    async function loadMemoriesPhotos() {
        for (let i = 1; i <= 16; i++) {
            const src = `photo ${i}.jpg`;
            const isPortrait = await categorizeImage(src);
            if (isPortrait) {
                memoriesPortraitSlideshow.addSlide(src);
            } else {
                memoriesLandscapeSlideshow.addSlide(src);
            }
        }
    }

    // Load appreciation photos (17(1)-17(27))
    async function loadAppreciationPhotos() {
        for (let i = 1; i <= 27; i++) {
            const src = `photo 17 (${i}).jpg`;
            const isPortrait = await categorizeImage(src);
            if (isPortrait) {
                appreciationPortraitSlideshow.addSlide(src);
            } else {
                appreciationLandscapeSlideshow.addSlide(src);
            }
        }
    }

    // Load videos
    async function loadVideos() {
        const videos = ['IMG_5170.MOV', 'IMG_5749.MP4'];
        videos.forEach(video => {
            // Create a video element and add it as a slide
            const videoElement = document.createElement('video');
            videoElement.src = video;
            videoElement.controls = true;
            videoElement.style.maxWidth = '100%';
            videoElement.style.maxHeight = '100%';

            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.appendChild(videoElement);

            videoSlideshow.addSlideWithElement(slide);
        });
    }

    // Start loading images and videos
    loadMemoriesPhotos();
    loadAppreciationPhotos();
    loadVideos();
}); 