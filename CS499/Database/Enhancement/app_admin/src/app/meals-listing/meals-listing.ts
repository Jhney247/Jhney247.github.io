import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-meals-listing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meals-listing.html',
  styleUrls: ['./meals-listing.css']
})
export class MealsListingComponent implements OnInit {
  meals: any[] = [];
  nextCursor?: string;
  hasMore = false;
  searchTerm = '';
  onlyAvailable = false;
  mealType = '';
  cuisine = '';

  constructor(
    private tripService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadMeals();
  }

  loadMeals(reset: boolean = true): void {
    const params: any = { limit: 12 };
    if (!reset && this.nextCursor) params.cursor = this.nextCursor;
    if (this.searchTerm) params.q = this.searchTerm;
    if (this.mealType) params.mealType = this.mealType;
    if (this.cuisine) params.cuisine = this.cuisine;
    params.onlyAvailable = this.onlyAvailable;

    this.tripService.getMeals(params).subscribe({
      next: (data: any) => {
        const items = data.items || [];
        this.meals = reset ? items : [...this.meals, ...items];
        this.hasMore = !!data.hasMore;
        this.nextCursor = data.nextCursor;
      },
      error: (err) => console.error('Error fetching meals:', err)
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.nextCursor = undefined;
    this.loadMeals(true);
  }

  updateFilters(): void {
    this.nextCursor = undefined;
    this.loadMeals(true);
  }

  loadMore(): void {
    if (this.hasMore) this.loadMeals(false);
  }

  addMeal(): void {
    this.router.navigate(['add-meal']);
  }

  editMeal(meal: any): void {
    localStorage.setItem('mealId', meal.code);
    this.router.navigate(['edit-meal']);
  }

  deleteMeal(meal: any): void {
    if (confirm(`Are you sure you want to delete "${meal.name}"?`)) {
      this.tripService.deleteMeal(meal.code).subscribe({
        next: () => {
          console.log('Meal deleted successfully');
          this.loadMeals();
        },
        error: (err) => {
          console.error('Error deleting meal:', err);
          alert('Failed to delete meal. Please try again.');
        }
      });
    }
  }

  public isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  getImagePath(image: string | undefined): string {
    if (!image) return 'assets/images/seafoods.jpg';
    if (image.startsWith('assets/')) return image;
    if (image.startsWith('images/')) return 'assets/' + image;
    return 'assets/images/' + image;
  }
}
