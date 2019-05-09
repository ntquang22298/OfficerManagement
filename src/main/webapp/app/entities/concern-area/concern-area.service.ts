import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IConcernArea } from 'app/shared/model/concern-area.model';

type EntityResponseType = HttpResponse<IConcernArea>;
type EntityArrayResponseType = HttpResponse<IConcernArea[]>;

@Injectable({ providedIn: 'root' })
export class ConcernAreaService {
  public resourceUrl = SERVER_API_URL + 'api/concern-areas';

  constructor(protected http: HttpClient) {}

  create(concernArea: IConcernArea): Observable<EntityResponseType> {
    return this.http.post<IConcernArea>(this.resourceUrl, concernArea, { observe: 'response' });
  }

  update(concernArea: IConcernArea): Observable<EntityResponseType> {
    return this.http.put<IConcernArea>(this.resourceUrl, concernArea, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IConcernArea>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IConcernArea[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
