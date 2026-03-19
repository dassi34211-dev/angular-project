import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  http = inject(HttpClient);
  
  selectedFiles: File[] = [];
  imagePreviews: string[] = []; 
  userRequest: string = '';
  isLoading = false;

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    this.imagePreviews = [];

    for (let file of this.selectedFiles) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
      reader.readAsDataURL(file);
    }
  }

// תוסיפי את המשתנה הזה למעלה בתוך ה-class App
filteredPhotos: any[] = []; 

onUpload() {
  if (this.selectedFiles.length === 0) return;
  
  this.isLoading = true;
  const formData = new FormData();
  this.selectedFiles.forEach(file => formData.append('files', file));
  formData.append('filterType', this.userRequest);

  // שימי לב: אנחנו פונים לשרת ומחכים לתוצאה המפורטת
  this.http.post('https://localhost:7071/api/Images/upload-set', formData)
    .subscribe({
      next: (response: any) => {
        this.isLoading = false;
        // כאן הקסם: אנחנו שומרים את רשימת התמונות שהשרת עיבד
        // (בהנחה שביתיה מחזירה את האובייקט עם התמונות)
        this.filteredPhotos = response.photos || []; 
        console.log('Results from server:', response);
      },
      error: (err) => {
        this.isLoading = false;
        alert('שגיאה בשליפת התוצאות');
      }
    });
}
}