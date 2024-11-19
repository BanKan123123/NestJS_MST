import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { Response, Request } from 'express';
import * as csrf from 'csurf';

@Controller('auth')
export class AuthController {
     private csrfProtection;
     constructor(private authService: AuthService) {
          this.csrfProtection = csrf({ cookie: true });
     }

     @Post('login')
     async login(@Body() auth: AuthDTO, @Res() res: Response, @Req() req: Request) {
          const { accessToken, refreshToken } = await this.authService.login(auth);

          // Set refreshtoken vào cookies httpOnly
          res.cookie('refreshToken', refreshToken, {
               httpOnly: true,
               secure: process.env.NODE_ENV !== 'production',
               sameSite: 'strict',
               maxAge: 7 * 24 * 60 * 60 * 1000,
               path: '/',
          });

          // Set CSRF token vào cookies
          res.cookie('XSRF-TOKEN', req.csrfToken(), {
               // Sửa thành req.csrfToken()
               httpOnly: false, // Đảm bảo token có thể truy cập từ frontend
               secure: process.env.NODE_ENV === 'production', // Chỉ sử dụng HTTPS trong production
               sameSite: 'strict', // Bảo vệ khỏi CSRF
          });
          return res.status(200).json({ accessToken });
     }
     @Post('register')
     signUp(@Body() auth: AuthDTO) {
          return this.authService.signUp(auth);
     }

     @Post('refresh')
     async refresh(@Body('refreshToken') refreshToken: string) {
          this.authService.refresh(refreshToken);
     }

     @Get('refresh-token')
     async refreshToken(@Req() req: Request, @Res() res: Response) {
          const refreshToken = req.cookies['refreshToken'];

          if (!refreshToken) {
               return res.status(401).json({ message: 'No refresh token found' });
          }

          try {
               const newAccessToken = await this.authService.refresh(refreshToken);

               if (!newAccessToken) {
                    res.clearCookie('refreshToken');
                    return res.status(401).send({ message: 'Refresh token expired' });
               }

               return res.json({ accessToken: newAccessToken });
          } catch (err) {
               res.clearCookie('refreshToken');
               return res.status(401).send({ message: err });
          }
     }

     @Get('csrf-token')
     getCsrfToken(@Res() res: Response) {
          // CSRF token được tạo và lưu vào cookie
          const csrfToken = res.locals.csrfToken(); // Lấy csrf token từ middleware csurf
          res.cookie('XSRF-TOKEN', csrfToken, {
               httpOnly: true, // Đảm bảo chỉ có thể truy cập từ server
               secure: process.env.NODE_ENV === 'production', // Đảm bảo chỉ gửi qua HTTPS trong production
               sameSite: 'strict', // Bảo vệ chống lại CSRF
          });

          return res.json({ message: 'CSRF token has been set' });
     }
}
