import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatCardModule, MatIconModule],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.css']
})
export class GalleryComponent {
  http = inject(HttpClient);
  
  selectedFiles: File[] = [];
  imagePreviews: string[] = []; // מערך להצגת התמונות על המסך!
  userRequest: string = '';
  isLoading = false;

  // כשבוחרים קבצים במחשב
  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    this.imagePreviews = [];

    // קסם שמציג את התמונות על המסך לפני ההעלאה
    for (let file of this.selectedFiles) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  // כשלוחצים "שלח לסינון"
  onUpload() {
    if (this.selectedFiles.length === 0) return;
    
    this.isLoading = true;
    const formData = new FormData();
    
    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('filterType', this.userRequest);

    // שליחה לשרת של ביתיה
    this.http.post('https://localhost:7071/api/Images/upload-set', formData)
      .subscribe({
        next: (response: any) => {
          console.log('Upload success!', response);
          this.isLoading = false;
          alert('בום! התמונות עברו סינון בהצלחה! קובץ ה-ZIP יורד עכשיו למחשב.');
          
          // הפקודה שמושכת את ה-ZIP עם התמונות המאושרות מהשרת:
          if (response && response.setId) {
            window.open(`https://localhost:7071/api/Images/${response.setId}/download`, '_blank');
          }
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.isLoading = false;
          alert('שגיאה! השרת כנראה חסם אותנו. ביתיה פתחה את ה-CORS?');
        }
      });
  }
}