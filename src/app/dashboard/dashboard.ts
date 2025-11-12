import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NavbarComponent } from '../navbar/navbar';

// import boostrap modules if needed
@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, HttpClientModule, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent {

}