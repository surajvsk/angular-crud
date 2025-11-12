import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const loggedIn = !!localStorage.getItem('token');

    if (!loggedIn) {
      router.navigate(['/']); 
      return false;
    }

    return true;
    
  }

  return true;
};
