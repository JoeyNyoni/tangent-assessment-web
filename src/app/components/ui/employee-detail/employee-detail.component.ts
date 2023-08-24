import { Component, Input, OnChanges, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';

import { EmployeeFormComponent } from 'src/app/components/employee-form/employee-form.component';
import { EmployeeState } from 'src/app/store/employee/employee.state';
import { Employee } from 'src/app/models/employee';
import { GetEmployees, ResetSelectedEmployee, SetSelectedEmployee } from 'src/app/store';
import { formMode } from '../../helpers/constants';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.sass']
})
export class EmployeeDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Input() query: string;
  @Select(EmployeeState.getEmployees) employees$!: Observable<any[]>;
  
  employees: Employee[] = [];
  private subscription!: Subscription;
  
  constructor(public dialog: MatDialog, private store: Store) {}
  
  ngOnInit(): void {
    this.subscription = this.employees$.subscribe((data) => {
      this.employees = data[0];
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    let q = changes['query'].currentValue
    if (q) {
      this.employees = this.employees.filter((x) => x.firstName?.includes(q) || x.lastName?.includes(q) || x.emailAddress?.includes(q))
    } else {
      this.subscription = this.employees$.subscribe((data) => {
        this.employees = data[0];
      });
    }
  }

  showDialog(e: Employee) : void {
    this.store.dispatch(new SetSelectedEmployee(e));

    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '50%',
      minHeight: 'calc(100vh - 50px)',
      position: { left: '15px' },
      data: { employee: e, mode: formMode.EDIT },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.store.dispatch(new ResetSelectedEmployee());
      this.store.dispatch(new GetEmployees());
    });
  }

  trackByFn(index: number) {
    return index;
  }
}
