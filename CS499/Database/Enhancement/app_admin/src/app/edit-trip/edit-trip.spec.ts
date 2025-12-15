import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css'
})
export class EditTripComponent implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    let tripCode = localStorage.getItem("tripCode");
    if (!tripCode) {
      alert("Could not find trip code!");
      this.router.navigate(['']);
      return;
    }

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.tripDataService.getTripByCode(tripCode).subscribe({
      next: (value: any) => {
        // Handle if response is an array (as your backend returns)
        const tripData = Array.isArray(value) ? value[0] : value;
        this.trip = tripData;
        
        // Format the date for the date input if it exists
        if (tripData.start) {
          const date = new Date(tripData.start);
          tripData.start = date.toISOString().split('T')[0];
        }
        
        this.editForm.patchValue(tripData);
        console.log('Trip loaded for editing:', tripData);
      },
      error: (error: any) => {
        console.log('Error fetching trip:', error);
        alert('Failed to load trip data. Please try again.');
        this.router.navigate(['']);
      }
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.editForm.value.code, this.editForm.value).subscribe({
        next: (value: any) => {
          console.log('Trip updated:', value);
          alert('Trip updated successfully!');
          this.router.navigate(['']);
        },
        error: (error: any) => {
          console.log('Error updating trip:', error);
          alert('Failed to update trip. Please try again.');
        }
      });
    }
  }

  get f() { return this.editForm.controls; }
}