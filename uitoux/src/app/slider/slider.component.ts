import {
    Component,
    ViewChild,
    ElementRef,
    AfterViewInit,
    OnInit,
  } from '@angular/core';
  import { ProductService } from '../product.service';
  
  @Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.css'],
  })
  export class SliderComponent implements OnInit {
    @ViewChild('slider', { static: false }) slider: ElementRef | undefined;
    products: any[] = [];
  
    constructor(private productService: ProductService) {}
  
    ngOnInit() {
      this.productService.getAllProducts().subscribe((data) => {
        this.products = this.transformData(data);
        this.initSlider();
      });
    }
  
    getStarRange(rating: number): number[] {
      const totalStars = 5;
      const roundedRating = Math.round(rating);
      const filledStars = Math.min(roundedRating, totalStars);
      const unfilledStars = totalStars - filledStars;
  
      return Array(filledStars)
        .fill(0)
        .map((_, i) => i + 1)
        .concat(
          Array(unfilledStars)
            .fill(0)
            .map((_, i) => i + filledStars + 1)
        );
    }
    transformData(data: any[]): any[] {
      return data.map((product) => {
        const starRating =
          product.reviews.reduce(
            (sum: number, review: any) => sum + review.starRating,
            0
          ) / product.reviews.length;
  
        return {
          ...product,
          starRating: Math.round(starRating),
          image: `https://3vkuq8-3000.csb.app/${product.image}`,
        };
      });
    }
  
    initSlider() {
      const sliderElement = this.slider?.nativeElement;
  
      if (sliderElement && this.products.length > 0) {
        let currentIndex = 0;
        const maxIndex = this.products.length - 1;
  
        setInterval(() => {
          currentIndex = (currentIndex + 1) % (maxIndex + 1);
  
          sliderElement.style.transform = `translateX(-${currentIndex * 100}%)`;
        }, 15000);
      }
    }
  }
  