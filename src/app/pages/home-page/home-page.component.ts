import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { filter, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { GetEmployees } from 'src/app/store';
import { EmployeeState } from 'src/app/store/employee/employee.state';
import { EmployeeFormComponent } from 'src/app/components/employee-form/employee-form.component';
import { Employee } from 'src/app/models/employee';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent implements OnInit, OnDestroy {
  @Select(EmployeeState.getEmployees) employees$!: Observable<any[]>;
  @ViewChild('query', { static: true }) query: ElementRef;

  toggleShowDialog: boolean = false;
  employeeCount: number = 0;
  employees: Employee[] = [];
  private subscription: Subscription | undefined;
  term: string;
  
  constructor(public dialog: MatDialog, private store: Store) {
    this.getEmployees();
  }

  ngOnInit(): void {
    this.subscription = this.employees$.subscribe((data) => {
      this.employeeCount = data ? data[0]?.length : this.employeeCount;
    })    
  }

  ngAfterViewInit() {
    fromEvent(this.query.nativeElement, 'keyup')
    .pipe(
      filter(Boolean),
      debounceTime(1000),
      distinctUntilChanged(),
      tap(() => {
        this.term = this.query.nativeElement.value;
      })
    ).subscribe((val) => {});
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  showDialog() : void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '50%',
      minHeight: 'calc(100vh - 50px)',
      position: { left: '15px' },
      data: {  },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.store.dispatch(new GetEmployees());
    });
  }
  
  getEmployees() {
    this.store.dispatch(new GetEmployees()).subscribe((state) => {
      this.employees = state.employeeState.employees[0];
    });
  }
}
