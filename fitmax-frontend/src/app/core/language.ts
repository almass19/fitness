import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'en' | 'ru' | 'kz';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private langSubject = new BehaviorSubject<Lang>('en');
  lang$ = this.langSubject.asObservable();

  setLang(lang: Lang) {
    this.langSubject.next(lang);
    localStorage.setItem('lang', lang);
  }

  getLang(): Lang {
    return this.langSubject.value;
  }

  loadLang() {
    const saved = localStorage.getItem('lang') as Lang;
    if (saved) {
      this.langSubject.next(saved);
    }
  }
}