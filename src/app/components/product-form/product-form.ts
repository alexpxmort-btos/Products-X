import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../services/product';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { IMaskModule } from 'angular-imask';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,IMaskModule],
  templateUrl: './product-form.html'
})export class ProductFormComponent implements OnChanges {
  @Input() product?: Product;
  @Output() saved = new EventEmitter<void>();

  form: FormGroup;
  loading = false;

  public numberMask = Number;

  constructor(private fb: FormBuilder, private service: ProductService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
    });
  }

ngOnChanges() {
  if (this.product) {
    this.form.patchValue({
      ...this.product,
      price: this.product.price != null ? String(this.product.price) : ''
    });
  }
}
onSubmit() {
  if (this.form.invalid) return;
  this.loading = true;

  // pegar valor do form
  const formValue = this.form.value;

  const priceValue = formValue.price;

  const data = {
    ...formValue,
    price: priceValue,
    id: this.product?.id
  };

  const request = this.product?.id
    ? this.service.updateProduct(data)
    : this.service.addProduct(data);

  request.pipe(
    catchError(err => {
      console.error(err);
      this.loading = false;
      return of(null);
    })
  ).subscribe(() => {
    this.loading = false;
    this.form.reset()
    this.saved.emit();
  });
}

}
