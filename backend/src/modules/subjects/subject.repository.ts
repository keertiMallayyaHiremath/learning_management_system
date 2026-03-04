import { prisma } from '../../config/db';

export class SubjectRepository {
  async findAll(page: number = 1, pageSize: number = 10, query?: string) {
    const skip = (page - 1) * pageSize;
    const where = {
      isPublished: true,
      ...(query && {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      }),
    };

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              sections: {
                where: {
                  videos: {
                    some: {}
                  }
                }
              }
            }
          }
        },
      }),
      prisma.subject.count({ where }),
    ]);

    return {
      subjects,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(subjectId: bigint) {
    return prisma.subject.findUnique({
      where: { id: subjectId },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findSubjectTree(subjectId: bigint, userId: bigint) {
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            videos: {
              orderBy: { orderIndex: 'asc' },
              include: {
                videoProgress: {
                  where: { userId },
                  select: {
                    isCompleted: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!subject) return null;

    const flattenedVideos: any[] = [];
    const sortedSections = subject.sections.sort((a: any, b: any) => a.orderIndex - b.orderIndex);

    for (const section of sortedSections) {
      const sortedVideos = section.videos.sort((a: any, b: any) => a.orderIndex - b.orderIndex);
      for (const video of sortedVideos) {
        flattenedVideos.push({
          ...video,
          sectionId: section.id,
          isCompleted: video.videoProgress[0]?.isCompleted || false,
        });
      }
    }

    for (let i = 0; i < flattenedVideos.length; i++) {
      flattenedVideos[i].locked = i > 0 && !flattenedVideos[i - 1].isCompleted;
    }

    const sectionsWithVideos = subject.sections.map((section: any, sectionIndex: any) => {
      const sectionStartIndex = flattenedVideos.findIndex(
        (video) => video.sectionId === section.id
      );
      const sectionVideos = section.videos.map((video: any, videoIndex: any) => {
        const globalIndex = sectionStartIndex + videoIndex;
        return {
          id: video.id,
          title: video.title,
          orderIndex: video.orderIndex,
          isCompleted: video.videoProgress[0]?.isCompleted || false,
          locked: flattenedVideos[globalIndex]?.locked || false,
        };
      });

      return {
        id: section.id,
        title: section.title,
        orderIndex: section.orderIndex,
        videos: sectionVideos,
      };
    });

    return {
      id: subject.id,
      title: subject.title,
      sections: sectionsWithVideos,
    };
  }

  async getFirstUnlockedVideo(subjectId: bigint, userId: bigint) {
    const subjectTree = await this.findSubjectTree(subjectId, userId);
    if (!subjectTree) return null;

    for (const section of subjectTree.sections) {
      for (const video of section.videos) {
        if (!video.locked) {
          return video.id;
        }
      }
    }

    return null;
  }
}
