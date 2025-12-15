import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';

/**
 * Data Service for API communication
 * Handles all HTTP requests to the backend API
 */
@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private apiBaseUrl = 'http://localhost:3000/api/v1';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  // ==================== Trip Endpoints ====================

  getTrips(params?: { limit?: number; cursor?: string; q?: string }): Observable<any> {
    const query: any = {};
    if (params?.limit) query.limit = params.limit;
    if (params?.cursor) query.cursor = params.cursor;
    if (params?.q) query.q = params.q;
    return this.http.get<any>(`${this.apiBaseUrl}/trips`, { params: query });
  }

  getTripByCode(tripCode: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiBaseUrl}/trips/${tripCode}`);
  }

  addTrip(tripData: Trip): Observable<Trip> {
    return this.http.post<Trip>(`${this.apiBaseUrl}/trips`, tripData);
  }

  updateTrip(tripCode: string, tripData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiBaseUrl}/trips/${tripCode}`, tripData);
  }

  deleteTrip(tripCode: string): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/trips/${tripCode}`);
  }

  // ==================== Room Endpoints ====================

  getRooms(params?: { limit?: number; cursor?: string; q?: string; onlyAvailable?: boolean }): Observable<any> {
    const query: any = {};
    if (params?.limit) query.limit = params.limit;
    if (params?.cursor) query.cursor = params.cursor;
    if (params?.q) query.q = params.q;
    if (typeof params?.onlyAvailable === 'boolean') query.onlyAvailable = params.onlyAvailable;
    return this.http.get<any>(`${this.apiBaseUrl}/rooms`, { params: query });
  }

  getRoomByCode(roomCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/rooms/${roomCode}`);
  }

  addRoom(roomData: any): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/rooms`, roomData);
  }

  updateRoom(roomCode: string, roomData: any): Observable<any> {
    return this.http.put<any>(`${this.apiBaseUrl}/rooms/${roomCode}`, roomData);
  }

  deleteRoom(roomCode: string): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/rooms/${roomCode}`);
  }

  // ==================== Meal Endpoints ====================

  getMeals(params?: { limit?: number; cursor?: string; q?: string; onlyAvailable?: boolean; mealType?: string; cuisine?: string }): Observable<any> {
    const query: any = {};
    if (params?.limit) query.limit = params.limit;
    if (params?.cursor) query.cursor = params.cursor;
    if (params?.q) query.q = params.q;
    if (typeof params?.onlyAvailable === 'boolean') query.onlyAvailable = params.onlyAvailable;
    if (params?.mealType) query.mealType = params.mealType;
    if (params?.cuisine) query.cuisine = params.cuisine;
    return this.http.get<any>(`${this.apiBaseUrl}/meals`, { params: query });
  }

  getMealByCode(mealCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/meals/${mealCode}`);
  }

  addMeal(mealData: any): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/meals`, mealData);
  }

  updateMeal(mealCode: string, mealData: any): Observable<any> {
    return this.http.put<any>(`${this.apiBaseUrl}/meals/${mealCode}`, mealData);
  }

  deleteMeal(mealCode: string): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/meals/${mealCode}`);
  }

  // ==================== News Endpoints ====================

  getNews(params?: { limit?: number; cursor?: string; q?: string; category?: string; featured?: boolean; published?: boolean }): Observable<any> {
    const query: any = {};
    if (params?.limit) query.limit = params.limit;
    if (params?.cursor) query.cursor = params.cursor;
    if (params?.q) query.q = params.q;
    if (params?.category) query.category = params.category;
    if (typeof params?.featured === 'boolean') query.featured = params.featured;
    if (typeof params?.published === 'boolean') query.published = params.published;
    return this.http.get<any>(`${this.apiBaseUrl}/news`, { params: query });
  }

  getNewsByCode(newsCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/news/${newsCode}`);
  }

  addNews(newsData: any): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/news`, newsData);
  }

  updateNews(newsCode: string, newsData: any): Observable<any> {
    return this.http.put<any>(`${this.apiBaseUrl}/news/${newsCode}`, newsData);
  }

  deleteNews(newsCode: string): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/news/${newsCode}`);
  }

  // ==================== Analytics Endpoints ====================

  getTripsByResortAnalytics(params?: { startDate?: string; endDate?: string }): Observable<any> {
    const query: any = {};
    if (params?.startDate) query.startDate = params.startDate;
    if (params?.endDate) query.endDate = params.endDate;
    return this.http.get<any>(`${this.apiBaseUrl}/analytics/trips-by-resort`, { params: query });
  }

  getMealPriceStats(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/analytics/meal-price-stats`);
  }

  getRoomAvailabilityStats(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/analytics/room-availability`);
  }

  // ==================== Authentication Endpoints ====================

  login(email: string, passwd: string): Observable<AuthResponse> {
    const formData = {
      email: email,
      password: passwd
    };
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/login`, formData);
  }

  register(user: User, passwd: string): Observable<AuthResponse> {
    const formData = {
      name: user.name,
      email: user.email,
      password: passwd
    };
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/register`, formData);
  }
}