import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeFormComponent } from 'src/app/components/employee-form/employee-form.component';
import { Employee } from 'src/app/models/employee';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent implements OnInit {
  query: string = '';
  toggleShowDialog: boolean = false;
  employees: Employee[] = [];

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {

  }

  showDialog() : void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '50%',
      minHeight: 'calc(100vh - 90px)',
      height : 'auto',
      data: {  },
    });
    dialogRef.afterClosed().subscribe((res) => {
      
    });
  }
}
