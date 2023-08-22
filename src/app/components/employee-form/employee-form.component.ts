import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from 'src/app/models/employee';

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
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeData) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      contactNumber: ['', [Validators.required, Validators.minLength(10)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      streetAddress: ['', Validators.required],
      city: ['', [Validators.required, Validators.minLength(3)]],
      postalCode: ['', [Validators.required, Validators.minLength(3)]],
      country: ['', [Validators.required, Validators.minLength(3)]],
      skills: this.fb.array([this.newSkill()])
    });
  }

  skills(): FormArray {
    return this.form.get("skills") as FormArray
  }

  newSkill(): FormGroup {  
    return this.fb.group({  
      skillName: ['', [Validators.required, Validators.minLength(2)]],
      skillYears: ['',],  
      skillSeniority: '',  
    })  
  }  
     
  addSkill() {  
    this.skills().push(this.newSkill());  
  }  
     
  removeSkill(i: number) {  
    this.skills().removeAt(i);  
  } 

  onSubmit() : void {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
