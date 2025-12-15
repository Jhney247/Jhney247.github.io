import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css'
})
export class TripCardComponent {
  @Input() trip: any;
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  constructor(private router: Router) {}

  onEditTrip(): void {
    // Store the trip code in localStorage for the edit component to use
    localStorage.setItem('tripCode', this.trip.code);
    this.router.navigate(['edit-trip']);
  }

  onDeleteTrip(): void {
    if (confirm(`Are you sure you want to delete "${this.trip.name}"?`)) {
      this.onDelete.emit(this.trip);
    }
  }
}