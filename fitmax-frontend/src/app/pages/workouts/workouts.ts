import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LanguageService, Lang } from '../../core/language';
import { ApiService } from '../../core/api';
import { Navbar } from '../../shared/navbar/navbar';

export interface WorkoutSession {
  id: string;
  date: string;
  location: 'home' | 'gym';
  userData: UserData;
  exercises: Exercise[];
  summary: string;
}

export interface UserData {
  age: number;
  weight: number;
  height: number;
  goal: string;
  fitnessLevel: string;
  location: 'home' | 'gym';
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  description: string;
  muscleGroup: string;
}

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Navbar],
  templateUrl: './workouts.html',
  styleUrl: './workouts.css',
})
export class Workouts {
  currentLang: Lang = 'en';
  step: 'form' | 'loading' | 'result' = 'form';

  userData: UserData = {
    age: 25,
    weight: 70,
    height: 175,
    goal: 'weight_loss',
    fitnessLevel: 'beginner',
    location: 'home',
  };

  generatedExercises: Exercise[] = [];
  workoutSummary = '';
  error = '';

  private STORAGE_KEY = 'fitmax_workout_history';

  translations = {
    en: {
      title: 'AI Workout Generator',
      subtitle: "Enter your physical data and we'll create a personalized workout plan for you",
      age: 'Age', years: 'years',
      weight: 'Weight', kg: 'kg',
      height: 'Height', cm: 'cm',
      fitnessLevel: 'Fitness Level',
      beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced',
      goal: 'Your Goal',
      weightLoss: 'Weight Loss', muscleGain: 'Muscle Gain', endurance: 'Endurance', flexibility: 'Flexibility',
      whereTraining: 'Where will you train?',
      atHome: 'At Home', atGym: 'At the Gym',
      generate: '✨ Generate My Workout',
      generating: 'Creating your personalized workout...',
      generatingDesc: 'Our AI is analyzing your data and building the perfect plan',
      resultTitle: 'Your Workout Plan',
      newWorkout: '← New Workout',
      viewDetails: 'View Details →',
      previousWorkouts: 'Previous Workouts',
      home: 'Home', gym: 'Gym',
      exercises: 'exercises',
      sets: 'Sets', reps: 'Reps', rest: 'Rest',
      logout: 'Logout',
      errorMsg: 'Failed to generate workout. Make sure the Django server is running and ANTHROPIC_API_KEY is set.',
    },
    ru: {
      title: 'AI Генератор Тренировок',
      subtitle: 'Введите свои физические данные, и мы создадим персональный план тренировок',
      age: 'Возраст', years: 'лет',
      weight: 'Вес', kg: 'кг',
      height: 'Рост', cm: 'см',
      fitnessLevel: 'Уровень подготовки',
      beginner: 'Начинающий', intermediate: 'Средний', advanced: 'Продвинутый',
      goal: 'Ваша цель',
      weightLoss: 'Похудение', muscleGain: 'Набор мышц', endurance: 'Выносливость', flexibility: 'Гибкость',
      whereTraining: 'Где будете тренироваться?',
      atHome: 'Дома', atGym: 'В зале',
      generate: '✨ Создать тренировку',
      generating: 'Создаём вашу тренировку...',
      generatingDesc: 'AI анализирует ваши данные и создаёт идеальный план',
      resultTitle: 'Ваш план тренировок',
      newWorkout: '← Новая тренировка',
      viewDetails: 'Подробнее →',
      previousWorkouts: 'Предыдущие тренировки',
      home: 'Дома', gym: 'В зале',
      exercises: 'упражнений',
      sets: 'Подходы', reps: 'Повторы', rest: 'Отдых',
      logout: 'Выйти',
      errorMsg: 'Не удалось создать тренировку. Убедитесь что Django сервер запущен и задан ANTHROPIC_API_KEY.',
    },
    kz: {
      title: 'AI Жаттығу Генераторы',
      subtitle: 'Физикалық деректеріңізді енгізіңіз, біз жеке жаттығу жоспарын жасаймыз',
      age: 'Жас', years: 'жас',
      weight: 'Салмақ', kg: 'кг',
      height: 'Бой', cm: 'см',
      fitnessLevel: 'Дайындық деңгейі',
      beginner: 'Бастаушы', intermediate: 'Орташа', advanced: 'Жоғары',
      goal: 'Мақсатыңыз',
      weightLoss: 'Салмақ жою', muscleGain: 'Бұлшықет жинау', endurance: 'Төзімділік', flexibility: 'Икемділік',
      whereTraining: 'Қайда жаттығасыз?',
      atHome: 'Үйде', atGym: 'Спортзалда',
      generate: '✨ Жаттығу жасау',
      generating: 'Жеке жаттығуыңыз жасалуда...',
      generatingDesc: 'AI деректеріңізді талдап, тамаша жоспар жасауда',
      resultTitle: 'Сіздің жаттығу жоспарыңыз',
      newWorkout: '← Жаңа жаттығу',
      viewDetails: 'Толығырақ →',
      previousWorkouts: 'Бұрынғы жаттығулар',
      home: 'Үйде', gym: 'Спортзалда',
      exercises: 'жаттығу',
      sets: 'Қайталау', reps: 'Рет', rest: 'Демалыс',
      logout: 'Шығу',
      errorMsg: 'Жаттығу жасалмады. Django сервері іске қосылғанын тексеріңіз.',
    },
  };

  get t() { return this.translations[this.currentLang]; }

  constructor(
    private router: Router,
    private langService: LanguageService,
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.langService.lang$.subscribe(lang => { this.currentLang = lang; });
  }

  changeLanguage(lang: Lang) { this.langService.setLang(lang); }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  get workoutHistory(): WorkoutSession[] {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  generateWorkout() {
    this.step = 'loading';
    this.error = '';

    this.api.generateWorkout({
      age: this.userData.age,
      weight: this.userData.weight,
      height: this.userData.height,
      goal: this.userData.goal,
      fitnessLevel: this.userData.fitnessLevel,
      location: this.userData.location,
      language: this.currentLang,
    }).subscribe({
      next: (res: any) => {
        this.ngZone.run(() => {
          this.generatedExercises = res.exercises || [];
          this.workoutSummary = res.summary || '';
          this.saveToHistory();
          this.step = 'result';
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        this.ngZone.run(() => {
          console.error('Workout generation error:', err);
          this.error = err?.error?.error || this.t.errorMsg;
          this.step = 'form';
          this.cdr.detectChanges();
        });
      }
    });
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

  private saveToHistory() {
    const session: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      location: this.userData.location,
      userData: { ...this.userData },
      exercises: [...this.generatedExercises],
      summary: this.workoutSummary,
    };
    const history = this.workoutHistory;
    history.unshift(session);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
  }

  viewDetails(session: WorkoutSession) {
    localStorage.setItem('fitmax_current_workout', JSON.stringify(session));
    this.router.navigate(['/workouts', session.id]);
  }

  viewCurrentDetails() {
    const latest = this.workoutHistory[0];
    if (latest) {
      localStorage.setItem('fitmax_current_workout', JSON.stringify(latest));
      this.router.navigate(['/workouts', latest.id]);
    }
  }

  resetForm() {
    this.step = 'form';
    this.generatedExercises = [];
    this.workoutSummary = '';
    this.error = '';
  }

  deleteSession(id: string, event: Event) {
    event.stopPropagation();
    const history = this.workoutHistory.filter(s => s.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }
}