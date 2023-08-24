import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';

import { Employee } from 'src/app/models/employee';
import { Skill } from 'src/app/models/skill';
import { CreateEmployee, UpdateEmployee } from 'src/app/store/employee/employee.actions';
import { EmployeeState } from 'src/app/store/employee/employee.state';
import { formMode } from '../helpers/constants';

export interface EmployeeData {
  employee: Employee,
  mode: string
}

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.sass']
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  @Select(EmployeeState.getSelectedEmployee) existingEmp$!: Observable<Employee>;
  @Input() mode: string = formMode.CREATE;
  
  existingEmp!: Employee;
  form!: FormGroup;
  private subscription!: Subscription;

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
    this.mode = this.dialogRef.componentInstance?.data ? this.dialogRef.componentInstance?.data.mode : this.mode;

    if (this.mode === formMode.EDIT) {
      this.existingEmp$.subscribe((data) => {
        this.existingEmp = data;
      });
    }

    this.form = this.fb.group({
      firstName: [this.existingEmp ? this.existingEmp.firstName : '', [Validators.required, Validators.minLength(3)]],
      lastName: [this.existingEmp ? this.existingEmp.lastName : '', [Validators.required, Validators.minLength(3)]],
      contactNumber: [this.existingEmp ? this.existingEmp.contactNumber : '', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]],
      emailAddress: [this.existingEmp ? this.existingEmp.emailAddress : '', [Validators.required, Validators.email]],
      dateOfBirth: [this.existingEmp.dateOfBirth ? moment(this.existingEmp.dateOfBirth).toISOString() : '', Validators.required],
      streetAddress: [this.existingEmp ? this.existingEmp.streetAddress : '', Validators.required],
      city: [this.existingEmp ? this.existingEmp.city : '', [Validators.required, Validators.minLength(3)]],
      postalCode: [this.existingEmp ? this.existingEmp.postalCode : '', [Validators.required, Validators.minLength(4)]],
      country: [this.existingEmp ? this.existingEmp.country : 'South Africa', [Validators.required, Validators.minLength(3)]],
      skills: this.existingEmp ? this.fb.array(this.addExistingSkills()) : this.fb.array([])
    });
  }

  ngOnDestroy(): void {
    if(this.mode === formMode.EDIT) {
      this.subscription.unsubscribe();
    }
  }

  addExistingSkills() {
    const existingSkills: any[] = [];

    this.existingEmp.skills?.forEach((s: Skill) => {
      existingSkills.push(this.fb.group({
        name: [s.name, [Validators.required, Validators.minLength(2)]],
        yearsExperienced: [s.yearsExperienced, [Validators.required, Validators.pattern("^[0-9]*$")]],  
        seniority: [s.seniority, Validators.required],
      }));
    });
    
    return existingSkills;
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
      
      if (this.mode === formMode.EDIT) {
        emp.id = this.existingEmp.id;
        this.store.dispatch(new UpdateEmployee(emp, emp.id))
      } else {
        this.store.dispatch(new CreateEmployee(emp)).subscribe((res) => {
          console.log(res);
          this.onCancelClick();
        });
      }
    }
  }

  onCancelClick(): void {
    console.log(this.form.value);
    this.dialogRef.close();
  }
}
