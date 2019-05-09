import { IResearchArea } from 'app/shared/model/research-area.model';
import { IOfficer } from 'app/shared/model/officer.model';

export interface IResearchArea {
  id?: number;
  name?: string;
  childs?: IResearchArea[];
  parent?: IResearchArea;
  officers?: IOfficer[];
}

export class ResearchArea implements IResearchArea {
  constructor(
    public id?: number,
    public name?: string,
    public childs?: IResearchArea[],
    public parent?: IResearchArea,
    public officers?: IOfficer[]
  ) {}
}
