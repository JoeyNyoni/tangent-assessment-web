export class GetEmployees {
  static readonly type = '[Employee] Fetch'
}

export class GetEmployeeById {
  static readonly type = '[Employee] Fetch ID'
  constructor(public id: string) {};
}

export class CreateEmployee {
  static readonly type = '[Employee] Create'
  constructor(public payload: any) {};
}

export class UpdateEmployee {
  static readonly type = '[Employee] Update'
  constructor(public payload: any, public id: string) {};
}

export class DeleteEmployee {
  static readonly type = '[Employee] Delete';
  constructor(public id: string) {};
}
