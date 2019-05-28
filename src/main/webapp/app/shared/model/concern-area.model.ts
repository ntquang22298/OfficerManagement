import { IOfficer } from 'app/shared/model/officer.model';

export interface IConcernArea {
  id?: number;
  name?: string;
  description?: any;
  officers?: IOfficer[];
}

export class ConcernArea implements IConcernArea {
  constructor(public id?: number, public name?: string, public description?: any, public officers?: IOfficer[]) {}
}
