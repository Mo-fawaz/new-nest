import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-Comment.dto';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { GetUser } from 'src/auth/decorator/decorator.decorator';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('add-post')
  @UseGuards(JwtGuard)
  create(@GetUser('sub') MyID: number, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto, MyID);
  }

  @UseGuards(JwtGuard)
  @Post('add-comment')
  createComment(
    @GetUser('sub') MyID: number,
    @Body() CreateCommentDto: CreateCommentDto,
  ) {
    return this.postService.createComment(CreateCommentDto, MyID);
  }

  @UseGuards(JwtGuard)
  @Get('posts')
  findAll() {
    return this.postService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get('post/:id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch('update-post/:id')
  update(
    @GetUser('sub') MyID: number,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(+id, updatePostDto, MyID);
  }

  @UseGuards(JwtGuard)
  @Patch('update-comment/:id')
  updateComment(
    @GetUser('sub') MyId: number,
    @Param('id') id: number,
    @Body() UpdateCommentDto: UpdateCommentDto,
  ) {
    return this.postService.updateComment(+id, UpdateCommentDto, MyId);
  }

  @UseGuards(JwtGuard)
  @Delete('delete-post/:id')
  remove(@Param('id', ParseIntPipe) id: number, @GetUser('sub') MyId: number) {
    return this.postService.remove(+id, MyId);
  }

  @UseGuards(JwtGuard)
  @Delete('delete-comment/:id')
  delete(
    @Param('id', ParseIntPipe) commentId: number,
    @GetUser('sub') userId: number,
  ) {
    return this.postService.removeComment(commentId, userId);
  }
}
