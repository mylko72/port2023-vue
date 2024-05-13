(function(){
    window.monthlyLg = window.monthlyLg || {};
    const target = {
        section: ".monthly-gallery-spot__cta",
    }
    const selectors = {
        layerInner: "monthly-gallery-spot-layer__inner",
        spotCta: "monthly-gallery-spot__cta",
        layerWrap: "monthly-gallery-spot-layer",
        layerCloseCta: "monthly-gallery-spot-layer__close",
        isActive: "is-active",
        closeText: {
            "GB" : "Close",
            "DE" : "Schließen",
            "FR" : "Fermer",
            "IT" : "Chiudi",
        }
    }
    class gallerySpot {
        constructor(el){
            const that = this;
            this.ele = {
                section: el
            };
            this.mobileFlag = null;
            this.desktopFlag = null;
            this.closeTagFocusMoving = false;
            this.country = document.querySelector('.monthly-wrap').dataset.monthlyCountry;
            this.handler = {
                resize: this.resize.bind(this),
                scroll: this.scroll.bind(this),
                enterTag: function (e) {
                    if (that.closeTagFocusMoving) return false;

                    if (e.type === 'focus') {
                        if (!that.ele.layer.classList.contains(selectors.isActive)) {
                            that.openLayer(true);
                        }
                    } else {
                        that.openLayer();
                    }
                },
                clickCloseBtn: function (e) {
                    that.closeLayer();
                },
                leaveTag: function (e) {
                    that.closeLayer(false);
                },
                blurTag: function (e) {
                    requestAnimationFrame(function () {
                        if (that.ele.layer !== document.activeElement.closest(`.${selectors.layerWrap}`) && that.ele.section !== document.activeElement.closest(`.${selectors.spotCta}`)) {
                            that.closeLayer(false);
                        }
                    })
                },
                keydown: function (e) {
                    const layer = e.target.closest(`.${selectors.layerWrap}`);
                    const openCta = e.target.classList.contains(`${selectors.spotCta}`);
                    const closeCta = e.target.classList.contains(`${selectors.layerCloseCta}`);

                    if(e.shiftKey && e.keyCode == 9 && e.target.classList.contains(selectors.layerInner)) { 
                        e.preventDefault();
                        const cta = that.mapping(layer, layer.getAttribute('data-spot-box'))
                        cta.focus();
                    }
                    
                    if (!e.shiftKey && e.keyCode == 9 && openCta) {
                        const mappinglayer = that.mapping(e.target, e.target.getAttribute('data-spot-cta'))
                        if (mappinglayer.classList.contains(selectors.isActive)) {
                            e.preventDefault();
                            mappinglayer.querySelector(`.${selectors.layerInner}`).focus();
                        }
                    }

                    if (e.shiftKey && e.keyCode == 9 && openCta) {
                        if (e.target.classList.contains(selectors.isActive)) {
                            that.closeLayer();
                        }
                    }

                    if (e.keyCode == 9 && closeCta) {
                        const mappingCta = that.mapping(layer, layer.getAttribute('data-spot-box'))
                        e.preventDefault();
                        const keyboardfocusableElements = [
                            ...document.querySelectorAll(
                              'a[href], button, input, textarea, select, details, [role="button"]',
                            ),
                        ].filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden') && el.offsetParent !== null);

                        const searchIndex = keyboardfocusableElements.findIndex((el) => el === mappingCta);
                        keyboardfocusableElements[searchIndex+1].focus();
                    }
                    
                    if (e.keyCode === 27 && document.querySelectorAll(`.${selectors.spotCta}.${selectors.isActive}`).length > 0) {
                        document.querySelectorAll(`.${selectors.spotCta}.${selectors.isActive}`).forEach(function (el) {
                            const mappinglayer = that.mapping(el, el.getAttribute('data-spot-cta'));
                            mappinglayer.querySelector(`.${selectors.layerCloseCta}`).click();
                        });
                    }
                }
            }
            gallerySpot.instances.set(el, this);
            this.init();
        }
        init () {
            this.setProperty();
            this.unbindEvents();
            this.bindEvents();
            this.setDefPos();
        }
        reInit(){
            this.init();
        }
        setProperty (){
            const that = this;
            if (window.innerWidth > 768) {
                this.desktopFlag = true;
                this.mobileFlag = false;
            } else {
                this.desktopFlag = false;
                this.mobileFlag = true;
            }

            const index = this.ele.section.getAttribute('data-spot-cta');
            const layerData = JSON.parse(this.ele.section.dataset.layerOption);
            layerData.name = this.ele.section.querySelector('.sr-only').textContent;
            that.drawLayer(index, layerData);
        }
        bindEvents () {
            window.addEventListener('resize', this.handler.resize);
            window.addEventListener('scroll', this.handler.scroll);
            window.addEventListener('keydown', this.handler.keydown); //keydown
            this.ele.closeCta.addEventListener('click', this.handler.clickCloseBtn);
            this.ele.section.addEventListener('focus', this.handler.enterTag);
            this.ele.section.addEventListener('click', this.handler.enterTag);
            // this.ele.section.addEventListener('focusout', this.handler.blurTag);
            this.ele.section.addEventListener('mouseenter', this.handler.enterTag);
            this.ele.section.addEventListener('mouseleave', this.handler.leaveTag);
            this.ele.layer.addEventListener('focusout', this.handler.blurTag);
            this.ele.layer.addEventListener('mouseenter', this.handler.enterTag);
            this.ele.layer.addEventListener('mouseleave', this.handler.leaveTag);
        }
        unbindEvents () {
            window.removeEventListener('resize', this.handler.resize);
            window.removeEventListener('scroll', this.handler.scroll);
            window.removeEventListener('keydown', this.handler.keydown); //keydown
            this.ele.closeCta.removeEventListener('click', this.handler.clickCloseBtn);
            this.ele.section.removeEventListener('focus', this.handler.enterTag);
            this.ele.section.removeEventListener('click', this.handler.enterTag);
            // this.ele.section.removeEventListener('focusout', this.handler.blurTag);
            this.ele.section.removeEventListener('mouseenter', this.handler.enterTag);
            this.ele.section.removeEventListener('mouseleave', this.handler.leaveTag);
            this.ele.layer.removeEventListener('focusout', this.handler.blurTag);
            this.ele.layer.removeEventListener('mouseenter', this.handler.enterTag);
            this.ele.layer.removeEventListener('mouseleave', this.handler.leaveTag);
        }
        resize () {
            if (window.innerWidth > 768 && this.mobileFlag === true) {
                this.desktopFlag = true;
                this.mobileFlag = false;
                this.setDefPos();
            } else if (window.innerWidth <= 768 && this.desktopFlag === true) {
                this.desktopFlag = false;
                this.mobileFlag = true;
                this.setDefPos();
            }
            if (this.ele.section.classList.contains(selectors.isActive)) {
                this.setOpenPos();
            }
        }
        scroll () {
            if (this.ele.section.classList.contains(selectors.isActive)) {
                this.setOpenPos();
            }
        }
        drawLayer(idx, data) {
            const closeText = selectors.closeText[this.country] !== undefined ? selectors.closeText[this.country] : 'close';
            const layerEl = `<div class="monthly-gallery-spot-layer" data-spot-position="${data.position}" data-spot-box="${idx}" aria-hidden="true">
                <div class="arrow"></div>
                <div class="monthly-gallery-spot-layer__inner">
                    <div class="monthly-gallery-spot-layer__image">
                        <img class="cmp-image__image c-image__img" src="${data.imageSrc}" alt="${data.imageAlt}">
                    </div>
                    <div class="monthly-gallery-spot-layer__content">
                        <p class="sku">${data.sku}</p>
                        <p class="name">${data.name}</p>
                        <div class="cta-wrap">
                            <a class="cmp-button c-button c-button--default default w-medium m-medium" href="${data.link}" data-dynamic-param1="${data.param1}" data-dynamic-param2="${data.param2}" data-dynamic-param3="${data.param3}" data-dynamic-param4="${data.param4}" data-dynamic-param5="${data.param5}" target="_blank"><span class="cmp-button__text c-button__text">${data.ctaText}</span></a>
                        </div>
                    </div>
                    <button type="button" class="monthly-gallery-spot-layer__close">
                        <span class="sr-only">${closeText}</span>
                    </button>
                </div>
            </div>`;

            document.querySelector('.monthly-gallery-spot-layers').insertAdjacentHTML('beforeend', layerEl);
            const layer = document.querySelector(`[data-spot-box="${idx}"]`);
            this.ele.layer = layer;
            this.ele.closeCta = layer.querySelector(`.${selectors.layerCloseCta}`);
        }
        mapping (target, layer) {
            if (target.classList.contains(`${selectors.spotCta}`)) {
                return document.querySelector(`[data-spot-box="${layer}"]`);
            } else {
                let activeCta;
                if (document.querySelectorAll(`[data-spot-cta="${layer}"]`).length > 1) {
                    document.querySelectorAll(`[data-spot-cta="${layer}"]`).forEach(function(ctaEl){
                        if (ctaEl.offsetParent !== null) {
                            activeCta = ctaEl;
                        }
                    })
                } else {
                    activeCta = document.querySelector(`[data-spot-cta="${layer}"]`)
                }
                return activeCta;
            }
        }
        setDefPos () {
            const desktopPos = this.ele.section.getAttribute('data-pos-desktop');
            const mobilePos = this.ele.section.getAttribute('data-pos-mobile');
            const posArray = this.desktopFlag === true ? desktopPos : mobilePos;
            const posNow = posArray.replace(/\s+/g, '').split(",").reduce((obj, str) => {
                let strParts = str.split(':');
                obj[strParts[0]] = strParts[1];
                return obj;
            }, {});

            this.ele.section.style.top = posNow.top;
            this.ele.section.style.left = posNow.left;

            this.ele.layer.classList.remove(`${selectors.layerWrap}--left`, `${selectors.layerWrap}--right`);
            this.ele.layer.querySelector('.arrow').style.left = '';


            if (this.desktopFlag === true) {
                const setPo = this.ele.layer.getAttribute('data-spot-position');
                if (setPo !== 'center') {
                    this.ele.layer.classList.add(`${selectors.layerWrap}--${setPo}`);
                }
            }
        }
        setOpenPos (focus) {
            const that = this;
            if (this.ele.layer.querySelector(`.${selectors.layerInner}`).hasAttribute('tabindex') === false) {
                this.ele.layer.querySelector(`.${selectors.layerInner}`).setAttribute('tabIndex', 0);
            }

            if (focus !== undefined) {
                setTimeout(() => {
                    that.ele.layer.querySelector(`.${selectors.layerInner}`).focus();
                }, 200);
            }

            const ctaRect = this.ele.section.getBoundingClientRect();
            const layerRect = this.ele.layer.querySelector(`.${selectors.layerInner}`).getBoundingClientRect();

            if (this.desktopFlag === true) {
                this.ele.layer.style.left = ctaRect.left + "px",
                this.ele.layer.style.top = ctaRect.top  + "px";
    
                if (this.ele.layer.offsetLeft < 0) {
                    this.ele.layer.classList.remove(`${selectors.layerWrap}--left`)
                    this.ele.layer.classList.add(`${selectors.layerWrap}--right`);
                } else if (layerRect.left + layerRect.width > window.innerWidth) {
                    if (this.ele.layer.classList.contains(`${selectors.layerWrap}--right`)) {
                        this.ele.layer.classList.remove(`${selectors.layerWrap}--right`);
                    }
                }
            } else {
                this.ele.layer.style.top = ctaRect.top + ctaRect.height + "px";
                const ctaCenter = ctaRect.left + ctaRect.width / 2;
                const calcLeft = ctaCenter - (layerRect.width / 2);
                const layerRightPo = ctaCenter + (layerRect.width / 2);
                const radius = getComputedStyle(this.ele.layer.querySelector('.monthly-gallery-spot-layer__inner')).getPropertyValue("border-top-right-radius");

                if (layerRightPo + 16 >= window.innerWidth) {
                    const calcRight = layerRightPo - window.innerWidth;
                    const ctaPo = ctaCenter - (calcLeft - calcRight - 16);
                    const arrowPo = ctaPo + this.ele.layer.querySelector('.arrow').getBoundingClientRect().width;

                    this.ele.layer.style.left = `${calcLeft - calcRight - 16}px`;

                    if (arrowPo + (parseInt(radius) / 2) + 2 > window.innerWidth - 16) {
                        const arrowL = arrowPo + (parseInt(radius) / 2) - (window.innerWidth - 16) + 4;
                        this.ele.layer.querySelector('.arrow').style.left = `${ctaPo - arrowL}px`;
                    } else {
                        this.ele.layer.querySelector('.arrow').style.left = `${ctaPo}px`
                    }
                } else if (calcLeft < 0) {
                    this.ele.layer.style.left = '16px';

                    if (ctaCenter - 16 < 16 + (parseInt(radius) / 2) + 2 ) {
                        this.ele.layer.querySelector('.arrow').style.left = `${16 + (parseInt(radius) / 2) + 4}px`;
                    } else {
                        this.ele.layer.querySelector('.arrow').style.left = `${ctaCenter - 16}px`
                    }

                } else {
                    this.ele.layer.querySelector('.arrow').style.left = '50%'
                    this.ele.layer.style.left = `${calcLeft}px`;
                }
            }
        }
        openLayer (focus) {
            this.ele.section.classList.add(selectors.isActive);
            this.ele.layer.classList.add(selectors.isActive);
            this.ele.layer.setAttribute('aria-hidden', false);
            this.ele.layer.style.left = "";
            this.ele.layer.style.display = "block"

            this.setOpenPos(focus);
        }
        closeLayer (focus) {
            const that = this;
            const focusParam = focus === undefined ? true : focus;
            if (focusParam && document.activeElement.closest(`.${selectors.layerWrap}`) === this.ele.layer) {
                that.closeTagFocusMoving = true;
                that.ele.layer.blur();
            }

            that.ele.section.classList.remove(selectors.isActive);
            this.ele.layer.classList.remove(selectors.isActive);
            this.ele.layer.setAttribute('aria-hidden', true);
            this.ele.layer.style.display = '';
            if (this.ele.layer.querySelector(`.${selectors.layerInner}`).hasAttribute('tabindex')) {
                this.ele.layer.querySelector(`.${selectors.layerInner}`).removeAttribute('tabIndex');
            }

            if (focusParam && this.closeTagFocusMoving) {
                setTimeout(() => {
                    that.ele.section.focus();
                    that.closeTagFocusMoving = false;
                }, 50);
            }
        }
    }
    gallerySpot.instances = new WeakMap;
    window.monthlyLg.gallerySpot = {
        init: init,
        reInit: function(){
            document.querySelectorAll(target.section).forEach((el) => {
                gallerySpot.instances.has(el) ? gallerySpot.instances.get(el).reInit() : new gallerySpot(el);
            })
        },
        setOpenPos: function (el){
            gallerySpot.instances.has(el) ? gallerySpot.instances.get(el).setOpenPos() : new gallerySpot(el);
        },
        closeLayer: function(el){
            gallerySpot.instances.get(el).closeLayer(false);
        }
    }
    function init(){
        document.querySelectorAll(target.section).forEach((el) => {
            new gallerySpot(el);
        })
    }    
    init();
})()