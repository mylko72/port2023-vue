import ScrollMotion from "./monthly_motion_2404.js";
import { isMobile, isDesktop, hasElementsNum, callByObserver } from "./monthly_function.js";
import '../scss/monthly_2405.scss';
import { gsap } from "./gsap.min.js";
import { MotionPathPlugin } from "./MotionPathPlugin.js";

class ScrollIndex {
    defaults = {
        threshold: 0,
    }

    el;
    container;
    scrollMotion;
    imgSelector;
 
    constructor(el, sceneElem, motionElem, options){

        this.scrollMotion = new ScrollMotion(sceneElem, motionElem, options);

        this.init(el, options);
        gsap.registerPlugin(MotionPathPlugin);
    }
    
    init(el, options){
        this.defaults = {...this.defaults, ...options};
        this.el = el;
        this.container = document.querySelector(this.el);
        this.imgSelector = document.querySelectorAll('[data-src]');
        this.defaults.threshold = window.innerHeight * options.threshold;

        if (isDesktop()) {
            this.desktopFlag = true;
            this.mobileFlag = false;
        } else {
            this.desktopFlag = false;
            this.mobileFlag = true;
        }
    
        this.render();
        this.attachEvents();
        this.setObserver();
    }

    render(){
        this.setSwiper();
        this.scrollMotion.scrollSection.forEach(function(section){
            if (section.querySelectorAll('.line-wrap').length > 0) {
                section.querySelectorAll('.line-wrap').forEach((lineWrap) => {
                    if (!lineWrap.classList.contains('complete')) {
                        const line = lineWrap.querySelector('.line');
                        const arrow = lineWrap.querySelector('.arrow');
                        gsap.set(arrow, {
                            scale: 1, 
                            autoAlpha: 0,
                        });
                        gsap.set(line, {
                            strokeDasharray: line.getTotalLength(),
                            strokeDashoffset: line.getTotalLength()
                        })
                    }
                })
            }
        })


        this.scrollMotion.setAnimationListener((currentIndex) => {
            let currentYOffset = this.scrollMotion.yOffset - this.scrollMotion.defaults.prevScrollHeight;
            let scrollRatio = currentYOffset / this.scrollMotion.scrollSection[currentIndex].scrollHeight;

            if(this.scrollMotion.scrollSection[currentIndex].querySelectorAll('.line-wrap').length > 0) {
                this.scrollMotion.scrollSection[currentIndex].querySelectorAll('.line-wrap').forEach((lineWrap) => {
                    const obj = lineWrap.closest('.line-object');
                    const line = lineWrap.querySelector('.line');
                    const arrow = lineWrap.querySelector('.arrow');
                    const d = 0.8;
                    let origin;
                    let rotate;

                    if (currentIndex === 5) {
                        if (obj.classList.contains('monthly-desktop')) {
                            origin = [1, 0.5];
                            rotate = true;
                        } else {
                            origin = [0, 0.7];
                            rotate = 190;
                        }
                    } else if (currentIndex === 6 && (document.querySelector('.monthly-wrap').getAttribute('data-monthly-country') === 'IT' || document.querySelector('.monthly-wrap').getAttribute('data-monthly-country') === 'FR')){
                        if (obj.classList.contains('monthly-desktop')) {
                            origin = [0, 0.5];
                            rotate = 180;
                        } else {
                            origin = [0, 0.9];
                            rotate = 210;
                        }
                    } else {
                        if (obj.classList.contains('monthly-desktop')) {
                            origin = [0, 0.5];
                        } else {
                            origin = [0, 0.6];
                        }
                        rotate = 180;
                    }

                    if (lineWrap.closest('[data-effect]').classList.contains('show-in') && !lineWrap.classList.contains('complete') && !lineWrap.classList.contains('ing')) {
                        gsap.to(arrow, {
                            duration: d,
                            autoAlpha: 1,
                            ease: "steps(50)",
                            immediateRender: true,
                            motionPath: {
                                path: line,
                                align: line,
                                alignOrigin: origin,
                                autoRotate: rotate,
                            },
                            onStart: function(){
                                lineWrap.classList.add('ing');
                            },
                            onComplete: function(){
                                lineWrap.classList.remove('ing');
                                lineWrap.classList.add('complete');
                            }
                        });
                        gsap.to(line, {
                            strokeDashoffset: 0,
                            duration: d,
                            ease: "steps(50)",
                            immediateRender: true,
                        })
                    }
                })
            }
    
            if(currentIndex === 0){

            }else if(currentIndex === 1){
            
            }else if(currentIndex === 2){
    
            }else if(currentIndex === 3){ 
    
            }else if(currentIndex === 4){

            }else if(currentIndex === 5){             

            }        
        });
    }

    attachEvents(){
        let that = this;
        let scrollRate = null;
        let scrollDepth = [25, 50, 75, 100];

        window.addEventListener('scroll', (e) => {
            window.dataLayer = window.dataLayer || [];
            let scrollRatio = (this.scrollMotion.yOffset / document.documentElement.scrollHeight) * 100;
            scrollDepth.map((depth) => {
                if(depth == scrollRatio.toFixed(0)){
                    console.log('scrolled....');
                    if(scrollRate !== depth){
                        dataLayer.push({
                            event: "custom_event_microsite",
                            "dynamic_param1": "custom_event",
                            "dynamic_param2": "MonthlyLG5",
                            "dynamic_param3": `Scroll Depth ${depth}%`,
                            "dynamic_param4": "",
                            "dynamic_param5": ""
                        });                          
                    }
                    scrollRate = depth;
                }
            });
        });
        window.addEventListener('resize', this.resize.bind(this));

        const kvBall = document.querySelectorAll('.monthly-section-kv .monthly-kv_ball');
        [...kvBall].forEach((ball) => {
            ball.addEventListener('animationend', () => {
                console.log('animation end...');
                ball.classList.add('boom');
            });
        });

        const monthlyVod = document.querySelectorAll('.monthly-vod');
        monthlyVod.length && [...monthlyVod].forEach((vod) => {
            that.setVodEvents(vod);
        });
    }

    update(){
        const monthlyVod = document.querySelectorAll('.monthly-vod');
        monthlyVod.length && [...monthlyVod].forEach((vod) => {
            this.updatePoster(vod);
        })
    }

    updatePoster(monthlyVideo){
        const video = monthlyVideo.querySelector('video');
        let posterImg = isMobile() ? video.getAttribute('poster').split('.png')[0] : video.getAttribute('poster').split('_mo')[0];
        if(isMobile()){
            video.setAttribute('poster', `${posterImg}_mo.png`);
        }else{
            video.setAttribute('poster', `${posterImg}.png`);
        }
    }

    setVodEvents(monthlyVideo){
        const video = monthlyVideo.querySelector('video');
        const playBtn = monthlyVideo.querySelector('.vod-play-btn');
        const ctaImgSrc = !!playBtn && playBtn.querySelector('img').src;        
        const posterImg = video.getAttribute('poster').split('.')[0];

        if(isMobile()){
            video.setAttribute('poster', `${posterImg}_mo.png`);
        }

        if(video.paused){
            monthlyVideo.classList.add('active');
        }

        monthlyVideo.addEventListener('mouseover', () => {
            !video.paused && monthlyVideo.classList.add('active');
        });
        monthlyVideo.addEventListener('mouseleave', () => {
            !video.paused && monthlyVideo.classList.remove('active');
        });
        playBtn.addEventListener('click', () => {           
            video.paused ? this.playVideo(video) : this.pauseVideo(video);

            if(isMobile()){
                setTimeout(() => {
                    monthlyVideo.classList.remove('active');
                }, 1500);
            }
        });
        // video.addEventListener('touchstart', () => {
        //     if(video.paused && monthlyVideo.classList.contains('active')) return false;
            
        //     monthlyVideo.classList.add('active');
        //     setTimeout(() => {
        //         monthlyVideo.classList.remove('active');
        //     }, 1500);
        // });

        video.onplay = (e) => {
            const srcStatus = ctaImgSrc.replace('play', 'pause');
            playBtn.querySelector('img').src = srcStatus;
            playBtn.querySelector('img').alt = 'pause';
        }
        video.onpause = (e) => {
            const srcStatus = ctaImgSrc.replace('pause', 'play');
            playBtn.querySelector('img').src = srcStatus;
            playBtn.querySelector('img').alt = 'play';
        }        
    }    

    resize () {
        if (isDesktop() && this.mobileFlag === true) {
            this.desktopFlag = true;
            this.mobileFlag = false;
            this.update();
            // console.log('desktop resize...');
        } else if (isMobile() && this.desktopFlag === true) {
            this.desktopFlag = false;
            this.mobileFlag = true;
            this.update();
            // console.log('mobile resize...');
        }
    }

    setSwiper(){
        [...hasElementsNum('.monthly-carousel')].forEach((el) => {
            const galleryCarousel = new Swiper(el, {
                loop: true,
                lazy: true,
                pagination: {
                    el: el.querySelector('.swiper-pagination'),
                    type: "fraction",
                    renderFraction: function (currentClass, totalClass) {
                        return `<span class="${currentClass}"></span>/<span class="${totalClass}"></span>`;
                    }
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },            
                on: {
                    init: function(){
                        const mobileSlide = el.querySelectorAll('.monthly__mobile');
                        (isMobile() && mobileSlide.length) && [...mobileSlide].forEach((slide) => {
                            slide.classList.add('swiper-slide');
                            this.update();
                        });                
                    },
                    sliderFirstMove: function(e){
                        const clickEvent = new Event('click');
                        const layerWrap = document.querySelector('.monthly-gallery-spot-layer.is-active');
                        layerWrap && layerWrap.querySelector('.monthly-gallery-spot-layer__close').dispatchEvent(clickEvent);
                    }
                }
            });
        });
    }

    setObserver(){  
        // 레이지로드 관찰
        this.imgSelector.length && [...this.imgSelector].forEach((selector) => {
            let config = {
                rootMargin: `0px 0px ${window.innerHeight}px 0px`, 
                threshold: 0                
            };
            callByObserver({target: selector, showCallback: this.setLazyload, keepObserver:false, options:config });
        });  
  
        // 동영상 관찰
        [...hasElementsNum('[data-observe]')].forEach((video) => {
           callByObserver({target: video, showCallback: this.playVideo, hideCallback: this.pauseVideo, keepObserver:true, options:{ rootMargin: '0px 0px 50px 0px', threshold: 0.4 } });
        });
     }

    setLazyload(image){
        image.src = image.dataset.src        
    }
  
     // 동영상 재생
    playVideo(video){
        const isPaused = video.paused;
        const videoSrc = video.querySelector('source');
  
        if (!videoSrc.getAttribute('src').length) {
           videoSrc.setAttribute('src', videoSrc.dataset.src);
  
           video.load();
           video.dataset.loaded = true
        }
  
        // 일시 정지 상태이면 영상을 실행한다
        isPaused && video.play();
    }
  
     // 동영상 일시정지
    pauseVideo(video){
        const isPaused = video.paused;
  
        if (!isPaused) {
           // 재생중이면 영상을 일시정지 한다.
           video.pause();
        }
    }    
}

window.scrollIndex = new ScrollIndex(
    '.monthly__container',
    '.monthly__scroll-section',
    '[data-effect]',
    { threshold: 0.95 }
);