import { Component } from '@angular/core';
import { Product } from '../../services/product';
import { ProductService } from '../../services/product';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from '../product-form/product-form';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
    imports: [CommonModule, ProductFormComponent,FormsModule,MatIconModule  ],

})
export class ProductListComponent {
  products: Product[] = [];
  showForm = false;
  selectedProduct?: Product;
  searchTerm = '';

    showDeleteModal = false;
  productToDelete?: Product;

  constructor(private service: ProductService) {
    this.loadProducts();
  }

  loadProducts() {
    this.service.getProducts().subscribe(data => this.products = data);
  }

  openForm() {
    this.selectedProduct = undefined;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  editProduct(p: Product) {
    this.selectedProduct = p;
    this.showForm = true;
  }

  confirmDelete(product: Product) {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.productToDelete = undefined;
  }

    deleteProductConfirmed() {
    if (this.productToDelete) {
      this.products = this.products.filter(p => p.id !== this.productToDelete!.id);
      this.showDeleteModal = false;
      this.productToDelete = undefined;
    }
  }

  onSaved() {
    this.loadProducts();
    this.closeForm();
  }

  filteredProducts(): Product[] {
    if (!this.searchTerm) return this.products;
    return this.products.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
