import { Routes } from '@angular/router';

import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { Workouts } from './pages/workouts/workouts';
import { WorkoutDetails } from './pages/workout-details/workout-details';
import { Calculator } from './pages/calculator/calculator';
import { FaceExercises } from './pages/face-exercises/face-exercises';
import { AiAssistant } from './pages/ai-assistant/ai-assistant';
import { Profile } from './pages/profile/profile';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'workouts', component: Workouts, canActivate: [authGuard] },
  { path: 'workouts/:id', component: WorkoutDetails, canActivate: [authGuard] },
  { path: 'calculator', component: Calculator, canActivate: [authGuard] },
  { path: 'face-exercises', component: FaceExercises, canActivate: [authGuard] },
  { path: 'ai', component: AiAssistant, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },

  { path: '**', redirectTo: '' }
];