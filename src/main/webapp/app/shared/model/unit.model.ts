import { IOfficer } from 'app/shared/model/officer.model';

export enum UnitType {
  BOMON = 'BOMON',
  PHONGTHINGHIEM = 'PHONGTHINGHIEM'
}

export interface IUnit {
  id?: number;
  name?: string;
  address?: string;
  phone?: string;
  website?: string;
  type?: UnitType;
  officers?: IOfficer[];
}

export class Unit implements IUnit {
  constructor(
    public id?: number,
    public name?: string,
    public address?: string,
    public phone?: string,
    public website?: string,
    public type?: UnitType,
    public officers?: IOfficer[]
  ) {}
}
