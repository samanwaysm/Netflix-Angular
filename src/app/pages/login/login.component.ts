declare var google: any;
import { Component, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  private router = inject(Router);
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '144041381179-4s45d5mr5kdsfctsju5u2dcbk62gmiga.apps.googleusercontent.com',
      callback: (resp: any)=>
        // console.log(resp);
        this.handleLogin(resp)
      
    });
    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangle',
      width: 350,
    });
  }

    private decodeToken(token: string) {
        return JSON.parse(atob(token.split(".")[1]));
    }
    
    
    handleLogin(response: any) {
      if (response) {
        const payLoad = this.decodeToken(response.credential);
        sessionStorage.setItem("loggedInUser", JSON.stringify(payLoad));
        this.router.navigate(['browse']);
    }
  }
}
