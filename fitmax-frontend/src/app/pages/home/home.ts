import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LanguageService, Lang } from '../../core/language';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  currentLang: Lang = 'en';
  currentSlide = 0;
  private slideInterval: any;

  slides = [
    { image: 'assets/slides/slide1.png' },
    { image: 'assets/slides/slide2.png' },
    { image: 'assets/slides/slide3.png' },
  ];

  translations = {
    en: {
      logout: 'Logout',
      nav: { workouts: 'Workouts', ai: 'AI Assistant', calculator: 'Calculator', face: 'Face Exercises', profile: 'Profile' },
      hero: { scroll: 'Scroll to explore' },
      about: {
        tag: 'About Us',
        title: 'Train Smarter.\nLive Stronger.',
        desc: 'FITMAX is a next-generation fitness platform that combines AI-powered personalization with science-backed training methods. Whether you train at home or in the gym, we build your perfect plan.',
        stat1: '10K+', label1: 'Active Members',
        stat2: '500+', label2: 'Workouts Generated',
        stat3: '98%', label3: 'Satisfaction Rate',
        cta: 'Start Training',
      },
      reviews: {
        tag: 'Reviews',
        title: 'What our members say',
        items: [
          { name: 'Arman K.', role: 'Member since 2024', text: 'FITMAX completely changed my approach to training. The AI plans are incredibly accurate and adapt to my schedule.' },
          { name: 'Dinara S.', role: 'Home trainer', text: 'Finally a platform that actually works for home workouts. Lost 8kg in 3 months following the AI-generated plans.' },
          { name: 'Bekzat M.', role: 'Gym enthusiast', text: 'The calorie calculator and workout tracker are the best I have ever used. Absolutely recommend to everyone.' },
          { name: 'Asel T.', role: 'Beginner', text: 'I was scared to start but FITMAX made it easy. The beginner plans are perfect and the AI assistant answers everything.' },
        ],
      },
      updates: {
        tag: 'Updates',
        title: 'Latest from FITMAX',
        items: [
          { date: 'Apr 2026', tag: 'Feature', title: 'AI Workout Generator 2.0', desc: 'Now powered by Gemini — smarter, faster, more personalized plans than ever before.' },
          { date: 'Mar 2026', tag: 'New', title: 'Face Exercise Module', desc: 'Introducing targeted facial exercises for jawline, cheeks and neck — train every muscle.' },
          { date: 'Feb 2026', tag: 'Update', title: 'Calorie Calculator Upgraded', desc: 'More accurate TDEE calculations with macro breakdown and meal planning suggestions.' },
        ],
      },
      footer: {
        copy: '© 2026 FITMAX. All rights reserved.',
        tagline: 'Stay fit. Stay hard.',
      },
    },
    ru: {
      logout: 'Выйти',
      nav: { workouts: 'Тренировки', ai: 'AI Помощник', calculator: 'Калькулятор', face: 'Упр. для лица', profile: 'Профиль' },
      hero: { scroll: 'Прокрутите вниз' },
      about: {
        tag: 'О нас',
        title: 'Тренируйся умнее.\nЖиви сильнее.',
        desc: 'FITMAX — фитнес-платформа нового поколения, сочетающая AI-персонализацию с научными методами тренировок. Дома или в зале — мы создадим ваш идеальный план.',
        stat1: '10K+', label1: 'Активных участников',
        stat2: '500+', label2: 'Тренировок создано',
        stat3: '98%', label3: 'Довольных пользователей',
        cta: 'Начать тренироваться',
      },
      reviews: {
        tag: 'Отзывы',
        title: 'Что говорят наши участники',
        items: [
          { name: 'Арман К.', role: 'Участник с 2024', text: 'FITMAX полностью изменил мой подход к тренировкам. AI планы невероятно точные и адаптируются к моему расписанию.' },
          { name: 'Динара С.', role: 'Тренируется дома', text: 'Наконец платформа, которая реально работает для домашних тренировок. Минус 8 кг за 3 месяца.' },
          { name: 'Бекзат М.', role: 'Любитель зала', text: 'Калькулятор калорий и трекер тренировок — лучшее что я использовал. Рекомендую всем.' },
          { name: 'Асель Т.', role: 'Новичок', text: 'Боялась начинать, но FITMAX сделал всё простым. Планы для новичков идеальны, AI отвечает на всё.' },
        ],
      },
      updates: {
        tag: 'Обновления',
        title: 'Последнее от FITMAX',
        items: [
          { date: 'Апр 2026', tag: 'Функция', title: 'AI Генератор тренировок 2.0', desc: 'Теперь на базе Gemini — умнее, быстрее, более персональные планы.' },
          { date: 'Мар 2026', tag: 'Новое', title: 'Модуль упражнений для лица', desc: 'Целевые упражнения для скул, подбородка и шеи — тренируй каждую мышцу.' },
          { date: 'Фев 2026', tag: 'Обновление', title: 'Калькулятор калорий улучшен', desc: 'Более точный TDEE с разбивкой по макросам и рекомендациями по питанию.' },
        ],
      },
      footer: {
        copy: '© 2026 FITMAX. Все права защищены.',
        tagline: 'Оставайся в форме. Оставайся сильным.',
      },
    },
    kz: {
      logout: 'Шығу',
      nav: { workouts: 'Жаттығулар', ai: 'AI Көмекші', calculator: 'Калькулятор', face: 'Бет жаттығулары', profile: 'Профиль' },
      hero: { scroll: 'Төмен айналдырыңыз' },
      about: {
        tag: 'Біз туралы',
        title: 'Ақылды жаттық.\nКүшті өмір сүр.',
        desc: 'FITMAX — AI-персонализация мен ғылыми жаттығу әдістерін біріктіретін жаңа буын фитнес-платформасы. Үйде немесе спортзалда — біз сіздің мінсіз жоспарыңызды жасаймыз.',
        stat1: '10K+', label1: 'Белсенді мүшелер',
        stat2: '500+', label2: 'Жаттығу жасалды',
        stat3: '98%', label3: 'Қанағаттану деңгейі',
        cta: 'Жаттығуды бастау',
      },
      reviews: {
        tag: 'Пікірлер',
        title: 'Мүшелеріміз не дейді',
        items: [
          { name: 'Арман К.', role: '2024 жылдан мүше', text: 'FITMAX жаттығуға деген көзқарасымды толығымен өзгертті. AI жоспарлары керемет дәл.' },
          { name: 'Динара С.', role: 'Үйде жаттығады', text: 'Ақырында үй жаттығулары үшін нақты жұмыс істейтін платформа. 3 айда 8 кг жоғалттым.' },
          { name: 'Бекзат М.', role: 'Спортзал сүйері', text: 'Калория калькуляторы мен жаттығу трекері — мен пайдаланған ең жақсысы.' },
          { name: 'Әсел Т.', role: 'Жаңадан бастаушы', text: 'Бастаудан қорқтым, бірақ FITMAX бәрін оңай етті. Бастаушыларға арналған жоспарлар тамаша.' },
        ],
      },
      updates: {
        tag: 'Жаңартулар',
        title: 'FITMAX-тан соңғы жаңалықтар',
        items: [
          { date: 'Сәу 2026', tag: 'Мүмкіндік', title: 'AI Жаттығу Генераторы 2.0', desc: 'Енді Gemini негізінде — ақылды, жылдам, бұрынғыдан да жеке жоспарлар.' },
          { date: 'Нау 2026', tag: 'Жаңа', title: 'Бет жаттығулары модулі', desc: 'Жақ, бет және мойын үшін арнайы жаттығулар — әр бұлшықетті жатты.' },
          { date: 'Ақп 2026', tag: 'Жаңарту', title: 'Калория калькуляторы жаңартылды', desc: 'Макро бөлінісі бар дәлірек TDEE есептеулері.' },
        ],
      },
      footer: {
        copy: '© 2026 FITMAX. Барлық құқықтар қорғалған.',
        tagline: 'Формада қал. Күшті бол.',
      },
    },
  };

  get t() { return this.translations[this.currentLang]; }

  constructor(private langService: LanguageService, private router: Router) {
    this.langService.lang$.subscribe(lang => { this.currentLang = lang; });
  }

  ngOnInit() {
    this.startSlider();
  }

  ngOnDestroy() {
    if (this.slideInterval) clearInterval(this.slideInterval);
  }

  startSlider() {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 5000);
  }

  goToSlide(i: number) {
    this.currentSlide = i;
    clearInterval(this.slideInterval);
    this.startSlider();
  }

  changeLanguage(lang: Lang) { this.langService.setLang(lang); }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  scrollToAbout() {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }
}