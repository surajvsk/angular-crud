import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './category.html',
  styleUrls: ['./category.css'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  
  categoryName: string = '';
  categories: any[] = [];
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private token: string = '';

ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    this.token = localStorage.getItem('token') || '';
    
    if (!this.token) {
      console.warn('Token not found, categories will load after login.');
      return;
    }

    this.fetchCategories();
  }
}

  ngOnDestroy() {
    // No subscriptions used here, polling removed
  }

  private getHeaders() {
    return { Authorization: `Bearer ${this.token}` };
  }

  addCategory() {
    if (!this.categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    const payload = { name: this.categoryName };

    this.http.post(`${environment.apiUrl}/category`, payload, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          this.categoryName = '';
          this.fetchCategories(); // refresh list immediately
        },
        error: (err) => console.error('Failed to add category', err)
      });
  }

  editCategory(category: any) {
    const newName = prompt('Enter new category name:', category.name);
    if (newName !== null && newName.trim() !== '') {
      const payload = { name: newName.trim() };

      this.http.put(`${environment.apiUrl}/category/${category.id}`, payload, { headers: this.getHeaders() })
        .subscribe({
          next: () => this.fetchCategories(),
          error: (err) => console.error('Failed to update category', err)
        });
    }
  }

  deleteCategory(categoryId: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.http.delete(`${environment.apiUrl}/category/${categoryId}`, { headers: this.getHeaders() })
        .subscribe({
          next: () => this.fetchCategories(),
          error: (err) => console.error('Failed to delete category', err)
        });
    }
  }

fetchCategories() {
  if (!this.token) return; // wait for token
  this.http.get<any[]>(`${environment.apiUrl}/category`, { headers: { Authorization: `Bearer ${this.token}` } })
    .subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error('Failed to fetch categories', err)
    });
}

  trackById(index: number, item: any) {
    return item.id;
  }
}
