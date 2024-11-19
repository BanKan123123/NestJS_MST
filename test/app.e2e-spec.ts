import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDTO } from '../src/auth/dto/auth.dto';
import UserEditDTO from '../src/user/dto/user-edit.dto';
import BookMarkDTO from '../src/bookmark/dto/bookmark.dto';

describe('App e2e', () => {
     let app: INestApplication;
     let prisma: PrismaService;
     beforeAll(async () => {
          const moduleRef = await Test.createTestingModule({
               imports: [AppModule],
          }).compile();
          app = moduleRef.createNestApplication();
          app.useGlobalPipes(
               new ValidationPipe({
                    whitelist: true,
               }),
          );
          await app.init();
          await app.listen(3333);

          prisma = app.get(PrismaService);
          await prisma.cleanDB();

          pactum.request.setBaseUrl('http://localhost:3333');
     });
     afterAll(() => {
          app.close();
     });

     it.todo('should pass');

     describe('Auth', () => {
          const dto: AuthDTO = {
               email: 'ninhnv@gmail.com',
               password: '123qwe',
          };
          describe('Sign Up', () => {
               it('Should throw email empty', () => {
                    return pactum
                         .spec()
                         .post('/auth/register')
                         .withBody({
                              password: dto.password,
                         })
                         .expectStatus(400);
               });

               it('Should throw password empty', () => {
                    return pactum
                         .spec()
                         .post('/auth/register')
                         .withBody({
                              email: dto.email,
                         })
                         .expectStatus(400);
               });

               it('Should throw both empty', () => {
                    return pactum.spec().post('/auth/register').expectStatus(400);
               });

               it('Should register', () => {
                    return pactum.spec().post('/auth/register').withBody(dto).expectStatus(201).stores('userAt', 'accessToken');
               });
          });
          describe('Login', () => {
               it('Should throw email empty', () => {
                    return pactum
                         .spec()
                         .post('/auth/register')
                         .withBody({
                              password: dto.password,
                         })
                         .expectStatus(400);
               });

               it('Should throw password empty', () => {
                    return pactum
                         .spec()
                         .post('/auth/register')
                         .withBody({
                              email: dto.email,
                         })
                         .expectStatus(400);
               });

               it('Should throw both empty', () => {
                    return pactum.spec().post('/auth/register').expectStatus(400);
               });

               it('should login', () => {
                    return pactum.spec().post('/auth/login').withBody(dto).expectStatus(201).stores('userAt', 'accessToken');
               });
          });
     });

     describe('User', () => {
          describe('me', () => {
               it('Should get current user', () => {
                    return pactum
                         .spec()
                         .get('/users/me')
                         .withHeaders({
                              Authorization: `Bearer $S{userAt}`, // Đảm bảo `userAt` đã được lưu từ trước
                         })
                         .expectStatus(200);
               });
          });
          describe('Edit user', () => {
               const data: UserEditDTO = {
                    email: 'user@example.com',
                    firstName: 'User Example',
                    lastName: 'Last',
               };
               it('Should edit user', () => {
                    return pactum
                         .spec()
                         .patch('/users/edit')
                         .withHeaders({
                              Authorization: `Bearer $S{userAt}`, // Đảm bảo `userAt` đã được lưu từ trước
                         })
                         .withBody(data)
                         .expectStatus(200);
                    // .expectBodyContains(data.firstName)
                    // .expectBodyContains(data.lastName)
                    // .expectBodyContains(data.email)
                    // .expectBodyContains('false value');
               });
          });
     });

     describe('BookMark', () => {
          const data: BookMarkDTO = {
               title: 'Book mark title',
               description: 'Book mark description',
               link: 'bookmakelink.wepb',
               userId: 1,
          };
          describe('Add Bookmark', () => {
               it('Creating book mark', () => {
                    return pactum.spec().post('/bookmark/create').withHeaders({ Authorization: `Bearer $S{userAt}` }).withBody(data).expectStatus(201).inspect();
               });

               it('Title should unique', () => {
                    return pactum.spec().post('/bookmark/create').withHeaders({ Authorization: `Bearer $S{userAt}` }).withBody({ data }).expectStatus(400).inspect();
               });
          });

          describe('Get Bookmark', () => {});

          describe('Get Detail bookmark', () => {});

          describe('Update Bookmark', () => {});

          describe('Delete bookmark', () => {});
     });
});
