import { Skill } from './skill';

export class Employee {
  id?: string;
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  emailAddress?: string;
  dateOfBirth?: string;
  stringAddress?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  skills?: Skill[];
}
