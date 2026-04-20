import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService, Lang } from '../../core/language';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class Navbar {
  currentLang: Lang = 'en';
  menuOpen = false;

  translations = {
    en: { workouts: 'Workouts', ai: 'AI Assistant', calculator: 'Calculator', face: 'Face Exercises', profile: 'Profile', logout: 'Logout' },
    ru: { workouts: 'Тренировки', ai: 'AI Помощник', calculator: 'Калькулятор', face: 'Упр. для лица', profile: 'Профиль', logout: 'Выйти' },
    kz: { workouts: 'Жаттығулар', ai: 'AI Көмекші', calculator: 'Калькулятор', face: 'Бет жаттығулары', profile: 'Профиль', logout: 'Шығу' },
  };

  get t() { return this.translations[this.currentLang]; }

  constructor(private router: Router, private langService: LanguageService) {
    this.langService.lang$.subscribe(lang => this.currentLang = lang);
  }

  setLang(lang: Lang) { this.langService.setLang(lang); }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
