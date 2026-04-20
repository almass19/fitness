import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LanguageService, Lang } from '../../core/language';
import { WorkoutSession } from '../workouts/workouts';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-workout-details',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './workout-details.html',
  styleUrl: './workout-details.css',
})
export class WorkoutDetails implements OnInit {
  currentLang: Lang = 'en';
  session: WorkoutSession | null = null;

  translations = {
    en: {
      title: 'Workout Details',
      goal: 'Goal', location: 'Location', level: 'Level', bmi: 'BMI', weight: 'Weight', height: 'Height',
      home: 'Home', gym: 'Gym',
      planOverview: 'Plan Overview',
      exercises: 'Exercises',
      sets: 'Sets', reps: 'Reps', rest: 'Rest',
      back: '← Back',
      logout: 'Logout',
      noData: 'Workout not found.',
      goals: { weight_loss: '🔥 Weight Loss', muscle_gain: '💪 Muscle Gain', endurance: '🏃 Endurance', flexibility: '🧘 Flexibility' },
    },
    ru: {
      title: 'Детали тренировки',
      goal: 'Цель', location: 'Место', level: 'Уровень', bmi: 'ИМТ', weight: 'Вес', height: 'Рост',
      home: 'Дома', gym: 'В зале',
      planOverview: 'Обзор плана',
      exercises: 'Упражнения',
      sets: 'Подходы', reps: 'Повторы', rest: 'Отдых',
      back: '← Назад',
      logout: 'Выйти',
      noData: 'Тренировка не найдена.',
      goals: { weight_loss: '🔥 Похудение', muscle_gain: '💪 Набор мышц', endurance: '🏃 Выносливость', flexibility: '🧘 Гибкость' },
    },
    kz: {
      title: 'Жаттығу мәліметтері',
      goal: 'Мақсат', location: 'Орын', level: 'Деңгей', bmi: 'ДМИ', weight: 'Салмақ', height: 'Бой',
      home: 'Үйде', gym: 'Спортзалда',
      planOverview: 'Жоспар шолуы',
      exercises: 'Жаттығулар',
      sets: 'Қайталау', reps: 'Рет', rest: 'Демалыс',
      back: '← Артқа',
      logout: 'Шығу',
      noData: 'Жаттығу табылмады.',
      goals: { weight_loss: '🔥 Салмақ жою', muscle_gain: '💪 Бұлшықет жинау', endurance: '🏃 Төзімділік', flexibility: '🧘 Икемділік' },
    },
  };

  get t() { return this.translations[this.currentLang]; }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private langService: LanguageService
  ) {
    this.langService.lang$.subscribe(lang => { this.currentLang = lang; });
  }

  ngOnInit() {
    // Читаем id из URL параметра
    const id = this.route.snapshot.paramMap.get('id');

    // Сначала пробуем localStorage current (быстро, после redirect)
    try {
      const current = localStorage.getItem('fitmax_current_workout');
      if (current) {
        const parsed: WorkoutSession = JSON.parse(current);
        // Если id совпадает — используем его
        if (!id || parsed.id === id) {
          this.session = parsed;
          return;
        }
      }
    } catch {}

    // Иначе ищем в истории по id
    if (id) {
      try {
        const history: WorkoutSession[] = JSON.parse(
          localStorage.getItem('fitmax_workout_history') || '[]'
        );
        const found = history.find(s => s.id === id);
        if (found) {
          this.session = found;
          localStorage.setItem('fitmax_current_workout', JSON.stringify(found));
        }
      } catch {}
    }
  }

  formatDate(dateStr: string): string {
    const locale = this.currentLang === 'ru' ? 'ru-RU' : this.currentLang === 'kz' ? 'kk-KZ' : 'en-US';
    try {
      return new Date(dateStr).toLocaleDateString(locale, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  }

  levelLabel(level: string): string {
    const map: Record<string, Record<string, string>> = {
      en: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' },
      ru: { beginner: 'Начинающий', intermediate: 'Средний', advanced: 'Продвинутый' },
      kz: { beginner: 'Бастаушы', intermediate: 'Орташа', advanced: 'Жоғары' },
    };
    return map[this.currentLang]?.[level] || level;
  }

  get bmi(): string {
    if (!this.session) return '';
    const { weight, height } = this.session.userData;
    return (weight / ((height / 100) ** 2)).toFixed(1);
  }

  get goalLabel(): string {
    const g = this.session?.userData.goal || '';
    return (this.t.goals as Record<string, string>)[g] || g;
  }

  changeLanguage(lang: Lang) { this.langService.setLang(lang); }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  goBack() { this.router.navigate(['/workouts']); }
}