import { IUser } from 'app/core/user/user.model';
import { IResearchArea } from 'app/shared/model/research-area.model';
import { IConcernArea } from 'app/shared/model/concern-area.model';
import { IUnit } from 'app/shared/model/unit.model';
import { IDiary } from 'app/shared/model/diary.model';

export const enum OfficerDegree {
  TS = 'TS',
  PGSTS = 'PGSTS',
  ThS = 'ThS',
  CN = 'CN',
  GSTS = 'GSTS'
}

export const enum OfficerType {
  HT = 'HT',
  PHT = 'PHT',
  TK = 'TK',
  PK = 'PK',
  CNBM = 'CNBM',
  PCNBM = 'PCNBM',
  GV = 'GV'
}

export interface IOfficer {
  id?: number;
  code?: string;
  fullName?: string;
  avatarUrl?: string;
  vNUEmail?: string;
  degree?: OfficerDegree;
  type?: OfficerType;
  user?: IUser;
  researchAreas?: IResearchArea[];
  concernAreas?: IConcernArea[];
  unit?: IUnit;
  diaries?: IDiary[];
}

export class Officer implements IOfficer {
  constructor(
    public id?: number,
    public code?: string,
    public fullName?: string,
    public avatarUrl?: string,
    public vNUEmail?: string,
    public degree?: OfficerDegree,
    public type?: OfficerType,
    public user?: IUser,
    public researchAreas?: IResearchArea[],
    public concernAreas?: IConcernArea[],
    public unit?: IUnit,
    public diaries?: IDiary[]
  ) {}
}
