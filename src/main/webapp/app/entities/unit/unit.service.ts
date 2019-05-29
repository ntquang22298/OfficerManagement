import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IUnit, UnitType } from 'app/shared/model/unit.model';

type EntityResponseType = HttpResponse<IUnit>;
type EntityArrayResponseType = HttpResponse<IUnit[]>;

@Injectable({ providedIn: 'root' })
export class UnitService {
  public resourceUrl = SERVER_API_URL + 'api/units';
  public findByTypeUrl = SERVER_API_URL + 'api/units-by-type';
  public findByNameUrl = SERVER_API_URL + 'api/units-by-name';

  constructor(protected http: HttpClient) {}

  create(unit: IUnit): Observable<EntityResponseType> {
    return this.http.post<IUnit>(this.resourceUrl, unit, { observe: 'response' });
  }

  update(unit: IUnit): Observable<EntityResponseType> {
    return this.http.put<IUnit>(this.resourceUrl, unit, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUnit>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUnit[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByType(type: UnitType) {
    return this.http.get<IUnit[]>(`${this.findByTypeUrl}/${type}`, { observe: 'response' });
  }
  findByName(key: String) {
    return this.http.get<IUnit[]>(`${this.findByNameUrl}/${key}`, { observe: 'response' });
  }
}
