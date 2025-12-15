import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripCardComponent } from '../trip-card/trip-card';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.html',
  styleUrls: ['./trip-listing.css']
})
export class TripListingComponent implements OnInit {
  trips: any[] = [];

  constructor(
    private tripService: TripDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.tripService.getTrips().subscribe({
      next: (data: any[]) => {
        this.trips = data;
        console.log('Trips loaded:', data);
      },
      error: (err) => console.error('Error fetching trips:', err)
    });
  }

  addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  editTrip(trip: any): void {
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  deleteTrip(trip: any): void {
    this.tripService.deleteTrip(trip.code).subscribe({
      next: () => {
        console.log('Trip deleted successfully');
        this.loadTrips(); // Reload the trips list
      },
      error: (err) => {
        console.error('Error deleting trip:', err);
        alert('Failed to delete trip. Please try again.');
      }
    });
  }
}