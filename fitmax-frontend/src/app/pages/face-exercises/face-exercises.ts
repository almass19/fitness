import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Lang } from '../../core/language';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-face-exercises',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './face-exercises.html',
  styleUrl: './face-exercises.css',
})
export class FaceExercises {
  currentLang: Lang = 'en';

  constructor(private langService: LanguageService) {
    this.langService.lang$.subscribe(lang => this.currentLang = lang);
  }

  get t() { return this.translations[this.currentLang]; }

  translations = {
    en: {
      title: 'Face Exercises',
      subtitle: 'Targeted exercises for jawline, cheeks, and neck to tone every muscle',
      duration: 'Duration',
      reps: 'Reps',
      target: 'Target',
      howTo: 'How to do it',
      exercises: [
        { name: 'Jaw Release', target: 'Jawline', icon: '🦷', duration: '2 min', reps: '10 reps', description: 'Slowly open and close your mouth as wide as comfortable. Hold open position for 3 seconds. Strengthens jaw muscles and defines the jawline.' },
        { name: 'Cheek Puffing', target: 'Cheeks', icon: '💨', duration: '1 min', reps: '15 reps', description: 'Fill your cheeks with air, hold for 5 seconds, then slowly release. Alternate cheeks. Tones and lifts cheek muscles.' },
        { name: 'Fish Face', target: 'Cheeks', icon: '🐟', duration: '1 min', reps: '12 reps', description: 'Suck your cheeks inward to create a fish face. Hold for 5 seconds, relax and repeat. Reduces chubby cheeks and defines cheekbones.' },
        { name: 'Forehead Smoother', target: 'Forehead', icon: '✋', duration: '2 min', reps: '10 reps', description: 'Place both hands on your forehead and gently pull the skin down while raising your eyebrows. Smooths forehead lines.' },
        { name: 'Neck Tilt Stretch', target: 'Neck', icon: '🦒', duration: '2 min', reps: '10 each side', description: 'Tilt your head to one side, bringing your ear toward your shoulder. Hold for 10 seconds. Tones neck and reduces double chin.' },
        { name: 'Eye Squeeze', target: 'Eye area', icon: '👁️', duration: '1 min', reps: '15 reps', description: 'Close your eyes tightly, squeeze for 2 seconds, then open wide. Reduces crow\'s feet and lifts the eye area.' },
        { name: 'Chin Lift', target: 'Chin & Neck', icon: '⬆️', duration: '2 min', reps: '10 reps', description: 'Tilt your head back, look at the ceiling and pucker your lips as if kissing. Hold for 5 seconds. Eliminates double chin.' },
        { name: 'Smile Smoother', target: 'Mouth area', icon: '😊', duration: '1 min', reps: '10 reps', description: 'Hide your teeth with your lips and make an "O" shape. Smile widely while keeping teeth covered. Hold for 5 seconds.' },
      ],
    },
    ru: {
      title: 'Упражнения для лица',
      subtitle: 'Упражнения для скул, щёк и шеи для тонуса каждой мышцы',
      duration: 'Время',
      reps: 'Повторы',
      target: 'Зона',
      howTo: 'Как выполнять',
      exercises: [
        { name: 'Челюстной пресс', target: 'Линия челюсти', icon: '🦷', duration: '2 мин', reps: '10 повт.', description: 'Медленно открывайте и закрывайте рот как можно шире. Задержитесь в открытом положении на 3 секунды. Укрепляет мышцы челюсти.' },
        { name: 'Надуть щёки', target: 'Щёки', icon: '💨', duration: '1 мин', reps: '15 повт.', description: 'Наполните щёки воздухом, задержитесь на 5 секунд, медленно выдохните. Чередуйте щёки. Тонизирует и приподнимает скулы.' },
        { name: 'Рыбка', target: 'Щёки', icon: '🐟', duration: '1 мин', reps: '12 повт.', description: 'Втяните щёки внутрь, создав "рыбье лицо". Задержитесь на 5 секунд, расслабьтесь и повторите. Уменьшает пухлость щёк.' },
        { name: 'Разглаживание лба', target: 'Лоб', icon: '✋', duration: '2 мин', reps: '10 повт.', description: 'Положите ладони на лоб и мягко тяните кожу вниз, поднимая брови вверх. Разглаживает морщины на лбу.' },
        { name: 'Наклон шеи', target: 'Шея', icon: '🦒', duration: '2 мин', reps: '10 на каждую', description: 'Наклоните голову в сторону, приближая ухо к плечу. Задержитесь 10 секунд. Тонизирует шею, уменьшает второй подбородок.' },
        { name: 'Сжатие глаз', target: 'Область глаз', icon: '👁️', duration: '1 мин', reps: '15 повт.', description: 'Крепко закройте глаза на 2 секунды, затем широко откройте. Уменьшает морщины и подтягивает кожу вокруг глаз.' },
        { name: 'Подъём подбородка', target: 'Подбородок и шея', icon: '⬆️', duration: '2 мин', reps: '10 повт.', description: 'Запрокиньте голову назад, посмотрите в потолок и сложите губы трубочкой. Задержитесь 5 секунд. Убирает второй подбородок.' },
        { name: 'Улыбка', target: 'Область рта', icon: '😊', duration: '1 мин', reps: '10 повт.', description: 'Прикройте зубы губами и сделайте форму "О". Широко улыбнитесь, не открывая зубов. Задержитесь 5 секунд.' },
      ],
    },
    kz: {
      title: 'Бет жаттығулары',
      subtitle: 'Бет бұлшықеттерін тонустандыруға арналған жаттығулар',
      duration: 'Уақыт',
      reps: 'Қайталау',
      target: 'Аймақ',
      howTo: 'Қалай орындау',
      exercises: [
        { name: 'Жақ жаттығуы', target: 'Жақ сызығы', icon: '🦷', duration: '2 мин', reps: '10 рет', description: 'Аузыңызды мүмкіндігінше кең ашып, жабыңыз. Ашық күйде 3 секунд ұстаңыз. Жақ бұлшықеттерін нығайтады.' },
        { name: 'Бет үрлеу', target: 'Бет', icon: '💨', duration: '1 мин', reps: '15 рет', description: 'Беттеріңізді ауамен толтырып, 5 секунд ұстаңыз, баяу шығарыңыз. Беттерді кезекпен ауыстырыңыз.' },
        { name: 'Балық беті', target: 'Бет', icon: '🐟', duration: '1 мин', reps: '12 рет', description: 'Беттеріңізді ішке тартып, "балық бет" жасаңыз. 5 секунд ұстаңыз, босаңсып қайталаңыз.' },
        { name: 'Маңдай тегістеу', target: 'Маңдай', icon: '✋', duration: '2 мин', reps: '10 рет', description: 'Екі қолыңызды маңдайыңызға қойып, терісін төмен тартып, қабақтарыңызды жоғары көтеріңіз.' },
        { name: 'Мойын иілісі', target: 'Мойын', icon: '🦒', duration: '2 мин', reps: '10 рет', description: 'Басыңызды бір жаққа иіп, құлағыңызды иыққа жақындатыңыз. 10 секунд ұстаңыз.' },
        { name: 'Көз сығу', target: 'Көз аймағы', icon: '👁️', duration: '1 мин', reps: '15 рет', description: 'Көздеріңізді 2 секунд қатты жұмып, кейін кең ашыңыз. Бұрышты азайтады.' },
        { name: 'Иек көтеру', target: 'Иек пен мойын', icon: '⬆️', duration: '2 мин', reps: '10 рет', description: 'Басыңызды артқа тастап, төбеге қараңыз және ерніңізді сопайтыңыз. 5 секунд ұстаңыз.' },
        { name: 'Күлімсіреу', target: 'Ауыз аймағы', icon: '😊', duration: '1 мин', reps: '10 рет', description: 'Тістеріңізді жабыңыз және "О" пішін жасаңыз. Тістерді жаппай кеңінен күліңіз. 5 секунд ұстаңыз.' },
      ],
    },
  };
}
