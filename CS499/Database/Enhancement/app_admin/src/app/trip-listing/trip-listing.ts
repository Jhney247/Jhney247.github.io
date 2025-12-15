import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripCardComponent } from '../trip-card/trip-card';
import { TripDataService } from '../services/trip-data.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.html',
  styleUrls: ['./trip-listing.css']
})
export class TripListingComponent implements OnInit {
  trips: any[] = [];
  nextCursor?: string;
  hasMore = false;
  searchTerm = '';

  constructor(
    private tripService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(reset: boolean = true): void {
    const params: any = { limit: 12 };
    if (!reset && this.nextCursor) params.cursor = this.nextCursor;
    if (this.searchTerm) params.q = this.searchTerm;

    this.tripService.getTrips(params).subscribe({
      next: (data: any) => {
        const items = data.items || [];
        this.trips = reset ? items : [...this.trips, ...items];
        this.hasMore = !!data.hasMore;
        this.nextCursor = data.nextCursor;
      },
      error: (err) => console.error('Error fetching trips:', err)
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.nextCursor = undefined;
    this.loadTrips(true);
  }

  loadMore(): void {
    if (this.hasMore) this.loadTrips(false);
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
        this.loadTrips();
      },
      error: (err) => {
        console.error('Error deleting trip:', err);
        alert('Failed to delete trip. Please try again.');
      }
    });
  }

  public isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }
}