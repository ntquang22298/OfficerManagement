import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IResearchArea } from 'app/shared/model/research-area.model';

type EntityResponseType = HttpResponse<IResearchArea>;
type EntityArrayResponseType = HttpResponse<IResearchArea[]>;

@Injectable({ providedIn: 'root' })
export class ResearchAreaService {
  public resourceUrl = SERVER_API_URL + 'api/research-areas';

  constructor(protected http: HttpClient) {}

  create(researchArea: IResearchArea): Observable<EntityResponseType> {
    return this.http.post<IResearchArea>(this.resourceUrl, researchArea, { observe: 'response' });
  }

  update(researchArea: IResearchArea): Observable<EntityResponseType> {
    return this.http.put<IResearchArea>(this.resourceUrl, researchArea, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IResearchArea>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResearchArea[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
