import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-sign-in',
  standalone: true, // הגדרה כרכיב עצמאי
  imports: [CommonModule, ReactiveFormsModule,CommonModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule], // ייבוא המודולים ישירות לכאן
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css']

})
export class SignInComponent {
  hide=true;
  signInForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // פונקציית עזר לקיצור הגישה לשדות
  get f() { return this.signInForm.controls; }

  onSignIn() {
    if (this.signInForm.valid) {
      console.log('נתוני התחברות:', this.signInForm.value);
    }
  }
}