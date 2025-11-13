import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class LoginComponent {   // MUST BE LoginComponent
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}
loading: boolean = false;
onLogin() {
  this.loading = true;
  const payload = { email: this.email, password: this.password };
  this.http.post(`${environment.apiUrl}/auth/login`, payload)
    .subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/dashboard']);
        } else {
          alert('Login failed: Token missing');
        }
      },
      error: (err) => {
        this.loading = false;
        alert('Login Failed');
        console.error(err);
      }
    });
}
}
