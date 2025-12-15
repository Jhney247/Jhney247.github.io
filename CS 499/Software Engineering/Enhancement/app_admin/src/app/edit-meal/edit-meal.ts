import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-edit-meal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-meal.html',
  styleUrl: './edit-meal.css'
})
export class EditMealComponent implements OnInit {
  editForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private api: TripDataService
  ) {}

  ngOnInit(): void {
    const mealCode = localStorage.getItem('mealId');
    if (!mealCode) {
      alert('Could not find meal code!');
      this.router.navigate(['meals']);
      return;
    }

    this.editForm = this.fb.group({
      code: [mealCode, Validators.required],
      name: ['', Validators.required],
      cuisine: ['', Validators.required],
      mealType: ['', Validators.required],
      price: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
      allergensCsv: [''],
      vegetarian: [false],
      vegan: [false],
      glutenFree: [false],
      available: [true]
    });

    this.api.getMealByCode(mealCode).subscribe({
      next: (meal) => {
        this.editForm.patchValue({
          name: meal.name,
          cuisine: meal.cuisine,
          mealType: meal.mealType,
          price: meal.price,
          image: meal.image,
          description: meal.description,
          allergensCsv: Array.isArray(meal.allergens) ? meal.allergens.join(', ') : '',
          vegetarian: !!meal.vegetarian,
          vegan: !!meal.vegan,
          glutenFree: !!meal.glutenFree,
          available: !!meal.available
        });
      },
      error: (err) => {
        console.error('Error loading meal', err);
        alert('Failed to load meal');
        this.router.navigate(['meals']);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.editForm.invalid) return;

    const v = this.editForm.value;
    const payload = {
      code: v.code,
      name: v.name,
      cuisine: v.cuisine,
      mealType: v.mealType,
      price: v.price,
      image: v.image,
      description: v.description,
      allergens: (v.allergensCsv || '')
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0),
      vegetarian: !!v.vegetarian,
      vegan: !!v.vegan,
      glutenFree: !!v.glutenFree,
      available: !!v.available
    };

    this.api.updateMeal(v.code, payload).subscribe({
      next: () => {
        alert('Meal updated successfully!');
        this.router.navigate(['meals']);
      },
      error: (err) => {
        console.error('Error updating meal', err);
        alert('Failed to update meal');
      }
    });
  }

  get f() { return this.editForm.controls; }
}
