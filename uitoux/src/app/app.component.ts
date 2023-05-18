import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  products: Product[] = [];
  selectedTabIndex: number = 0;
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data.map((product) => {
        const starRating =
          product.reviews.reduce((sum, review) => sum + review.starRating, 0) /
          product.reviews.length;

        return { ...product, starRating };
      });
    });
  }
  getStarRange(rating: number): number[] {
    return Array(Math.floor(rating))
      .fill(0)
      .map((_, i) => i + 1);
  }

  getImageUrl(product: Product): string {
    // Assuming you have a property named 'image' in the Product model
    return `https://3vkuq8-3000.csb.app/${product.image}`;
  }
}
