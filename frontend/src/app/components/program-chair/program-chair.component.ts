import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramChairService } from '../../services/program-chair.service';
import { ProgramChair } from '../../models/program-chair.model';
import { HttpErrorResponse } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-program-chair',
  templateUrl: './program-chair.component.html',
  styleUrls: ['./program-chair.component.css'],
  standalone: false,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProgramChairComponent implements OnInit {
  chairForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  private chairId?: number;
  focusedField: string = '';

  constructor(
    private fb: FormBuilder,
    private programChairService: ProgramChairService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.chairForm = this.fb.group({
      name: ['', Validators.required],
      email_id: ['', [Validators.required, Validators.email]],
      affiliation: ['', Validators.required],
      expertise_area: ['', Validators.required],
      phone_no: ['', Validators.required],
      conference_id: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.chairId = +id;
      this.loadProgramChair(this.chairId);
    }
  }

  loadProgramChair(id: number): void {
    this.programChairService.getProgramChairById(id).subscribe({
      next: (chair: ProgramChair) => {
        this.chairForm.patchValue(chair);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading program chair:', error);
        this.router.navigate(['/program-chairs']);
      }
    });
  }

  onSubmit(): void {
    if (this.chairForm.valid) {
      this.isSubmitting = true;
      const chairData = this.chairForm.value;

      const request$ = this.isEditMode && this.chairId
        ? this.programChairService.updateProgramChair(this.chairId, chairData)
        : this.programChairService.createProgramChair(chairData);

      request$.subscribe({
        next: () => {
          this.isSubmitting = false;
          this.programChairService.loadProgramChairs(); // Reload the list after successful operation
          this.router.navigate(['/program-chairs']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error saving program chair:', error);
          this.isSubmitting = false;
          alert('Error saving program chair. Please try again.');
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/program-chairs']);
  }
}
