import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { map } from 'rxjs/operators';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  API = environment.API_URL;
  
  constructor(private http: HttpClient) { }

  getEmployees() {
    return this.http.get(`${this.API}/employees`).pipe(map(response => {
      return response;
    }));
  }

  getEmployeeById(id: string) {
    return this.http.get(`${this.API}/employees/${id}`).pipe(map(response => {
      return response;
    }));
  }

  createEmployee(employee: Employee) {
    return this.http.post(`${this.API}/employees`, employee).pipe(map(response => {
      return response;
    }));
  }

  updateEmployee(employee: Employee) {
    return this.http.put(`${this.API}/employees`, employee).pipe(map(response => {
      return response;
    }));
  }

  deleteEmployee(id: string) {
    return this.http.delete(`${this.API}/employees`, { body: id }).pipe(map(response => {
      return response;
    }));
  }
}
