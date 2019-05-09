import { IConcernArea } from 'app/shared/model/concern-area.model';
import { IOfficer } from 'app/shared/model/officer.model';

export interface IConcernArea {
  id?: number;
  name?: string;
  childs?: IConcernArea[];
  parent?: IConcernArea;
  officers?: IOfficer[];
}

export class ConcernArea implements IConcernArea {
  constructor(
    public id?: number,
    public name?: string,
    public childs?: IConcernArea[],
    public parent?: IConcernArea,
    public officers?: IOfficer[]
  ) {}
}
