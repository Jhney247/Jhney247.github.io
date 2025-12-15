import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-edit-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-room.html',
  styleUrl: './edit-room.css'
})
export class EditRoomComponent implements OnInit {
  editForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private api: TripDataService
  ) {}

  ngOnInit(): void {
    const roomCode = localStorage.getItem('roomId');
    if (!roomCode) {
      alert('Could not find room code!');
      this.router.navigate(['rooms']);
      return;
    }

    this.editForm = this.fb.group({
      code: [roomCode, Validators.required],
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

    this.api.getRoomByCode(roomCode).subscribe({
      next: (room) => {
        this.editForm.patchValue({
          name: room.name,
          type: room.type,
          beds: room.beds,
          maxOccupancy: room.maxOccupancy,
          pricePerNight: room.pricePerNight,
          image: room.image,
          description: room.description,
          amenitiesCsv: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
          available: !!room.available
        });
      },
      error: (err) => {
        console.error('Error loading room', err);
        alert('Failed to load room');
        this.router.navigate(['rooms']);
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

    this.api.updateRoom(v.code, payload).subscribe({
      next: () => {
        alert('Room updated successfully!');
        this.router.navigate(['rooms']);
      },
      error: (err) => {
        console.error('Error updating room', err);
        alert('Failed to update room');
      }
    });
  }

  get f() { return this.editForm.controls; }
}
