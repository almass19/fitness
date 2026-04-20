import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService, Lang } from '../../core/language';
import { ApiService } from '../../core/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  currentLang: Lang = 'en';

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
      title: 'FITMAX',
      subtitle: 'Shop your styles, save top picks to your wishlist, track those orders & train with us.',
      email: 'Email address',
      password: 'Password',
      forgot: 'Forgot password?',
      login: 'LOG IN',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
    },
    ru: {
      title: 'FITMAX',
      subtitle: 'Сохраняйте любимое, следите за заказами и тренируйтесь вместе с нами.',
      email: 'Электронная почта',
      password: 'Пароль',
      forgot: 'Забыли пароль?',
      login: 'ВОЙТИ',
      noAccount: 'Нет аккаунта?',
      signUp: 'Зарегистрироваться',
    },
    kz: {
      title: 'FITMAX',
      subtitle: 'Ұнағандарыңызды сақтап, тапсырыстарды бақылап, бізбен бірге жаттығыңыз.',
      email: 'Электрондық пошта',
      password: 'Құпиясөз',
      forgot: 'Құпиясөзді ұмыттыңыз ба?',
      login: 'КІРУ',
      noAccount: 'Аккаунтыңыз жоқ па?',
      signUp: 'Тіркелу',
    }
  };

  get texts() {
    return this.translations[this.currentLang];
  }

  changeLanguage(lang: Lang) {
    this.langService.setLang(lang);
  }

  onSubmit() {
    this.api.login({
      username: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        console.log('Login success:', res);

        localStorage.setItem('token', res.token || res.access || '');

        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.log('Login error full:', err);
        console.log('Login error body:', err.error);
        alert(JSON.stringify(err.error));
      }
    });
  }
}