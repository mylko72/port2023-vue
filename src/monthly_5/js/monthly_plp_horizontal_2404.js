(function(){
    window.monthlyLg = window.monthlyLg || {};
    const target = {
        section: ".monthly-plp--horizontal",
        energyLabel: ".monthly-plp-item__energy-wrap"
    },
    breakPoints = 1024;
    class plpHorizontal {
        constructor(el){
            const that = this;
            this.ele = {
                section: el,
            };
            this.selector = {
                slideWrap: ".monthly-plp__inner",
                productItem: ".monthly-plp-item",
                slidePrev: ".c-carousel__button--pagination--prev",
                slideNext: ".c-carousel__button--pagination--next",
                pagination: ".c-carousel__pagination",
            }
            this.swiper = null;
            this.mobileFlag = null;
            this.desktopFlag = null;
            this.sameHeightItems = ['monthly-plp-item__ufn', 'price-description', 'price-optional'];
            this.handler = {
                resize: this.resize.bind(this),
                energyClick: this.energyClick,
                energyAllClose: this.energyAllClose,
            }
            this.resizeTimer = null;
            this.energyLabel = [];
            plpHorizontal.instances.set(el, this);
            this.init();
        }
        init () {
            this.setProperty();
            this.unbindEvents();
            this.bindEvents();
            this.setSwiper();
        }
        reInit(){
            this.init();
        }
        setProperty(){
            const that = this;
            if (window.innerWidth > breakPoints) {
                this.desktopFlag = true;
                this.mobileFlag = false;
            } else {
                this.desktopFlag = false;
                this.mobileFlag = true;
            }
            this.ele.swiper = this.ele.section.querySelector(this.selector.slideWrap);
            this.ele.productItem = this.ele.section.querySelectorAll(this.selector.productItem);
            this.ele.ctaNext = this.ele.section.querySelector(this.selector.slideNext);
            this.ele.ctaPrev = this.ele.section.querySelector(this.selector.slidePrev);
            this.ele.pagination = this.ele.section.querySelector(this.selector.pagination);
            [...this.ele.productItem].forEach(function(card){
                const energyCta = card.querySelectorAll('.monthly-plp-item__energy-wrap .c-energy-grade')

                if (energyCta.length > 0) {
                    energyCta.forEach(function(cta){
                        that.energyLabel.push(cta)
                    })
                }
            })

            this.swiperOpt = {
                slidesPerView: 'auto',
                autoHeight: false,
                navigation: {
                    nextEl: this.ele.ctaNext,
                    prevEl: this.ele.ctaPrev,
                },
                pagination: {
                    el: this.ele.pagination,
                    enabled: true,
                    type: 'fraction',
                },
                breakpoints: {
                    769: {
                        autoHeight: true,
                        // allowTouchMove: false,
                    }
                },
                on: {
                    init: function(){
                        if (this.slides.length === 1) {
                            that.ele.section.classList.add('hide-pagination');
                        } else {
                            that.ele.section.classList.remove('hide-pagination');
                        }
                    }
                }
            }
        }
        bindEvents () {
            const that = this;
            window.addEventListener('resize', this.handler.resize);
            if (this.energyLabel.length > 0) {
                this.energyLabel.forEach(function(cta){
                    cta.addEventListener('click', that.energyClick)
                })
                window.addEventListener('click', this.handler.energyAllClose);
            }
        }
        unbindEvents () {
            const that = this;
            window.removeEventListener('resize', this.handler.resize);
            
            if (this.energyLabel.length > 0) {
                this.energyLabel.forEach(function(cta){
                    cta.removeEventListener('click', that.energyClick)
                })
                window.removeEventListener('click', this.handler.energyAllClose);
            }
        }
        energyClick(e) {
            e.preventDefault();
            window.monthlyLg.plpHorizontal.energyClose();

            const ctaWrap = e.currentTarget.closest(target.energyLabel)
            ctaWrap.querySelector('.c-tooltip__container').classList.toggle('active');
            if (ctaWrap.querySelector('.c-tooltip__container').classList.contains('active')) {
                e.currentTarget.setAttribute('aria-expanded', true);
            } else {
                e.currentTarget.setAttribute('aria-expanded', false);
            }
        }
        energyAllClose(e) {
            if (e.target.closest(target.energyLabel) === null) {
                window.monthlyLg.plpHorizontal.energyClose();
            } 
        }
        resize () {
            const that = this;
            clearTimeout(that.resizeTimer);
            that.resizeTimer = null;
            that.resizeTimer = setTimeout(function(){
                if (window.innerWidth > breakPoints && that.mobileFlag === true) {
                    that.desktopFlag = true;
                    that.mobileFlag = false;
                    that.setSwiper();
                } else if (window.innerWidth <= breakPoints && that.desktopFlag === true) {
                    that.desktopFlag = false;
                    that.mobileFlag = true;
                    that.setSwiper();
                }
                that.setHeight();
            }, 400);
        }
        setList() {
            const that = this;
            if (this.desktopFlag === true) {
                [...this.ele.productItem].reduce((wrapper, item, index) => {
                    if (index % 2 === 0) {
                        wrapper = document.createElement("div");
                        wrapper.classList.add("swiper-slide", "panel-slide");
                        item.before(wrapper);
                    }
                    wrapper.appendChild(item);
                    return wrapper;
                }, null);
            } else {
                this.ele.productItem.forEach((mobileSlide) => {
                    that.ele.section.querySelector('.swiper-wrapper').appendChild(mobileSlide)
                    mobileSlide.classList.add('swiper-slide');
                })
                this.ele.section.querySelectorAll('.panel-slide').forEach((desktopSlide) => {
                    that.ele.section.querySelector('.swiper-wrapper').removeChild(desktopSlide);
                });
                this.ele.section.classList.remove('hide-pagination');
            }
        }
        setDefault() {
            const that = this;
            this.sameHeightItems.forEach(function(item){
                that.ele.swiper.querySelectorAll(`.${item}`).forEach(function(el){
                    el.style.height = ''
                })
            });
        }
        setHeight() {
            this.setDefault();
            const that = this;

            this.sameHeightItems.forEach(function(item){
                const heights = [];
                that.ele.swiper.querySelectorAll(`.${item}`).forEach(function(el) {
                    heights.push(el.offsetHeight);
                });
                const maxH = Math.max.apply(null, heights);
                that.ele.swiper.querySelectorAll(`.${item}`).forEach(function(el){
                    el.style.height = `${maxH}px`
                })
            })
        }
        setSwiper() {
            if (this.swiper !== null) {
                this.destroySwiper();
            }
            this.setList();
            this.setHeight();
            if (this.desktopFlag === true && this.ele.productItem.length < 4) {
                this.ele.section.classList.add('hide-pagination');
                return false;
            }
            const swInstance = new Swiper(this.ele.swiper, this.swiperOpt);
            this.swiper = swInstance;
        }
        destroySwiper() {
            this.swiper.destroy();
        }
    }
    plpHorizontal.instances = new WeakMap;
    window.monthlyLg.plpHorizontal = {
        init: init,
        reInit: function(){
            document.querySelectorAll(target.section).forEach((el) => {
                plpHorizontal.instances.has(el) ? plpHorizontal.instances.get(el).reInit() : new plpHorizontal(el);
            })
        },
        energyClose: function(){
            document.querySelectorAll(target.energyLabel).forEach(function(energyCtaWrap){
                energyCtaWrap.querySelector('.c-tooltip__container').classList.remove('active');
                energyCtaWrap.querySelector('.c-energy-grade').setAttribute('aria-expanded', false);
            })
        }
    }
    function init(){
        document.querySelectorAll(target.section).forEach((el) => {
            new plpHorizontal(el);
        })
    }
    init();
})()