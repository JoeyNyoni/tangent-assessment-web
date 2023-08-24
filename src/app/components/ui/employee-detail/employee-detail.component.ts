import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';

import { EmployeeState } from 'src/app/store/employee/employee.state';
import { Employee } from 'src/app/models/employee';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.sass']
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  @Select(EmployeeState.getEmployees) employees$!: Observable<any[]>;
  employees: Employee[] = [];
  private subscription!: Subscription;
  
  constructor() {}
  
  ngOnInit(): void {
    this.subscription = this.employees$.subscribe((data) => {
      this.employees = data[0];
      console.log('huh', this.employees);
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  trackByFn(index: number) {
    return index;
  }
}
