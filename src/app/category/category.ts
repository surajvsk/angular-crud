import { Component, inject, OnInit, OnDestroy, PLATFORM_ID, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './category.html',
  styleUrls: ['./category.css'],
})

export class CategoryComponent implements OnInit, OnDestroy {
  categoryName = '';
  categories: any[] = [];
  private platformId = inject(PLATFORM_ID);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private token = '';

ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    setTimeout(() => {
      this.zone.run(() => {
        this.token = localStorage.getItem('token') || '';
        if (this.token) this.fetchCategories();
      });
    });
  }
}

  ngOnDestroy() {}

  private getHeaders() {
    return { Authorization: `Bearer ${this.token}` };
  }

async fetchCategories() {
  if (!this.token) return;
  try {
    const res = await axios.get(`${environment.apiUrl}/category`, {
      headers: this.getHeaders(),
    });

    this.zone.run(() => {
      this.categories = res.data;
      console.log('Fetched categories:', this.categories);
      this.cdr.detectChanges(); //ensure UI updates instantly
    });
  } catch (err) {
    console.error('Failed to fetch categories', err);
  }
}

  async addCategory() {
    if (!this.categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      const payload = { name: this.categoryName };
      const res = await axios.post(`${environment.apiUrl}/category`, payload, {
        headers: this.getHeaders(),
      });

      this.zone.run(() => {
        this.categoryName = '';
        this.categories.push(res.data);
        this.cdr.detectChanges(); // ensure UI updates instantly
      });
    } catch (err) {
      console.error('Failed to add category', err);
    }
  }

  async editCategory(category: any) {
    const newName = prompt('Enter new category name:', category.name);
    if (!newName?.trim()) return;

    try {
      const payload = { name: newName.trim() };
      await axios.put(`${environment.apiUrl}/category/${category.id}`, payload, {
        headers: this.getHeaders(),
      });
      this.fetchCategories();
    } catch (err) {
      console.error('Failed to update category', err);
    }
  }

  async deleteCategory(categoryId: number) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`${environment.apiUrl}/category/${categoryId}`, {
        headers: this.getHeaders(),
      });
      this.fetchCategories();
    } catch (err) {
      console.error('Failed to delete category', err);
    }
  }

  trackById(index: number, item: any) {
    return item.id;
  }
}
