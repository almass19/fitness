import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService, Lang } from '../../core/language';
import { ApiService } from '../../core/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  currentLang: Lang = 'en';

  firstName = '';
  lastName = '';
  birthDate = '';
  email = '';
  password = '';

  constructor(
    private langService: LanguageService,
    private api: ApiService,
    private router: Router
  ) {
    this.langService.lang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  translations = {
    en: {
      title: 'FITMAX SIGNUP',
      subtitle: 'One account, across all apps, just to make things a little easier.',
      firstName: 'First Name',
      lastName: 'Last Name',
      birthDate: 'Date Of Birth',
      email: 'Email address',
      password: 'Password',
      createAccount: 'CREATE ACCOUNT',
      haveAccount: 'Already have an account?',
      login: 'Log in',
    },
    ru: {
      title: 'РЕГИСТРАЦИЯ FITMAX',
      subtitle: 'Один аккаунт для всех приложений — так намного удобнее.',
      firstName: 'Имя',
      lastName: 'Фамилия',
      birthDate: 'Дата рождения',
      email: 'Электронная почта',
      password: 'Пароль',
      createAccount: 'СОЗДАТЬ АККАУНТ',
      haveAccount: 'Уже есть аккаунт?',
      login: 'Войти',
    },
    kz: {
      title: 'FITMAX ТІРКЕЛУ',
      subtitle: 'Барлық қосымшаларға бір аккаунт — осылай ыңғайлырақ.',
      firstName: 'Аты',
      lastName: 'Тегі',
      birthDate: 'Туған күні',
      email: 'Электрондық пошта',
      password: 'Құпиясөз',
      createAccount: 'АККАУНТ ҚҰРУ',
      haveAccount: 'Аккаунтыңыз бар ма?',
      login: 'Кіру',
    }
  };

  get texts() {
    return this.translations[this.currentLang];
  }

  changeLanguage(lang: Lang) {
    this.langService.setLang(lang);
  }

  onSubmit() {
    this.api.register({
      username: this.email,
      email: this.email,
      password: this.password,
      password2: this.password
    }).subscribe({
      next: (res) => {
        console.log('Register success:', res);
        alert('Account created!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log('Register error:', err);
        alert('Register failed');
      }
    });
  }
}