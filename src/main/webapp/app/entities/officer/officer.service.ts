import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IOfficer } from 'app/shared/model/officer.model';

type EntityResponseType = HttpResponse<IOfficer>;
type EntityArrayResponseType = HttpResponse<IOfficer[]>;

@Injectable({ providedIn: 'root' })
export class OfficerService {
  public resourceUrl = SERVER_API_URL + 'api/officers';
  public findByUnitUrl = SERVER_API_URL + 'api/officers-by-unit';
  constructor(protected http: HttpClient) {}

  create(officer: IOfficer): Observable<EntityResponseType> {
    return this.http.post<IOfficer>(this.resourceUrl, officer, { observe: 'response' });
  }

  update(officer: IOfficer): Observable<EntityResponseType> {
    return this.http.put<IOfficer>(this.resourceUrl, officer, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOfficer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOfficer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  findByUnit(key: string): Observable<EntityArrayResponseType> {
    return this.http.get<IOfficer[]>(`${this.findByUnitUrl}/${key}`, { observe: 'response' });
  }
}
