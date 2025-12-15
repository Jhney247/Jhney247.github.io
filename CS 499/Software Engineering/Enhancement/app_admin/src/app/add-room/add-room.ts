import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-room.html',
  styleUrl: './add-room.css'
})
export class AddRoomComponent implements OnInit {
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
      type: ['', Validators.required],
      beds: [1, [Validators.required]],
      maxOccupancy: [1, [Validators.required]],
      pricePerNight: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
      amenitiesCsv: [''],
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
      type: v.type,
      beds: Number(v.beds),
      maxOccupancy: Number(v.maxOccupancy),
      pricePerNight: v.pricePerNight,
      image: v.image,
      description: v.description,
      amenities: (v.amenitiesCsv || '')
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0),
      available: !!v.available
    };

    this.api.addRoom(payload).subscribe({
      next: () => this.router.navigate(['rooms']),
      error: (err) => {
        console.error('Error adding room', err);
        alert('Failed to add room');
      }
    });
  }

  get f() { return this.addForm.controls; }
}
