import { prisma } from '../../config/db';
import { flattenVideos } from '../../utils/ordering';

export class VideoRepository {
  async findById(videoId: bigint, userId: bigint) {
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        section: {
          include: {
            subject: true,
          },
        },
        videoProgress: {
          where: { userId },
          select: {
            lastPositionSeconds: true,
            isCompleted: true,
          },
        },
      },
    });

    if (!video) return null;

    const subjectTree = await prisma.subject.findUnique({
      where: { id: video.section.subjectId },
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

    const flattenedVideos = flattenVideos(subjectTree?.sections || []);
    const currentVideoIndex = flattenedVideos.findIndex(v => v.id === videoId);
    
    let locked = false;
    let unlockReason = '';
    
    if (currentVideoIndex > 0) {
      const previousVideoId = flattenedVideos[currentVideoIndex - 1].id;
      const previousVideo = flattenedVideos.find(v => v.id === previousVideoId);
      
      const previousVideoProgress = await prisma.videoProgress.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId: previousVideoId,
          },
        },
      });
      
      if (!previousVideoProgress?.isCompleted) {
        locked = true;
        unlockReason = 'Previous video must be completed first';
      }
    }

    return {
      id: video.id,
      title: video.title,
      description: video.description,
      youtubeUrl: `https://www.youtube.com/watch?v=${video.youtubeVideoId}`,
      youtubeVideoId: video.youtubeVideoId,
      orderIndex: video.orderIndex,
      durationSeconds: video.durationSeconds,
      sectionId: video.sectionId,
      sectionTitle: video.section.title,
      subjectId: video.section.subjectId,
      subjectTitle: video.section.subject.title,
      previousVideoId: currentVideoIndex > 0 ? flattenedVideos[currentVideoIndex - 1].id : null,
      nextVideoId: currentVideoIndex < flattenedVideos.length - 1 ? flattenedVideos[currentVideoIndex + 1].id : null,
      locked,
      unlockReason,
      lastPositionSeconds: video.videoProgress[0]?.lastPositionSeconds || 0,
      isCompleted: video.videoProgress[0]?.isCompleted || false,
    };
  }

  async updateProgress(
    userId: bigint,
    videoId: bigint,
    lastPositionSeconds: number,
    isCompleted: boolean
  ) {
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: { durationSeconds: true },
    });

    if (!video) {
      throw new Error('Video not found');
    }

    if (lastPositionSeconds < 0 || lastPositionSeconds > (video.durationSeconds || 0)) {
      throw new Error('Invalid position');
    }

    return prisma.videoProgress.upsert({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
      update: {
        lastPositionSeconds,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
      },
      create: {
        userId,
        videoId,
        lastPositionSeconds,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
      },
    });
  }

  async getProgress(userId: bigint, videoId: bigint) {
    const progress = await prisma.videoProgress.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
      select: {
        lastPositionSeconds: true,
        isCompleted: true,
      },
    });

    return progress || { lastPositionSeconds: 0, isCompleted: false };
  }
}
