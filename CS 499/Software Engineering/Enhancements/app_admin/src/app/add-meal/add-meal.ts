import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-add-meal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-meal.html',
  styleUrl: './add-meal.css'
})
export class AddMealComponent implements OnInit {
  addForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private api: TripDataService
  ) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      code: ['', Validators.required],
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
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addForm.invalid) return;

    const v = this.addForm.value;
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

    this.api.addMeal(payload).subscribe({
      next: () => this.router.navigate(['meals']),
      error: (err) => {
        console.error('Error adding meal', err);
        alert('Failed to add meal');
      }
    });
  }

  get f() { return this.addForm.controls; }
}
