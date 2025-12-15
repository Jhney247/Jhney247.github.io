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

  constructor(
    private tripService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.tripService.getRooms().subscribe({
      next: (data: any[]) => {
        this.rooms = data;
        console.log('Rooms loaded:', data);
      },
      error: (err) => console.error('Error fetching rooms:', err)
    });
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
