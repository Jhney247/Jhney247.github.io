import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-rooms-listing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rooms-listing.html',
  styleUrls: ['./rooms-listing.css']
})
export class RoomsListingComponent implements OnInit {
  rooms: any[] = [];
  nextCursor?: string;
  hasMore = false;
  searchTerm = '';
  onlyAvailable = false;

  constructor(
    private tripService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(reset: boolean = true): void {
    const params: any = { limit: 12 };
    if (!reset && this.nextCursor) params.cursor = this.nextCursor;
    if (this.searchTerm) params.q = this.searchTerm;
    params.onlyAvailable = this.onlyAvailable;

    this.tripService.getRooms(params).subscribe({
      next: (data: any) => {
        const items = data.items || [];
        this.rooms = reset ? items : [...this.rooms, ...items];
        this.hasMore = !!data.hasMore;
        this.nextCursor = data.nextCursor;
      },
      error: (err) => console.error('Error fetching rooms:', err)
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.nextCursor = undefined;
    this.loadRooms(true);
  }

  toggleAvailable(): void {
    this.onlyAvailable = !this.onlyAvailable;
    this.nextCursor = undefined;
    this.loadRooms(true);
  }

  loadMore(): void {
    if (this.hasMore) this.loadRooms(false);
  }

  addRoom(): void {
    this.router.navigate(['add-room']);
  }

  editRoom(room: any): void {
    localStorage.setItem('roomId', room.code);
    this.router.navigate(['edit-room']);
  }

  deleteRoom(room: any): void {
    if (confirm(`Are you sure you want to delete "${room.name}"?`)) {
      this.tripService.deleteRoom(room.code).subscribe({
        next: () => {
          console.log('Room deleted successfully');
          this.loadRooms();
        },
        error: (err) => {
          console.error('Error deleting room:', err);
          alert('Failed to delete room. Please try again.');
        }
      });
    }
  }

  public isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  getImagePath(image: string | undefined): string {
    if (!image) return 'assets/images/deluxe.jpg';
    if (image.startsWith('assets/')) return image;
    if (image.startsWith('images/')) return 'assets/' + image;
    return 'assets/images/' + image;
  }
}
