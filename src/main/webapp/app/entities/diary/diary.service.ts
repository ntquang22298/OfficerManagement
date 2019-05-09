import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IDiary } from 'app/shared/model/diary.model';

type EntityResponseType = HttpResponse<IDiary>;
type EntityArrayResponseType = HttpResponse<IDiary[]>;

@Injectable({ providedIn: 'root' })
export class DiaryService {
  public resourceUrl = SERVER_API_URL + 'api/diaries';

  constructor(protected http: HttpClient) {}

  create(diary: IDiary): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(diary);
    return this.http
      .post<IDiary>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(diary: IDiary): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(diary);
    return this.http
      .put<IDiary>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDiary>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDiary[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(diary: IDiary): IDiary {
    const copy: IDiary = Object.assign({}, diary, {
      time: diary.time != null && diary.time.isValid() ? diary.time.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.time = res.body.time != null ? moment(res.body.time) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((diary: IDiary) => {
        diary.time = diary.time != null ? moment(diary.time) : null;
      });
    }
    return res;
  }
}
