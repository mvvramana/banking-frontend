import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

// The function interceptor
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('jwtToken');
  console.log("JWT Interceptor: Retrieved Token:", token);
  let clonedReq = req;

  if (token && token.trim() !== '') {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq);
};