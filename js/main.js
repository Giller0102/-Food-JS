window.addEventListener('DOMContentLoaded', function() {
    // Tabs
    let tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        if (tabsContent[i]) {
            tabsContent[i].classList.add('show', 'fade');
            tabsContent[i].classList.remove('hide');
            tabs[i].classList.add('tabheader__item_active');
        }
    }
    
    // Проверяем, существуют ли элементы табов
    if (tabs.length > 0 && tabsContent.length > 0) {
        hideTabContent();
        showTabContent();

        tabsParent.addEventListener('click', function(event) {
            const target = event.target;
            if (target && target.classList.contains('tabheader__item')) {
                tabs.forEach((item, i) => {
                    if (target == item) {
                        hideTabContent();
                        showTabContent(i);
                    }
                });
            }
        });
    }
    
    // Timer
    function updateTimer() {
        const deadline = '2025-12-31'; // Обновленная дата

        function getTimeRemaining(endtime) {
            const t = Date.parse(endtime) - Date.parse(new Date()),
                days = Math.floor(t / (1000 * 60 * 60 * 24)),
                hours = Math.floor((t / (1000 * 60 * 60)) % 24),
                minutes = Math.floor((t / 1000 / 60) % 60),
                seconds = Math.floor((t / 1000) % 60);

            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        }

        function getZero(num) {
            return num >= 0 && num < 10 ? '0' + num : num;
        }

        function setClock(selector, endtime) {
            const timer = document.querySelector(selector);
            if (!timer) return;

            const days = timer.querySelector("#days"),
                hours = timer.querySelector('#hours'),
                minutes = timer.querySelector('#minutes'),
                seconds = timer.querySelector('#seconds'),
                timeInterval = setInterval(updateClock, 1000);

            function updateClock() {
                const t = getTimeRemaining(endtime);

                if (t.total <= 0) {
                    clearInterval(timeInterval);
                    if (days) days.innerHTML = '00';
                    if (hours) hours.innerHTML = '00';
                    if (minutes) minutes.innerHTML = '00';
                    if (seconds) seconds.innerHTML = '00';
                } else {
                    if (days) days.innerHTML = getZero(t.days);
                    if (hours) hours.innerHTML = getZero(t.hours);
                    if (minutes) minutes.innerHTML = getZero(t.minutes);
                    if (seconds) seconds.innerHTML = getZero(t.seconds);
                }
            }
            
            updateClock();
        }

        setClock('.timer', deadline);
    }
    
    updateTimer();

    // Modal
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalCloseBtn = document.querySelector('[data-close]');

    if (modal) {
        function closeModal() {
            modal.classList.add('hide');
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }

        function openModal() {
            modal.classList.add('show');
            modal.classList.remove('hide');
            document.body.style.overflow = 'hidden';
            if (modalTimerId) clearInterval(modalTimerId);
        }
        
        if (modalTrigger.length > 0) {
            modalTrigger.forEach(btn => {
                btn.addEventListener('click', openModal);
            });
        }

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === "Escape" && modal.classList.contains('show')) {
                closeModal();
            }
        });

        const modalTimerId = setTimeout(openModal, 300000);

        function showModalByScroll() {
            if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
                openModal();
                window.removeEventListener('scroll', showModalByScroll);
            }
        }
        
        window.addEventListener('scroll', showModalByScroll);
    }

    // Menu Cards
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = Math.round(this.price * this.transfer);
        }

        render() {
            if (!this.parent) return;
            
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                element.classList.add('menu__item');
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src="${this.src}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            
            this.parent.append(element);
        }
    }

    // Создаем карточки меню
    const menuContainer = document.querySelector(".menu .container");
    if (menuContainer) {
        try {
            new MenuCard(
                "img/tabs/vegy.jpg",
                "vegy",
                'Меню "Фитнес"',
                'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
                9,
                ".menu .container"
            ).render();

            new MenuCard(
                "img/tabs/post.jpg",
                "post",
                'Меню "Постное"',
                'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
                14,
                ".menu .container"
            ).render();

            new MenuCard(
                "img/tabs/elite.jpg",
                "elite",
                'Меню “Премиум”',
                'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
                21,
                ".menu .container"
            ).render();
        } catch (error) {
            console.error('Ошибка при создании карточек меню:', error);
        }
    }

    // Calculator
    function initCalculator() {
        const result = document.querySelector('.calculating__result span');
        const gender = document.querySelectorAll('#gender .calculating__choose-item');
        const height = document.querySelector('#height');
        const weight = document.querySelector('#weight');
        const age = document.querySelector('#age');
        const activity = document.querySelectorAll('.calculating__choose_big .calculating__choose-item');

        if (!result || !height || !weight || !age) return;

        let sex = 'female',
            activityValue = 1.375;

        // Загружаем сохраненные значения
        function loadSettings() {
            const savedSex = localStorage.getItem('sex');
            const savedActivity = localStorage.getItem('activity');
            const savedHeight = localStorage.getItem('height');
            const savedWeight = localStorage.getItem('weight');
            const savedAge = localStorage.getItem('age');

            if (savedSex) {
                sex = savedSex;
                updateActiveClass(gender, savedSex === 'female' ? 0 : 1);
            }

            if (savedActivity) {
                activityValue = +savedActivity;
                const activityIndex = getActivityIndex(activityValue);
                updateActiveClass(activity, activityIndex);
            }

            if (savedHeight) height.value = savedHeight;
            if (savedWeight) weight.value = savedWeight;
            if (savedAge) age.value = savedAge;

            calcTotal();
        }

        function getActivityIndex(value) {
            const activities = [1.2, 1.375, 1.55, 1.725];
            return activities.indexOf(value);
        }

        function updateActiveClass(elements, index) {
            elements.forEach((item, i) => {
                item.classList.remove('calculating__choose-item_active');
                if (i === index) {
                    item.classList.add('calculating__choose-item_active');
                }
            });
        }

        function calcTotal() {
            if (!height.value || !weight.value || !age.value) {
                result.textContent = '____';
                return;
            }

            const heightVal = parseFloat(height.value);
            const weightVal = parseFloat(weight.value);
            const ageVal = parseFloat(age.value);

            if (isNaN(heightVal) || isNaN(weightVal) || isNaN(ageVal)) {
                result.textContent = '____';
                return;
            }

            let total;
            if (sex === 'female') {
                total = (447.6 + (9.2 * weightVal) + (3.1 * heightVal) - (4.3 * ageVal)) * activityValue;
            } else {
                total = (88.36 + (13.4 * weightVal) + (4.8 * heightVal) - (5.7 * ageVal)) * activityValue;
            }

            result.textContent = Math.round(total);
        }

        // Обработчики для полей ввода
        height.addEventListener('input', () => {
            localStorage.setItem('height', height.value);
            calcTotal();
        });

        weight.addEventListener('input', () => {
            localStorage.setItem('weight', weight.value);
            calcTotal();
        });

        age.addEventListener('input', () => {
            localStorage.setItem('age', age.value);
            calcTotal();
        });

        // Обработчики для выбора пола
        gender.forEach((item, i) => {
            item.addEventListener('click', () => {
                gender.forEach(btn => btn.classList.remove('calculating__choose-item_active'));
                item.classList.add('calculating__choose-item_active');
                sex = i === 0 ? 'female' : 'male';
                localStorage.setItem('sex', sex);
                calcTotal();
            });
        });

        // Обработчики для выбора активности
        activity.forEach((item, i) => {
            item.addEventListener('click', () => {
                activity.forEach(btn => btn.classList.remove('calculating__choose-item_active'));
                item.classList.add('calculating__choose-item_active');
                
                const values = [1.2, 1.375, 1.55, 1.725];
                activityValue = values[i];
                localStorage.setItem('activity', activityValue);
                calcTotal();
            });
        });

        loadSettings();
    }
    
    initCalculator();

    // Forms
    const forms = document.querySelectorAll('form');
    
    if (forms.length > 0) {
        const message = {
            loading: 'Загрузка...',
            success: 'Спасибо! Скоро мы с вами свяжемся',
            failure: 'Что-то пошло не так...'
        };

        function postData(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                // Создаем уведомление о загрузке
                const statusMessage = document.createElement('div');
                statusMessage.classList.add('status-message');
                statusMessage.style.cssText = `
                    display: block;
                    margin: 10px auto;
                    padding: 10px;
                    text-align: center;
                    background: #f0f0f0;
                    border-radius: 5px;
                `;
                statusMessage.textContent = message.loading;
                
                form.insertAdjacentElement('afterend', statusMessage);

                const formData = new FormData(form);

                // Используем fetch вместо XMLHttpRequest
                fetch('server.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    showThanksModal(message.success);
                    form.reset();
                    
                    setTimeout(() => {
                        if (statusMessage) statusMessage.remove();
                    }, 2000);
                })
                .catch(error => {
                    showThanksModal(message.failure);
                    console.error('Error:', error);
                    
                    setTimeout(() => {
                        if (statusMessage) statusMessage.remove();
                    }, 2000);
                });
            });
        }

        forms.forEach(item => {
            postData(item);
        });
    }

    // Show thanks modal
    function showThanksModal(message) {
        const modal = document.querySelector('.modal');
        const prevModalDialog = document.querySelector('.modal__dialog');
        
        if (!modal || !prevModalDialog) return;

        prevModalDialog.classList.add('hide');
        
        // Открываем модальное окно если оно закрыто
        if (modal.classList.contains('hide')) {
            modal.classList.add('show');
            modal.classList.remove('hide');
            document.body.style.overflow = 'hidden';
        }

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        modal.append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.remove('hide');
            prevModalDialog.classList.add('show');
            
            // Закрываем модальное окно через 4 секунды
            setTimeout(() => {
                if (modal.classList.contains('show')) {
                    modal.classList.add('hide');
                    modal.classList.remove('show');
                    document.body.style.overflow = '';
                }
            }, 2000);
        }, 4000);
    }

    // Слайдер (если нужен)
    function initSlider() {
        const slides = document.querySelectorAll('.offer__slide');
        const prev = document.querySelector('.offer__slider-prev');
        const next = document.querySelector('.offer__slider-next');
        const current = document.querySelector('#current');
        const total = document.querySelector('#total');
        
        if (!slides.length || !prev || !next || !current || !total) return;

        let slideIndex = 1;
        
        // Показываем общее количество слайдов
        total.textContent = slides.length < 10 ? `0${slides.length}` : slides.length;
        
        function showSlides(n) {
            if (n > slides.length) slideIndex = 1;
            if (n < 1) slideIndex = slides.length;
            
            slides.forEach(slide => slide.style.display = 'none');
            slides[slideIndex - 1].style.display = 'block';
            
            current.textContent = slideIndex < 10 ? `0${slideIndex}` : slideIndex;
        }
        
        showSlides(slideIndex);
        
        function plusSlides(n) {
            showSlides(slideIndex += n);
        }
        
        prev.addEventListener('click', () => plusSlides(-1));
        next.addEventListener('click', () => plusSlides(1));
    }
    
    initSlider();
});
