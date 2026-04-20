import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService, Lang } from '../../core/language';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator {
  currentLang: Lang = 'en';

  gender: 'male' | 'female' = 'male';
  age = 25;
  weight = 70;
  height = 175;
  activity: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' = 'moderate';
  goal: 'loss' | 'maintain' | 'gain' = 'maintain';

  result: { bmr: number; tdee: number; target: number; protein: number; carbs: number; fat: number } | null = null;

  constructor(private langService: LanguageService) {
    this.langService.lang$.subscribe(lang => this.currentLang = lang);
  }

  get t() { return this.translations[this.currentLang]; }

  calculate() {
    const bmr = this.gender === 'male'
      ? 10 * this.weight + 6.25 * this.height - 5 * this.age + 5
      : 10 * this.weight + 6.25 * this.height - 5 * this.age - 161;

    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const tdee = Math.round(bmr * multipliers[this.activity]);

    const adjustments = { loss: -500, maintain: 0, gain: 300 };
    const target = tdee + adjustments[this.goal];

    this.result = {
      bmr: Math.round(bmr),
      tdee,
      target,
      protein: Math.round((target * 0.30) / 4),
      carbs: Math.round((target * 0.45) / 4),
      fat: Math.round((target * 0.25) / 9),
    };
  }

  reset() { this.result = null; }

  translations = {
    en: {
      title: 'Calorie Calculator',
      subtitle: 'Calculate your daily calorie needs based on your body and goals',
      gender: 'Gender', male: 'Male', female: 'Female',
      age: 'Age', years: 'years',
      weight: 'Weight', kg: 'kg',
      height: 'Height', cm: 'cm',
      activity: 'Activity Level',
      sedentary: 'Sedentary (no exercise)',
      light: 'Light (1-3 days/week)',
      moderate: 'Moderate (3-5 days/week)',
      active: 'Active (6-7 days/week)',
      very_active: 'Very Active (twice/day)',
      goal: 'Your Goal',
      loss: 'Weight Loss', maintain: 'Maintain Weight', gain: 'Muscle Gain',
      calculate: 'Calculate',
      recalculate: 'Recalculate',
      bmr: 'Base Metabolic Rate',
      tdee: 'Total Daily Energy',
      target: 'Your Target',
      protein: 'Protein', carbs: 'Carbs', fat: 'Fat',
      grams: 'g / day',
      kcal: 'kcal / day',
      macros: 'Daily Macros',
    },
    ru: {
      title: 'Калькулятор калорий',
      subtitle: 'Рассчитайте суточную норму калорий исходя из вашего тела и целей',
      gender: 'Пол', male: 'Мужской', female: 'Женский',
      age: 'Возраст', years: 'лет',
      weight: 'Вес', kg: 'кг',
      height: 'Рост', cm: 'см',
      activity: 'Уровень активности',
      sedentary: 'Сидячий (без нагрузок)',
      light: 'Лёгкий (1-3 дня/нед)',
      moderate: 'Умеренный (3-5 дней/нед)',
      active: 'Активный (6-7 дней/нед)',
      very_active: 'Очень активный (2 раза/день)',
      goal: 'Ваша цель',
      loss: 'Похудение', maintain: 'Поддержание веса', gain: 'Набор мышц',
      calculate: 'Рассчитать',
      recalculate: 'Пересчитать',
      bmr: 'Базовый обмен веществ',
      tdee: 'Общий расход энергии',
      target: 'Ваша норма',
      protein: 'Белки', carbs: 'Углеводы', fat: 'Жиры',
      grams: 'г / день',
      kcal: 'ккал / день',
      macros: 'Суточные макросы',
    },
    kz: {
      title: 'Калория калькуляторы',
      subtitle: 'Дене бітімі мен мақсатыңызға сүйеніп күнделікті калорияны есептеңіз',
      gender: 'Жыныс', male: 'Ер', female: 'Әйел',
      age: 'Жас', years: 'жас',
      weight: 'Салмақ', kg: 'кг',
      height: 'Бой', cm: 'см',
      activity: 'Белсенділік деңгейі',
      sedentary: 'Отырықшы (жаттығусыз)',
      light: 'Жеңіл (аптасына 1-3 күн)',
      moderate: 'Орташа (аптасына 3-5 күн)',
      active: 'Белсенді (аптасына 6-7 күн)',
      very_active: 'Өте белсенді (күніне 2 рет)',
      goal: 'Мақсатыңыз',
      loss: 'Салмақ жою', maintain: 'Салмақ ұстау', gain: 'Бұлшықет жинау',
      calculate: 'Есептеу',
      recalculate: 'Қайта есептеу',
      bmr: 'Негізгі зат алмасу',
      tdee: 'Жалпы энергия шығыны',
      target: 'Сіздің нормаңыз',
      protein: 'Ақуыз', carbs: 'Көмірсу', fat: 'Май',
      grams: 'г / күн',
      kcal: 'ккал / күн',
      macros: 'Күнделікті макростар',
    },
  };
}
