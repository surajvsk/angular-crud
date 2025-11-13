import { Component, inject, OnInit, OnDestroy, PLATFORM_ID, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import axios from 'axios';
import { environment } from '../../environments/environment';

// import boostrap modules if needed
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})

export class DashboardComponent {
  products: any[] = [];
  private platformId = inject(PLATFORM_ID);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private token = '';

  productName = '';
  productPrice: number | null = null;
  categoryUniqueId = '';
  selectedImage: File | null = null;


    currentPage = 1;
    pageSize = 5;
    searchTerm = '';
    totalPages = 0;


ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    setTimeout(() => {
      this.zone.run(() => {
        this.token = localStorage.getItem('token') || '';
        if (this.token) this.fetchProducts();
      });
    });
  }
}

  ngOnDestroy() {}

  private getHeaders() {
    return { Authorization: `Bearer ${this.token}` };
  }


  onFileSelected(event: any) {
  this.selectedImage = event.target.files?.[0] || null;
}

async addProduct() {
  if (!this.productName.trim() || !this.productPrice || !this.categoryUniqueId.trim()) {
    alert('Please fill in all product fields');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('name', this.productName);
    formData.append('price', this.productPrice.toString());
    formData.append('categoryUniqueId', this.categoryUniqueId);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    const res = await axios.post(`${environment.apiUrl}/products`, formData, {
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'multipart/form-data'
      },
    });

    alert('Product added successfully!');
    console.log('Response:', res.data);

    // Optional: clear form
    this.productName = '';
    this.productPrice = null;
    this.categoryUniqueId = '';
    this.selectedImage = null;

    // Refresh list
    this.fetchProducts();
  } catch (err: any) {
    console.error('Failed to add product', err);
    alert('Failed to add product: ' + (err.response?.data?.error || err.message));
  }
}

  async editCategory(category: any) {
    const newName = prompt('Enter new category name:', category.name);
    if (!newName?.trim()) return;

    try {
      const payload = { name: newName.trim() };
      await axios.put(`${environment.apiUrl}/products/${category.id}`, payload, {
        headers: this.getHeaders(),
      });
      this.fetchProducts();
    } catch (err) {
      console.error('Failed to update category', err);
    }
  }

async deleteCategory(productId: number) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    await axios.delete(`${environment.apiUrl}/products/${productId}`, {
      headers: this.getHeaders(),
    });

    // Remove item instantly from local list
    this.zone.run(() => {
      this.products = this.products.filter(p => p.id !== productId);
      this.cdr.detectChanges();
    });

    // Re-fetch current page (to ensure pagination consistency)
    setTimeout(() => this.fetchProducts(), 300);

    alert('Product deleted successfully!');
  } catch (err) {
    console.error('Failed to delete product', err);
    alert('Failed to delete product');
  }
}

  trackById(index: number, item: any) {
    return item.id;
  }

async fetchProducts() {
  if (!this.token) return;
  try {
    const params = new URLSearchParams({
      page: this.currentPage.toString(),
      limit: this.pageSize.toString(),
      search: this.searchTerm.trim(),
    });

    const res = await axios.get(`${environment.apiUrl}/products?${params}`, {
      headers: this.getHeaders(),
    });

    this.zone.run(() => {
      this.products = res.data.data || [];
      const meta = res.data.meta || {};
      this.currentPage = meta.page || 1;
      this.totalPages = meta.pages || 1;
      this.cdr.detectChanges();
    });
  } catch (err) {
    console.error('Failed to fetch products', err);
  }
}

changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.fetchProducts();
  }
}

onSearchChange() {
  this.currentPage = 1;
  this.fetchProducts();
}


get paginatedProducts() {
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  return this.products.slice(start, end);
}

}