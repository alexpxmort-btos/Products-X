import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
    private api = `${environment.apiUrl}/api/Products`;

  constructor(private http: HttpClient) {}

 getProducts(): Observable<Product[]> {
    return this.http.get<{ data: Product[] }>(this.api).pipe(
      map(response => response.data)
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.api, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.api}/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
