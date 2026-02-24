import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-Comment.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePostDto, myId: number) {
    if (!myId) throw new UnauthorizedException();
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // إنشاء البوست
        const post = await tx.post.create({
          data: {
            title: dto.title,
            content: dto.content,
            authorId: myId,
          },
        });

        if (dto.images?.length) {
          await tx.postImage.createMany({
            data: dto.images.map((image) => ({
              url: image.url,
              caption: image.caption,
              postId: post.id,
            })),
          });
        }

        return post;
      });

      return {
        message: 'Post created successfully',
        data: result,
      };
    } catch (error) {
      throw new Error('Failed to create post with images');
    }
  }

  async createComment(dto: CreateCommentDto, myID: number) {
    if (!myID) throw new UnauthorizedException();

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        postId: dto.postId,
        authorId: myID,
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },

        _count: {
          select: {
            comments: true,
            images: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
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
            name: true,
          },
        },
        images: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },

          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async update(id: number, dto: UpdatePostDto, myId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: id },
      include: { images: true },
    });

    if (!post) throw new NotFoundException();

    if (post.authorId !== myId) throw new ForbiddenException();

    return this.prisma.$transaction(async (tx) => {
      await tx.post.update({
        where: { id: id },
        data: {
          title: dto.title,
          content: dto.content,
        },
      });
      if (dto.images?.length) {
        const incomingIds = dto.images
          .map((img) => img.id)
          .filter((id): id is number => id !== undefined);

        await tx.postImage.deleteMany({
          where: {
            postId: id,
            id: {
              notIn: incomingIds.length ? incomingIds : [],
            },
          },
        });

        for (const img of dto.images) {
          if (img.id) {
            await tx.postImage.update({
              where: { id: img.id },
              data: {
                url: img.url,
                caption: img.caption,
              },
            });
          } else {
            await tx.postImage.create({
              data: {
                url: img.url,
                caption: img.caption,
                postId: id,
              },
            });
          }
        }
      }
      return tx.post.findUnique({
        where: { id: id },
        include: {
          images: true,
        },
      });
    });
  }

  async updateComment(commentId: number, dto: UpdateCommentDto, myId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException();

    if (comment.authorId !== myId) throw new ForbiddenException();

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content: dto.content },
    });
  }

  async findByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: {
        postId,
      },

      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async remove(postId: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new NotFoundException('Post not found');

    if (post.authorId !== userId)
      throw new ForbiddenException('You cannot delete this post');

    await this.prisma.post.delete({
      where: { id: postId },
    });

    return {
      message: 'Post deleted successfully',
    };
  }

  async removeComment(commentId: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.authorId !== userId)
      throw new ForbiddenException('You cannot delete this comment');

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return {
      message: 'Comment deleted successfully',
    };
  }
}
