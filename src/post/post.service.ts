import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-Comment.dto';

@Injectable()
export class PostService {
  constructor(
      private readonly prisma: PrismaService,
    ) {}

  async create(dto: CreatePostDto, myId: number) {

  if (!myId)
    throw new UnauthorizedException();

  return this.prisma.post.create({
    data: {
      title: dto.title,
      content: dto.content,
      authorId: myId
    }
  });

}
async createComment(dto: CreateCommentDto, myID: number) {


  if (!myID)
    throw new UnauthorizedException();

  return this.prisma.comment.create({
    data: {
      content: dto.content,
      postId: dto.postId,
      authorId: myID
    }
  });

}

async findAll() {

  return this.prisma.post.findMany({

    include: {

      author: {
        select: {
          id: true,
          email: true,
          name: true
        }
      },

      _count: {
        select: {
          comments: true
        }
      }

    },

    orderBy: {
      createdAt: 'desc'
    }

  });

}

async findOne(postId: number) {

  return this.prisma.post.findUnique({
    where: { id: postId },

    include: {
      author: {
        select: {
          id: true,
          email: true,
          name: true
        }
      },

      comments: {
        include: {
          author: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        },

        orderBy: {
          createdAt: 'desc'
        }
      }

    }

  });

}

  async update(id: number, dto: UpdatePostDto, myId: number) {

  const post = await this.prisma.post.findUnique({
    where: { id: id }
  });

  if (!post)
    throw new NotFoundException();

  if (post.authorId !== myId)
    throw new ForbiddenException('You cannot edit this post');

  return this.prisma.post.update({
    where: { id: id },
    data: {
      title: dto.title,
      content: dto.content
    }
  });
  }
  async updateComment(commentId: number, dto: UpdateCommentDto, myId: number) {


  const comment = await this.prisma.comment.findUnique({
    where: { id: commentId }
  });

  if (!comment)
    throw new NotFoundException();

  if (comment.authorId !== myId)
    throw new ForbiddenException();

  return this.prisma.comment.update({
    where: { id: commentId },
    data: { content: dto.content }
  });

}
async findByPost(postId: number) {

  return this.prisma.comment.findMany({
    where: {
      postId
    },

    include: {
      author: {
        select: {
          id: true,
          email: true,
          name: true
        }
      }
    },

    orderBy: {
      createdAt: 'desc'
    }

  });

}


  async remove(postId: number, userId: number) {

    const post = await this.prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post)
      throw new NotFoundException('Post not found');

    if (post.authorId !== userId)
      throw new ForbiddenException('You cannot delete this post');

    await this.prisma.post.delete({
      where: { id: postId }
    });

    return {
      message: 'Post deleted successfully'
    };

  }
  async removeComment(commentId: number, userId: number) {

    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment)
      throw new NotFoundException('Comment not found');

    if (comment.authorId !== userId)
      throw new ForbiddenException('You cannot delete this comment');

    await this.prisma.comment.delete({
      where: { id: commentId }
    });

    return {
      message: 'Comment deleted successfully'
    };

  }

  
}
