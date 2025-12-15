import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-edit-news',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-news.html',
  styleUrl: './edit-news.css'
})
export class EditNewsComponent implements OnInit {
  editForm!: FormGroup;
  submitted = false;

  categories = ['Travel Tips', 'Destination Guide', 'Company News', 'Special Offers', 'Events', 'General'];

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private api: TripDataService
  ) {}

  ngOnInit(): void {
    const newsCode = localStorage.getItem('newsId');
    if (!newsCode) {
      alert('Could not find news code!');
      this.router.navigate(['news']);
      return;
    }

    this.editForm = this.fb.group({
      code: [newsCode, Validators.required],
      title: ['', Validators.required],
      category: ['', Validators.required],
      author: ['', Validators.required],
      publishDate: ['', Validators.required],
      image: ['', Validators.required],
      summary: ['', [Validators.required, Validators.maxLength(500)]],
      content: ['', Validators.required],
      tagsCsv: [''],
      featured: [false],
      published: [true]
    });

    this.api.getNewsByCode(newsCode).subscribe({
      next: (n) => {
        const date = n.publishDate ? new Date(n.publishDate) : new Date();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const isoDate = `${yyyy}-${mm}-${dd}`;

        this.editForm.patchValue({
          title: n.title,
          category: n.category,
          author: n.author,
          publishDate: isoDate,
          image: n.image,
          summary: n.summary,
          content: n.content,
          tagsCsv: Array.isArray(n.tags) ? n.tags.join(', ') : '',
          featured: !!n.featured,
          published: !!n.published
        });
      },
      error: (err) => {
        console.error('Error loading news', err);
        alert('Failed to load news');
        this.router.navigate(['news']);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.editForm.invalid) return;

    const v = this.editForm.value;
    const payload = {
      code: v.code,
      title: v.title,
      category: v.category,
      author: v.author,
      publishDate: v.publishDate,
      image: v.image,
      summary: v.summary,
      content: v.content,
      tags: (v.tagsCsv || '')
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0),
      featured: !!v.featured,
      published: !!v.published
    };

    this.api.updateNews(v.code, payload).subscribe({
      next: () => {
        alert('News updated successfully!');
        this.router.navigate(['news']);
      },
      error: (err) => {
        console.error('Error updating news', err);
        alert('Failed to update news');
      }
    });
  }

  get f() { return this.editForm.controls; }
}
