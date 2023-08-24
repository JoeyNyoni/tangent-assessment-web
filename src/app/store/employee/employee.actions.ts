import { Employee } from "src/app/models/employee"

export class GetEmployees {
  static readonly type = '[Employee] Fetch'
}

export class SetSelectedEmployee {
  static readonly type = '[Employee] Set Selected'
  constructor(public payload: Employee) {};
}

export class ResetSelectedEmployee {
  static readonly type = '[Employee] Reset Selected'
  constructor() {};
}

export class CreateEmployee {
  static readonly type = '[Employee] Create'
  constructor(public payload: any) {};
}

export class UpdateEmployee {
  static readonly type = '[Employee] Update'
  constructor(public payload: any, public id?: string) {};
}

export class DeleteEmployee {
  static readonly type = '[Employee] Delete';
  constructor(public id: string) {};
}
