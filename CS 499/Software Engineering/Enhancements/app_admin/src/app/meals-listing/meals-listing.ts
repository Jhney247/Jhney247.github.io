import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-meals-listing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meals-listing.html',
  styleUrls: ['./meals-listing.css']
})
export class MealsListingComponent implements OnInit {
  meals: any[] = [];

  constructor(
    private tripService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadMeals();
  }

  loadMeals(): void {
    this.tripService.getMeals().subscribe({
      next: (data: any[]) => {
        this.meals = data;
        console.log('Meals loaded:', data);
      },
      error: (err) => console.error('Error fetching meals:', err)
    });
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
