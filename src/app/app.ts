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
  filteredPhotos: any[] = []; 

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    this.imagePreviews = [];

    for (let file of this.selectedFiles) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  onUpload() {
    if (this.selectedFiles.length === 0) return;
    
    this.isLoading = true;
    const formData = new FormData();
    this.selectedFiles.forEach(file => formData.append('files', file));
    formData.append('filterType', this.userRequest);

    // פונים לשרת ומעלים את התמונות
    this.http.post('https://localhost:7071/api/Images/upload-set', formData)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('Results from server:', response);
          
          // מורידים את הקובץ ישירות באותו חלון, כדי שהדפדפן לא יחסום את ההורדה
          if (response && response.setId) {
            window.location.href = `https://localhost:7071/api/Images/${response.setId}/download`;
          }

          // ההודעה קופצת חצי שנייה אחרי שההורדה התחילה כדי לא לתקוע אותה
          setTimeout(() => alert('בום! התמונות עברו סינון בהצלחה! קובץ ה-ZIP אמור לרדת כעת.'), 500);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error:', err);
          alert('שגיאה בשליפת התוצאות מול השרת.');
        }
      });
  }
}