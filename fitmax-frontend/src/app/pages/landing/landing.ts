import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService, Lang } from '../../core/language';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  currentLang: Lang = 'en';

  constructor(private langService: LanguageService) {
    this.langService.lang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  translations = {
    en: {
      home: 'HOME',
      workouts: 'WORKOUTS',
      aiAssistant: 'AI ASSISTANT',
      login: 'LOGIN',
      stayFit: 'STAY FIT',
      getStarted: 'GET STARTED',
    },
    ru: {
      home: 'ГЛАВНАЯ',
      workouts: 'ТРЕНИРОВКИ',
      aiAssistant: 'AI АССИСТЕНТ',
      login: 'ВОЙТИ',
      stayFit: 'БУДЬ В ФОРМЕ',
      getStarted: 'НАЧАТЬ',
    },
    kz: {
      home: 'БАСТЫ БЕТ',
      workouts: 'ЖАТТЫҒУЛАР',
      aiAssistant: 'AI КӨМЕКШІ',
      login: 'КІРУ',
      stayFit: 'ФОРМАДА БОЛ',
      getStarted: 'БАСТАУ',
    }
  };

  get texts() {
    return this.translations[this.currentLang];
  }

  changeLanguage(lang: Lang) {
    this.langService.setLang(lang);
  }
}