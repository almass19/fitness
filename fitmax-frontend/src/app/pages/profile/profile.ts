import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService, Lang } from '../../core/language';
import { ApiService } from '../../core/api';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, FormsModule, Navbar],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  currentLang: Lang = 'en';

  user: any = null;
  loading = true;
  saving = false;
  error = '';

  isEditing = false;

  firstName = '';
  lastName = '';
  email = '';
  username = '';

  constructor(
    private langService: LanguageService,
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.langService.lang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  translations = {
    en: {
      title: 'Profile',
      username: 'Username',
      email: 'Email',
      firstName: 'First Name',
      lastName: 'Last Name',
      loading: 'Loading...',
      logout: 'Logout',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      saving: 'Saving...',
      error: 'Failed to load profile',
      saveError: 'Failed to save profile',
    },
    ru: {
      title: 'Профиль',
      username: 'Имя пользователя',
      email: 'Почта',
      firstName: 'Имя',
      lastName: 'Фамилия',
      loading: 'Загрузка...',
      logout: 'Выйти',
      edit: 'Редактировать',
      save: 'Сохранить',
      cancel: 'Отмена',
      saving: 'Сохранение...',
      error: 'Не удалось загрузить профиль',
      saveError: 'Не удалось сохранить профиль',
    },
    kz: {
      title: 'Профиль',
      username: 'Пайдаланушы аты',
      email: 'Пошта',
      firstName: 'Аты',
      lastName: 'Тегі',
      loading: 'Жүктелуде...',
      logout: 'Шығу',
      edit: 'Өзгерту',
      save: 'Сақтау',
      cancel: 'Болдырмау',
      saving: 'Сақталуда...',
      error: 'Профильді жүктеу сәтсіз аяқталды',
      saveError: 'Профильді сақтау сәтсіз аяқталмады',
    }
  };

  get texts() {
    return this.translations[this.currentLang];
  }

  changeLanguage(lang: Lang) {
    this.langService.setLang(lang);
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.error = '';

    this.api.profile().subscribe({
      next: (res: any) => {
        this.user = res;
        this.username = res.username || '';
        this.firstName = res.first_name || '';
        this.lastName = res.last_name || '';
        this.email = res.email || '';
        this.loading = false;
        this.error = '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.error = this.texts.error;
        this.cdr.detectChanges();

        if (err.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  startEdit() {
    this.isEditing = true;
    this.username = this.user?.username || '';
    this.firstName = this.user?.first_name || '';
    this.lastName = this.user?.last_name || '';
    this.email = this.user?.email || '';
  }

  cancelEdit() {
    this.isEditing = false;
    this.username = this.user?.username || '';
    this.firstName = this.user?.first_name || '';
    this.lastName = this.user?.last_name || '';
    this.email = this.user?.email || '';
    this.error = '';
  }

  saveProfile() {
    this.saving = true;
    this.error = '';

    this.api.updateProfile({
      username: this.username,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email
    }).subscribe({
      next: (res: any) => {
        this.user = {
          ...this.user,
          username: res.username,
          first_name: res.first_name,
          last_name: res.last_name,
          email: res.email
        };

        this.saving = false;
        this.isEditing = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.saving = false;
        this.error = err?.error?.username?.[0] || this.texts.saveError;
        this.cdr.detectChanges();
      }
    });
  }

  get profileInitials(): string {
    const first = this.firstName?.trim()?.charAt(0) || '';
    const last = this.lastName?.trim()?.charAt(0) || '';
    const user = this.username?.trim()?.charAt(0) || '';

    const initials = (first + last).trim();

    return (initials || user || 'U').toUpperCase();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }


}