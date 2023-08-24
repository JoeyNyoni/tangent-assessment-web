import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { Employee } from 'src/app/models/employee';
import { Skill } from 'src/app/models/skill';
import { CreateEmployee, UpdateEmployee } from 'src/app/store/employee/employee.actions';

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
      postalCode: ['', [Validators.required, Validators.minLength(4)]],
      country: ['South Africa', [Validators.required, Validators.minLength(3)]],
      skills: this.fb.array([])
    });
  }

  addSkill() {
    const skills = this.form.controls['skills'] as FormArray;

    skills.push(this.fb.group({  
      name: ['', [Validators.required, Validators.minLength(2)]],
      yearsExperienced: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],  
      seniority: ['', Validators.required],  
    }));
  }   
     
  removeSkill(i: number) {
    (this.form.controls['skills'] as FormArray).removeAt(i);
  }

  trackByFn(index: number) {
    return index;
  }

  onSubmit() : void {
    const skillsArr: Skill[] = [];
    
    if (this.form.valid) {
      
      this.form.value.skills.forEach((x: any) => {
        let newSkill: Skill = {
          name: x.name,
          yearsExperienced: x.yearsExperienced,
          seniority: x.seniority
        };
        skillsArr.push(newSkill);
      });

      const emp: Employee = {
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        contactNumber: this.form.value.contactNumber,
        emailAddress: this.form.value.emailAddress,
        dateOfBirth: moment(this.form.value.dateOfBirth).format("YYYY-MM-DD"),
        streetAddress: this.form.value.streetAddress,
        city: this.form.value.city,
        postalCode: this.form.value.postalCode,
        country: this.form.value.country,
        skills: skillsArr
      };

      if (this.mode =  formMode.CREATE) {
        this.store.dispatch(new CreateEmployee(emp));
      } else {
        this.store.dispatch(new UpdateEmployee(emp, emp.id))
      }
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
