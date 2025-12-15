import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent implements OnInit {
  startDate = '';
  endDate = '';

  tripsByResort: any[] = [];
  mealPriceStats: any[] = [];
  roomAvailabilityStats: any[] = [];

  loading = false;

  constructor(private api: TripDataService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    Promise.all([
      this.api.getTripsByResortAnalytics({ startDate: this.startDate, endDate: this.endDate }).toPromise(),
      this.api.getMealPriceStats().toPromise(),
      this.api.getRoomAvailabilityStats().toPromise()
    ])
      .then(([tripsRes, mealRes, roomRes]) => {
        this.tripsByResort = tripsRes?.items || [];
        this.mealPriceStats = mealRes?.items || [];
        this.roomAvailabilityStats = roomRes?.items || [];
      })
      .finally(() => (this.loading = false));
  }
}
