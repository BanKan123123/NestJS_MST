import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import BookMarkDTO from './dto/bookmark.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class BookmarkService {
     constructor(private prisma: PrismaService) {}

     async getBookmarks() {
          try {
               const bookmarks = await this.prisma.bookMark.findMany({
                    include: {
                         user: true,
                    },
               });

               if (bookmarks.length === 0) {
                    throw new NotFoundError('No bookmarks found.');
               }
               return bookmarks;
          } catch (err) {
               console.error('Failed to retrieve bookmarks:', err);
               throw new BadGatewayException('An error occurred while retrieving bookmarks.');
          }
     }

     async getBookMarkById(bookmarkId: number) {
          try {
               const bookmark = await this.prisma.bookMark.findUnique({
                    where: { id: bookmarkId },
                    include: {
                         user: true,
                    },
               });

               if (!bookmark) {
                    throw new BadRequestException(`Bookmark with id ${bookmarkId} does not exist.`);
               }

               return bookmark;
          } catch (err) {
               console.error(`Failed to retrieve bookmark with id ${bookmarkId}:`, err);
               throw new BadGatewayException('An error occurred while retrieving the bookmark.');
          }
     }

     async addBookMark(bookMark: BookMarkDTO) {
          try {
               // Kiểm tra xem bookmark với title đã tồn tại chưa
               const existingBookMark = await this.prisma.bookMark.findUnique({
                    where: { title: bookMark.title },
               });

               if (existingBookMark) {
                    throw new BadRequestException('Bookmark with this title already exists');
               }

               // Nếu không tồn tại, tiến hành tạo mới bookmark
               const bookMarkDTO = await this.prisma.bookMark.create({
                    data: {
                         title: bookMark.title,
                         description: bookMark.description,
                         link: bookMark.link,
                         userId: bookMark.userId,
                    },
               });

               return bookMarkDTO;
          } catch (err) {
               throw err;
          }
     }

     async updateBookMark(bookMarkId: number, bookMark: BookMarkDTO) {
          try {
               // Kiểm tra xem bookmark có tồn tại không
               const existingBookMark = await this.prisma.bookMark.findUnique({ where: { id: bookMarkId } });
               if (!existingBookMark) {
                    throw new BadRequestException(`Bookmark with id ${bookMarkId} does not exist.`);
               }

               // Thực hiện cập nhật bookmark
               const bookMarkEdited = await this.prisma.bookMark.update({
                    where: { id: bookMarkId },
                    data: {
                         title: bookMark.title,
                         description: bookMark.description,
                         link: bookMark.link,
                    },
               });

               return bookMarkEdited;
          } catch (err) {
               console.error(`Failed to update bookmark with id ${bookMarkId}:`, err);
               throw new BadGatewayException('An error occurred while updating the bookmark.');
          }
     }

     async deleteBookMark(bookMarkId: number) {
          try {
               // Kiểm tra sự tồn tại của bookmark trước khi xóa
               const existingBookMark = await this.prisma.bookMark.findUnique({ where: { id: bookMarkId } });
               if (!existingBookMark) {
                    throw new BadRequestException(`Bookmark with id ${bookMarkId} does not exist.`);
               }

               // Xóa bookmark
               return await this.prisma.bookMark.delete({ where: { id: bookMarkId } });
          } catch (err) {
               console.error(`Failed to delete bookmark with id ${bookMarkId}:`, err);
               throw new BadGatewayException('An error occurred while deleting the bookmark.');
          }
     }
}
