    /*------------------------------
    SupahScroll
    ------------------------------*/
    class SupahScroll {

        scrollMotion;
        rafState;
        absTop;
        absTop2;

        constructor(options) {
            this.opt = options || {}
            this.el = this.opt.el ? this.opt.el : '.supah-scroll'
            this.speed = this.opt.speed ? this.opt.speed : 0.1;
            this.scrollMotion = window.scrollIndex.scrollMotion;

            this.init();
        }

        init() {
            this.scrollY = 0
            this.supahScroll = document.querySelectorAll(this.el)[0]
            this.supahScroll.classList.add('supah-scroll')
            // this.setObj()
            this.events()
            this.update()
            this.animate()
        }

        setObj(){
            this.absMessageObj.img = document.querySelector('.monthly__story-1 .monthly__cover-img');
            this.absMessageObj.wrapper = document.querySelector('.monthly__story-1 .monthly__cover-img').parentElement;
            
            this.absChkList.stickyEl = document.querySelector('.monthly__story-chklist .monthly__obj-img');
            this.absEpilogue.stickyEl = document.querySelector('.monthly__story-epilogue .monthly__cover-img');
        }

        update() {
            if (this.supahScroll === null) return
            document.body.style.height = `${this.supahScroll.getBoundingClientRect().height}px`
        }

        pause() {
            document.body.style.overflow = 'hidden'
            cancelAnimationFrame(this.raf)
        }

        play() {
            document.body.style.overflow = 'inherit'
            this.raf = requestAnimationFrame(this.animate.bind(this))
        }

        destroy() {
            this.supahScroll.classList.remove('supah-scroll')
            this.supahScroll.style.transform = 'none'
            document.body.style.overflow = 'inherit'
            window.removeEventListener('resize', this.update)
            cancelAnimationFrame(this.raf)
            delete this.supahScroll
        }

        animate() {
            this.scrollY += (window.scrollY - this.scrollY) * this.speed;

            if(window.scrollIndex == undefined) return false;

            const keyVisualEl = document.querySelector('.monthly__kv-area');
            if(keyVisualEl.getBoundingClientRect().top < 0){
                keyVisualEl.style.top = `${this.scrollY}px`;
            }

            if(this.scrollMotion.currentIndex >= 0){
                keyVisualEl.style.top = `0px`;
            }

            if(this.scrollMotion.currentIndex === 2){
                const stickyEl = this.scrollMotion.currentScene.querySelector('.monthly__obj-img');
                stickyEl.style.top = `${this.scrollY}px`;
            }

            if(this.scrollMotion.currentIndex === 5){
                const stickyEl = this.scrollMotion.currentScene.querySelector('.monthly__scroll-x');
                stickyEl.style.top = `${this.scrollY}px`;
            }

            if(this.scrollMotion.currentIndex === 8){
                const stickyEl = this.scrollMotion.currentScene.querySelector('.monthly__cover-img');
                const stickyScaleWidth = JSON.parse(stickyEl.dataset.scaleWidth);
                const stickyScaleHeight = JSON.parse(stickyEl.dataset.scaleHeight);

                if(!this.absTop){
                    this.absTop = this.scrollY + this.scrollMotion.currentScene.getBoundingClientRect().top;
                    console.log('absTop', this.absTop);
                }

                let currentYOffset = (this.scrollY + this.scrollMotion.defaults.threshold) - this.absTop;
                let scrollRatio = currentYOffset / this.scrollMotion.scrollSection[this.scrollMotion.currentIndex].scrollHeight;
                // console.log(`${this.scrollMotion.currentIndex} scrollRatio`, scrollRatio);

                stickyEl.style.top = `${this.scrollY}px`;
                stickyEl.parentElement.style.alignItems = 'flex-start';

                if (scrollRatio <= 0.82) {
                    stickyEl.style.width = `${this.scrollMotion.calcValues(stickyScaleWidth, currentYOffset)}%`;
                    stickyEl.style.height = `${this.scrollMotion.calcValues(stickyScaleHeight, currentYOffset)}vh`;
                    stickyEl.style.willChange = 'transform, width, height';
                    stickyEl.style.transformStyle = 'preserve-3d';
                }
            }

            if(this.scrollMotion.currentIndex === 9){
                const stickyEl = this.scrollMotion.currentScene.querySelector('.monthly__cover-img');
                const stickyItem = stickyEl.querySelector('.monthly__img-item');
                const stickyTransform = JSON.parse(stickyItem.dataset.transform);

                if(!this.absTop2){
                    this.absTop2 = this.scrollY + this.scrollMotion.currentScene.getBoundingClientRect().top;
                }

                let currentYOffset = (this.scrollY + this.scrollMotion.defaults.threshold) - this.absTop2;
                let scrollRatio = currentYOffset / this.scrollMotion.scrollSection[this.scrollMotion.currentIndex].scrollHeight;
                // console.log(`${this.scrollMotion.currentIndex} scrollRatio`, scrollRatio);

                stickyEl.style.top = `${this.scrollY}px`;

                if (scrollRatio <= 0.26) {
                    stickyItem.style.transform = `translate3d(0px, -${this.scrollMotion.calcValues(stickyTransform, currentYOffset)}%, 0px)`;
                    stickyItem.style.willChange = 'transform, opacity';
                    stickyItem.style.transformStyle = 'preserve-3d';
                }
  
                const prevStickyEl = this.scrollMotion.scrollSection[this.scrollMotion.currentIndex-1].querySelector('.monthly__cover-img');
                if(prevStickyEl){
                    prevStickyEl.parentElement.style.alignItems = 'flex-end';
                    prevStickyEl.style.width = '100%';
                    prevStickyEl.style.height = '100vh';
                }
            }

            if(this.scrollMotion.currentIndex === 10){
                const rectTop = this.scrollMotion.currentScene.querySelector('.boxItems').getBoundingClientRect().top;
                if(rectTop < window.innerHeight/2){
                    this.scrollMotion.setAnimationQueue()
                    (() => {
                        console.log('function 1...');
                    })
                    (3000)
                    (() => {
                        console.log('function 2...');
                    })
                    ();
                    
                    if(!this.scrollMotion.executeQueue){
                        this.scrollMotion.setAnimationQueue2([
                            () => {
                                console.log('execute motion 1...')
                                const boxItem = this.scrollMotion.currentScene.querySelector('.monthly__item-box.box1');
                                boxItem.classList.add('active');

                                boxItem.addEventListener('transitionend', () => {
                                    console.log('transition end...');
                                });
                                return true;
                            },
                            () => {
                                console.log('execute motion 2...')
                                const boxItem2 = this.scrollMotion.currentScene.querySelector('.monthly__item-box.box2');
                                boxItem2.classList.add('active');
                                boxItem.addEventListener('transitionend', () => {
                                    console.log('transition end...');
                                    return true
                                })
                            },
                            () => {
                                console.log('execute motion 3...')
                                const boxItem3 = this.scrollMotion.currentScene.querySelector('.monthly__item-box.box3');
                                boxItem3.classList.add('active');
                            },
                            () => {
                                console.log('execute motion 4...')
                                const boxItem4 = this.scrollMotion.currentScene.querySelector('.monthly__item-box.box4');
                                boxItem4.classList.add('active');
                            },
                        ])
                    }    
                }
            }

            this.supahScroll.style.transform = `translate3d(0,-${this.scrollY}px,0)`;

            this.raf = requestAnimationFrame(this.animate.bind(this));

            if (Math.abs(window.scrollY - this.scrollY) < 1) {
                cancelAnimationFrame(this.raf);
                this.rafState = false;
            }        
        }

        scrollTo(y) {
            window.scrollTo(0, y)
        }

        staticScrollTo(y) {
            cancelAnimationFrame(this.raf)
            this.scrollY = y
            window.scrollTo(0, y)
            this.supahScroll.style.transform = `translate3d(0,${-y}px,0)`
            this.play()
        }

        events() {
            window.addEventListener('load', this.update.bind(this))
            window.addEventListener('resize', this.update.bind(this))
            window.addEventListener('scroll', () => {
                if (!this.rafState) {
                    this.raf = requestAnimationFrame(this.animate.bind(this));
                    this.rafState = true;
                }
            })
            setTimeout(() => {           
                window.dispatchEvent(new Event('scroll'));
            }, 1000);
        }
    }

    /*------------------------------
    Initialize
    ------------------------------*/
    let supahscroll;
    supahscroll = new SupahScroll({
        el: '.monthly__container',
        speed: 0.1
    });