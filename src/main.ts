import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
// import * as csrf from 'csurf';
import { ProxyService } from './proxy/proxy.service';

async function bootstrap() {
     // HTTPS Configuration
     const httpsOptions = {
          key: fs.readFileSync('./server.key'),
          cert: fs.readFileSync('./server.crt'),
     };

     // Create HTTPS server
     const app = await NestFactory.create(AppModule, { httpsOptions });

     // Middleware for cookie parsing
     app.use(cookieParser());

     // Enable CORS for specified frontend domain
     app.enableCors({
          origin: 'http://localhost:3000', // Frontend domain
          credentials: true, // Allow credentials (cookies)
     });

     // Apply global validation pipes
     app.useGlobalPipes(
          new ValidationPipe({
               whitelist: true, // Strip out unknown properties from input objects
               forbidNonWhitelisted: true, // Reject requests with unknown properties
               transform: true, // Automatically transform payloads to DTO instances
          }),
     );

     // Proxy configuration
     const proxyService = app.get(ProxyService);
     proxyService.configureProxy(app); // Assuming this sets up your proxy logic

     // Start the server
     const port = process.env.PORT ?? 3001;
     await app.listen(port, () => {
          console.log(`Server is running on https://localhost:${port}`);
     });
}

bootstrap();
