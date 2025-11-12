import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-register',
 imports: [RouterLink, FormsModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})



export class RegisterComponent {

  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    const payload = {
      name: this.name,
      email: this.email,
      password: this.password
    };
    const apiUrl = environment.apiUrl;

    this.http.post(`${apiUrl}/auth/register`, payload)
      .subscribe({
        next: (res: any) => {
          alert('Registration Successful');
          this.router.navigate(['/']);
        },
        error: () => {
          alert('Registration Failed');
        }
      });
  }

}
