import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LoginModel } from '../models/login.model';
import { UserModel } from '../models/user.model';

interface LoginResponse {
  token_type: string;
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private URL = 'http://127.0.0.1:8000/api/auth';
  msg$ = new BehaviorSubject<string | null>(null);
  msg: string | null = null;

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken()); // Inicializa según el token
  isLoggedIn = this.isLoggedInSubject.asObservable(); // Observable para los componentes


  private currentLoginMsgSubject = new BehaviorSubject<string | null>(null);
  currentLoginMsg = this.currentLoginMsgSubject.asObservable();


  constructor(private httpClient: HttpClient, private router: Router) { }



  login(loginModel: LoginModel) {
    console.log(loginModel)
    this.httpClient.post<LoginResponse>(`${this.URL}/login`, loginModel).subscribe(

      (response: LoginResponse) => {
        this.msg = response.token_type;
        const tokenMatch = response.accessToken.match(/"([^"]+)"/);
        const token = tokenMatch ? tokenMatch[1] : response.accessToken;
        localStorage.setItem('token', token);
        this.isLoggedInSubject.next(true);
        this.router.navigate(['/task']);
        this.goAdminPage();
      },
      err => {
        this.msg$.next(err.error);
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  goAdminPage() {
    this.router.navigate(['/task']);
  }

  register(user: UserModel) {
    console.log(user)

    return this.httpClient.post(`${this.URL}/register`, user, { observe: 'response', responseType: 'json' });
  }
}
