import { Injectable, NestMiddleware } from '@nestjs/common';
import * as csrf from 'csurf';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
     private csrfProtection;

     constructor() {
          this.csrfProtection = csrf({ cookie: true });
     }

     use(req: Request, res: Response, next: NextFunction) {
          this.csrfProtection(req, res, next);
     }
}
