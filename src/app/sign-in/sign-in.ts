import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css']
})
export class SignInComponent {
  authForm: FormGroup;
  hide = true; 
  isLoginMode = true; // true = אנחנו במסך התחברות, false = אנחנו במסך הרשמה!
  isLoading = false;

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({
      fullName: [''], // שדה שם שיופיע רק בהרשמה
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.authForm.controls; }

  // פונקציה שמחליפה בין התחברות להרשמה בלחיצת כפתור
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  // הפונקציה שבאמת שולחת את הנתונים לשרת!
  onSubmit() {
    if (this.authForm.invalid) return;

    this.isLoading = true;
    const formData = this.authForm.value;

    // מחליטים לאיזו כתובת לפנות בשרת של ביתיה (התחברות או הרשמה)
    // הערה: תצטרכו לוודא שזה תואם לשמות שביתיה נתנה ב-Controllers שלה
    const url = this.isLoginMode 
      ? 'https://localhost:7071/api/Auth/login' 
      : 'https://localhost:7071/api/Auth/register';

    this.http.post(url, formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        // אם ביתיה שלחה לנו "מפתח אבטחה" (Token), נשמור אותו בדפדפן
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
        
        console.log('הפעולה הצליחה! עוברים לגלריה...');
        // המעבר עצמו!
        this.router.navigate(['/gallery']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('שגיאה בשרת:', err);
        alert('אופס, משהו השתבש! אולי האימייל כבר קיים או שהסיסמה שגויה? (או שה-CORS של ביתיה עוד סגור)');
      }
    });
  }
}