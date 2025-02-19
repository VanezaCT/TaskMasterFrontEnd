import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn: boolean = false; // Variable para controlar la visibilidad del botón

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // this.authService.authStatus$.subscribe(status => {
    //   this.isLoggedIn = status;
    // });
    this.isLoggedIn = this.authService.isAuthenticated(); // Verifica si está autenticado
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false; // Actualiza la variable al cerrar sesión
    this.router.navigate(['/auth/login']);
  }
}
