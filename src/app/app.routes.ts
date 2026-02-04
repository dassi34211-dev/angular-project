import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in'; // וודאי שהנתיב פה נכון

export const routes: Routes = [
  { path: 'signin', component: SignInComponent },
  { path: '', redirectTo: 'signin', pathMatch: 'full' } // זה יפתח את העמוד ישר בהתחלה
];