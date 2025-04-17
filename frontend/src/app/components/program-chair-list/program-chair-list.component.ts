import { Component, OnInit } from '@angular/core';
import { ProgramChairService } from '../../services/program-chair.service';
import { ProgramChair } from '../../models/program-chair.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-program-chair-list',
  standalone: false,
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col">
          <h2 class="mb-4">Program Chairs</h2>
          
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="thead-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Affiliation</th>
                  <th>Expertise</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let chair of programChairs$ | async">
                  <td>{{chair.name}}</td>
                  <td>{{chair.email_id}}</td>
                  <td>{{chair.affiliation}}</td>
                  <td>{{chair.expertise_area}}</td>
                  <td>
                    <button class="btn btn-sm btn-danger" (click)="deleteChair(chair.chair_id)">
                      <i class="fas fa-trash"></i> Delete
                    </button>
                    <button class="btn btn-sm btn-primary ml-2" [routerLink]="['/program-chair', chair.chair_id, 'edit']">
                      <i class="fas fa-edit"></i> Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div *ngIf="(programChairs$ | async)?.length === 0" class="alert alert-info">
            No program chairs found.
          </div>

          <button class="btn btn-success mt-3" routerLink="/program-chair/new">
            <i class="fas fa-plus"></i> Add New Program Chair
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }

    .thead-dark {
      background-color: #667eea;
      color: white;
    }

    .btn-danger {
      background-color: #ef4444;
      border: none;
    }

    .btn-primary {
      background-color: #667eea;
      border: none;
    }

    .btn-success {
      background-color: #10b981;
      border: none;
    }

    .btn {
      transition: transform 0.2s;
    }

    .btn:hover {
      transform: translateY(-1px);
    }
  `]
})
export class ProgramChairListComponent implements OnInit {
  programChairs$: Observable<ProgramChair[]>;

  constructor(private programChairService: ProgramChairService) {
    this.programChairs$ = this.programChairService.getProgramChairs();
  }

  ngOnInit() {
    this.programChairService.loadProgramChairs();
  }

  deleteChair(id: number) {
    if (confirm('Are you sure you want to delete this program chair?')) {
      this.programChairService.deleteProgramChair(id).subscribe({
        next: (response) => {
          alert('Program chair deleted successfully');
        },
        error: (error) => {
          if (error.status === 404) {
            alert('Program chair not found. It may have been already deleted.');
            this.programChairService.loadProgramChairs();
          } else {
            console.error('Error deleting program chair:', error);
            alert('Failed to delete program chair. Please try again.');
          }
        },
        complete: () => {
          this.programChairService.loadProgramChairs();
        }
      });
    }
  }
}
