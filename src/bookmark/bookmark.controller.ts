import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import BookMarkDTO from './dto/bookmark.dto';
import { RefreshTokenInterceptor } from '../auth/interceptor/refresh-token.interceptor';

@UseGuards(JwtGuard)
@UseInterceptors(RefreshTokenInterceptor)
@Controller('bookmark')
export class BookmarkController {
     constructor(private bookMarkService: BookmarkService) {}

     @Get('get')
     listBookmarks() {
          return this.bookMarkService.getBookmarks();
     }

     @Get('get/:id')
     getBookMardById(@Param('id', ParseIntPipe) bookMarkId: number) {
          return this.bookMarkService.getBookMarkById(bookMarkId);
     }

     @Post('create')
     createBookMark(@Body() bookMark: BookMarkDTO) {
          return this.bookMarkService.addBookMark(bookMark);
     }

     @Patch('update/:id')
     updateBookMard(@Param('id', ParseIntPipe) bookMarkId: number, @Body() bookMark: BookMarkDTO) {
          return this.bookMarkService.updateBookMark(bookMarkId, bookMark);
     }

     @Delete('delete/:id')
     deleteBookMark(@Param('id', ParseIntPipe) bookMarkId: number) {
          return this.bookMarkService.deleteBookMark(bookMarkId);
     }
}
