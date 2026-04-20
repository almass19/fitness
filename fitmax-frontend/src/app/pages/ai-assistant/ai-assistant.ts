import { Component, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LanguageService, Lang } from '../../core/language';
import { Navbar } from '../../shared/navbar/navbar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './ai-assistant.html',
  styleUrl: './ai-assistant.css',
})
export class AiAssistant implements AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  currentLang: Lang = 'en';
  messages: Message[] = [];
  input = '';
  loading = false;
  private shouldScroll = false;

  constructor(
    private http: HttpClient,
    private langService: LanguageService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.langService.lang$.subscribe(lang => this.currentLang = lang);
  }

  get t() { return this.translations[this.currentLang]; }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
      this.shouldScroll = false;
    }
  }

  sendMessage() {
    const text = this.input.trim();
    if (!text || this.loading) return;

    this.messages.push({ role: 'user', content: text });
    this.input = '';
    this.loading = true;
    this.shouldScroll = true;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post<{ reply: string }>('http://127.0.0.1:8000/api/chat/', {
      message: text,
      history: this.messages.slice(-10, -1),
    }, { headers }).subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.messages.push({ role: 'assistant', content: res.reply });
          this.loading = false;
          this.shouldScroll = true;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.messages.push({ role: 'assistant', content: this.t.error });
          this.loading = false;
          this.shouldScroll = true;
          this.cdr.detectChanges();
        });
      },
    });
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  translations = {
    en: {
      title: 'AI Fitness Assistant',
      subtitle: 'Ask me anything about workouts, nutrition, and healthy lifestyle',
      placeholder: 'Ask a question...',
      send: 'Send',
      thinking: 'Thinking...',
      error: 'Something went wrong. Please try again.',
      welcome: 'Hi! I\'m your personal fitness assistant. Ask me about workouts, nutrition, weight loss, or anything health-related!',
    },
    ru: {
      title: 'AI Фитнес-Ассистент',
      subtitle: 'Задайте любой вопрос о тренировках, питании и здоровом образе жизни',
      placeholder: 'Задайте вопрос...',
      send: 'Отправить',
      thinking: 'Думаю...',
      error: 'Что-то пошло не так. Попробуйте снова.',
      welcome: 'Привет! Я ваш персональный фитнес-ассистент. Спросите меня о тренировках, питании, похудении или здоровье!',
    },
    kz: {
      title: 'AI Фитнес Көмекшісі',
      subtitle: 'Жаттығу, тамақтану және сауықтыру туралы кез келген сұрақ қойыңыз',
      placeholder: 'Сұрақ қойыңыз...',
      send: 'Жіберу',
      thinking: 'Ойланып жатыр...',
      error: 'Қате орын алды. Қайта көріңіз.',
      welcome: 'Сәлем! Мен сіздің жеке фитнес көмекшіңізмін. Жаттығу, тамақтану немесе денсаулық туралы сұраңыз!',
    },
  };
}
