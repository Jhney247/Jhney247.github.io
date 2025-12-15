import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-add-news',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-news.html',
  styleUrl: './add-news.css'
})
export class AddNewsComponent implements OnInit {
  addForm!: FormGroup;
  submitted = false;

  categories = ['Travel Tips', 'Destination Guide', 'Company News', 'Special Offers', 'Events', 'General'];

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private api: TripDataService
  ) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      code: ['', Validators.required],
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
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addForm.invalid) return;

    const v = this.addForm.value;
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

    this.api.addNews(payload).subscribe({
      next: () => this.router.navigate(['news']),
      error: (err) => {
        console.error('Error adding news', err);
        alert('Failed to add news');
      }
    });
  }

  get f() { return this.addForm.controls; }
}
