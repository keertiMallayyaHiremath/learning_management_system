import { prisma } from '../../config/db';

export class ProgressRepository {
  async getSubjectProgress(subjectId: bigint, userId: bigint) {
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        sections: {
          include: {
            videos: {
              include: {
                videoProgress: {
                  where: { userId },
                  select: {
                    lastPositionSeconds: true,
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

    let totalVideos = 0;
    let completedVideos = 0;
    let lastVideoId: bigint | null = null;
    let lastPositionSeconds = 0;

    for (const section of subject.sections) {
      for (const video of section.videos) {
        totalVideos++;
        const progress = video.videoProgress[0];
        if (progress?.isCompleted) {
          completedVideos++;
        }
        if (progress && progress.lastPositionSeconds > lastPositionSeconds) {
          lastPositionSeconds = progress.lastPositionSeconds;
          lastVideoId = video.id;
        }
      }
    }

    return {
      totalVideos,
      completedVideos,
      percentComplete: totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0,
      lastVideoId,
      lastPositionSeconds,
    };
  }

  async getSubjectProgressSummary(subjectId: bigint, userId: bigint) {
    const progress = await this.getSubjectProgress(subjectId, userId);
    if (!progress) return null;

    return {
      total_videos: progress.totalVideos,
      completed_videos: progress.completedVideos,
      percent_complete: progress.percentComplete,
      last_video_id: progress.lastVideoId,
      last_position_seconds: progress.lastPositionSeconds,
    };
  }
}
