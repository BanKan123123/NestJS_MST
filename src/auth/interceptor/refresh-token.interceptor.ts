import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
     constructor(private readonly authService: AuthService) {}
     intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
          const request = context.switchToHttp().getRequest();
          const accessToken = request.headers['authorization'];

          if (!accessToken) {
               return next.handle();
          }

          return next.handle().pipe(
               catchError(async (err) => {
                    if (err.status === 401) {
                         const refreshToken = request.headers['x-refresh-token'];

                         if (refreshToken) {
                              const newAccessToken = await this.authService.refresh(refreshToken);

                              request.headers['Authorization'] = `Bearer ${newAccessToken}`;
                              return next.handle();
                         }
                    }
                    return throwError(err);
               }),
          );
     }
}
