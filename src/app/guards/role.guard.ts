import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Get roles from route
  let expectedRoles = route.data['role'];

  //  Convert to array if single string
  if (!Array.isArray(expectedRoles)) {
    expectedRoles = [expectedRoles];
  }

  const userRole = authService.getRole();

  console.log("User Role:", userRole);
  console.log("Expected Roles:", expectedRoles);

  //  Not logged in
  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  //  Remove ROLE_ prefix
  const cleanRole = userRole.replace('ROLE_', '');
  console.log("CLEAN ROLE:", cleanRole);


  //  Role not allowed
  if (!expectedRoles.includes(cleanRole)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  //  Allowed
  return true;
};