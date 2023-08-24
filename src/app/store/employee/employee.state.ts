import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from 'rxjs/operators';

import { Employee } from "src/app/models/employee";
import { EmployeeService } from "src/app/services/employee.service";
import { CreateEmployee, DeleteEmployee, GetEmployeeById, GetEmployees, UpdateEmployee } from "./employee.actions";

export interface EmployeeStateModel {
  employees: Employee[];
  selectedEmployee: any;
  loading: boolean;
}

@State<EmployeeStateModel>({
  name: 'employeeState',
  defaults: {
    employees: [],
    selectedEmployee: null,
    loading: false,
  }
})

@Injectable()
export class EmployeeState {

  constructor(private service: EmployeeService) {}
  
  // Selectors

  @Selector()
  static getEmployees(state: EmployeeStateModel) {
    return state.employees;
  }

  @Selector()
  static getEmployeeById(state: EmployeeStateModel) {
    return state.selectedEmployee;
  }

  @Selector()
  static getLoading(state: EmployeeStateModel) {
    return state.loading;
  }

  // Actions

  @Action(GetEmployees)
  getEmployees(ctx: StateContext<EmployeeStateModel>) {
    return this.service.getEmployees().pipe(tap( response => {
      const state =  ctx.getState();
      ctx.patchState({ employees: [...state.employees, response] });
    }));
  }

  @Action(GetEmployeeById)
  getEmployeeById(ctx: StateContext<EmployeeStateModel>, { id }: GetEmployeeById) {
    const state =  ctx.getState();
    ctx.patchState({ selectedEmployee: [...state.selectedEmployee, state.employees.find(x => x.id === id)] });
  }

  @Action(CreateEmployee)
  createEmployee(ctx: StateContext<EmployeeStateModel>, { payload }: CreateEmployee) {
    return this.service.createEmployee(payload).pipe(tap(response => {
      const state =  ctx.getState();
      ctx.patchState({ employees: [...state.employees, response] });
    }));
  }
  
  @Action(UpdateEmployee)
  updateEmployee(ctx: StateContext<EmployeeStateModel>, { payload }: UpdateEmployee) {
    return this.service.updateEmployee(payload).pipe(tap(response => {
      const state =  ctx.getState();
      ctx.patchState({ employees: [...state.employees, response] });
    }));
  }

  @Action(DeleteEmployee)
  deleteEmployee(ctx: StateContext<EmployeeStateModel>, {id}: DeleteEmployee) {
    return this.service.deleteEmployee(id).pipe(tap(response => {
      const state =  ctx.getState();
      ctx.patchState({ employees: [...state.employees, response] });
    }));
  }
}