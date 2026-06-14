import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly userSignal = signal<User | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly user = this.userSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);

  checkAuthStatus(): Observable<User | null> {
    this.loadingSignal.set(true);
    return this.http.get<User>(`${environment.apiUrl}/api/user/me`, { withCredentials: true }).pipe(
      tap((user) => this.userSignal.set(user)),
      catchError(() => {
        this.userSignal.set(null);
        return of(null);
      }),
      tap(() => this.loadingSignal.set(false)),
    );
  }

  login(): void {
    window.location.href = `${environment.apiUrl}/oauth2/authorization/google`;
  }

  logout(): void {
    window.location.href = `${environment.apiUrl}/logout`;
  }
}
