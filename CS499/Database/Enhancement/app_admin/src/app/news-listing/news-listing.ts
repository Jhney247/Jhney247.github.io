import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-news-listing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './news-listing.html',
  styleUrls: ['./news-listing.css']
})
export class NewsListingComponent implements OnInit {
  news: any[] = [];
  nextCursor?: string;
  hasMore = false;
  searchTerm = '';
  category = '';
  featured?: boolean;
  published: boolean = true;

  constructor(
    private tripService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(reset: boolean = true): void {
    const params: any = { limit: 10 };
    if (!reset && this.nextCursor) params.cursor = this.nextCursor;
    if (this.searchTerm) params.q = this.searchTerm;
    if (this.category) params.category = this.category;
    if (typeof this.featured === 'boolean') params.featured = this.featured;
    params.published = this.published;

    this.tripService.getNews(params).subscribe({
      next: (data: any) => {
        const items = data.items || [];
        this.news = reset ? items : [...this.news, ...items];
        this.hasMore = !!data.hasMore;
        this.nextCursor = data.nextCursor;
      },
      error: (err) => console.error('Error fetching news:', err)
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.nextCursor = undefined;
    this.loadNews(true);
  }

  updateFilters(): void {
    this.nextCursor = undefined;
    this.loadNews(true);
  }

  loadMore(): void {
    if (this.hasMore) this.loadNews(false);
  }

  addNews(): void {
    this.router.navigate(['add-news']);
  }

  editNews(newsItem: any): void {
    localStorage.setItem('newsId', newsItem.code);
    this.router.navigate(['edit-news']);
  }

  deleteNews(newsItem: any): void {
    if (confirm(`Are you sure you want to delete "${newsItem.title}"?`)) {
      this.tripService.deleteNews(newsItem.code).subscribe({
        next: () => {
          console.log('News deleted successfully');
          this.loadNews();
        },
        error: (err) => {
          console.error('Error deleting news:', err);
          alert('Failed to delete news. Please try again.');
        }
      });
    }
  }

  public isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  getImagePath(image: string | undefined): string {
    if (!image) return 'assets/images/reef2.jpg';
    if (image.startsWith('assets/')) return image;
    if (image.startsWith('images/')) return 'assets/' + image;
    return 'assets/images/' + image;
  }
}
