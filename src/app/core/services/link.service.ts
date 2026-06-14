import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateAnonymousLinkRequest,
  CreateLinkRequest,
  LinkResponse,
  UpdateLinkRequest,
} from '../models/link.model';
import { PageResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LinkService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/links`;

  findAll(page: number = 0, size: number = 10): Observable<PageResponse<LinkResponse>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<LinkResponse>>(this.baseUrl, { params, withCredentials: true });
  }

  findById(id: number): Observable<LinkResponse> {
    return this.http.get<LinkResponse>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  create(request: CreateLinkRequest): Observable<LinkResponse> {
    return this.http.post<LinkResponse>(this.baseUrl, request, { withCredentials: true });
  }

  createAnonymous(request: CreateAnonymousLinkRequest): Observable<LinkResponse> {
    return this.http.post<LinkResponse>(`${this.baseUrl}/anonymous`, request);
  }

  update(id: number, request: UpdateLinkRequest): Observable<LinkResponse> {
    return this.http.put<LinkResponse>(`${this.baseUrl}/${id}`, request, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}
