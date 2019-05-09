import { Moment } from 'moment';
import { IOfficer } from 'app/shared/model/officer.model';

export interface IDiary {
  id?: number;
  time?: Moment;
  content?: string;
  officer?: IOfficer;
}

export class Diary implements IDiary {
  constructor(public id?: number, public time?: Moment, public content?: string, public officer?: IOfficer) {}
}
