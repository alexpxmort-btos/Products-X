import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService, Product } from './product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockApi = 'http://localhost:5199/api/Products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Garante que não há requisições pendentes
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve products via GET', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Produto A', price: 10, quantity: 5 },
      { id: 2, name: 'Produto B', price: 20, quantity: 8 },
    ];

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(mockApi);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should add a new product via POST', () => {
    const newProduct: Product = { name: 'Produto Novo', price: 15, quantity: 3 };
    const mockResponse = { ...newProduct, id: 99 };

    service.addProduct(newProduct).subscribe((res) => {
      expect(res.id).toBe(99);
      expect(res.name).toBe('Produto Novo');
    });

    const req = httpMock.expectOne(mockApi);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(mockResponse);
  });

  it('should update an existing product via PUT', () => {
    const updatedProduct: Product = { id: 1, name: 'Produto Editado', price: 30, quantity: 10 };

    service.updateProduct(updatedProduct).subscribe((res) => {
      expect(res).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${mockApi}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);
    req.flush(updatedProduct);
  });

it('should delete a product via DELETE', () => {
  const productId = 1;

  service.deleteProduct(productId).subscribe((res) => {
    expect(res).toBeNull(); // ✅ em vez de toBeUndefined()
  });

  const req = httpMock.expectOne(`${mockApi}/${productId}`);
  expect(req.request.method).toBe('DELETE');
  req.flush(null);
});

});
