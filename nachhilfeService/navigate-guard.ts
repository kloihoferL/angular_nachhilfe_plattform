import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {AuthentificationService} from './src/app/shared/authentification.service';

export const canNavigateToAdminGuard: CanActivateFn = (route, state) => {
  const authService:AuthentificationService = inject(AuthentificationService);
  const router:Router = inject(Router);
  const toastService = inject(ToastrService);
  if(authService.isLoggedIn() && authService.getCurrentUserRole() === 'geber'){
    return true;
  }else{
    toastService.error('Sie müssen als Geber angemeldet sein, um auf diese Seite zuzugreifen');
    router.navigate(['/login']);
    return false;
  }
};
