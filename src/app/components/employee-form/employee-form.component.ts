import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Employee } from 'src/app/models/employee';
import { CreateEmployee } from 'src/app/store/employee/employee.actions';

export const formMode = {
  CREATE: 'create',
  EDIT: 'edit'
}

export interface EmployeeData {
  employee: Employee
}

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.sass']
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  mode: string = formMode.CREATE;

  seniorityLevels = [
    { value: 'Junior', label: 'Junior' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Senior', label: 'Senior' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private store: Store,
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeData) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      contactNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      streetAddress: ['', Validators.required],
      city: ['', [Validators.required, Validators.minLength(3)]],
      postalCode: ['', [Validators.required, Validators.minLength(3)]],
      country: ['', [Validators.required, Validators.minLength(3)]],
      skills: this.fb.array([])
    });
  }

  addSkill() {
    const skills = this.form.controls['skills'] as FormArray;

    skills.push(this.fb.group({  
      skillName: ['', [Validators.required, Validators.minLength(2)]],
      skillYears: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],  
      skillSeniority: ['', Validators.required],  
    }));
  }   
     
  removeSkill(i: number) {
    const skills = this.form.controls['skills'] as FormArray;
    skills.removeAt(i);  
  }

  trackByFn(index: number) {
    return index;
  }

  onSubmit() : void {
    console.log(this.form.value);
    // if (this.form.valid) {
    //   const emp = new Employee();
    //   this.store.dispatch(new CreateEmployee(emp));
    // }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
