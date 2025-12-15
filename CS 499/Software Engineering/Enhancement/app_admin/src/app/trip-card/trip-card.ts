import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

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

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  onEditTrip(): void {
    localStorage.setItem('tripCode', this.trip.code);
    this.router.navigate(['edit-trip']);
  }

  onDeleteTrip(): void {
    if (confirm(`Are you sure you want to delete "${this.trip.name}"?`)) {
      this.onDelete.emit(this.trip);
    }
  }

  public isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  public getImagePath(): string {
    if (!this.trip.image) {
      return 'assets/images/reef1.jpg';
    }
    // If image already starts with assets/, use as-is
    if (this.trip.image.startsWith('assets/')) {
      return this.trip.image;
    }
    // If image starts with images/, prepend assets/
    if (this.trip.image.startsWith('images/')) {
      return 'assets/' + this.trip.image;
    }
    // Otherwise, assume it's just a filename
    return 'assets/images/' + this.trip.image;
  }
}