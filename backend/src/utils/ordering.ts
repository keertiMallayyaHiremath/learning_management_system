export interface VideoWithOrder {
  id: bigint;
  sectionId: bigint;
  orderIndex: number;
  sectionOrderIndex: number;
}

export interface FlattenedVideo extends VideoWithOrder {
  previousVideoId: bigint | null;
  nextVideoId: bigint | null;
}

export function flattenVideos(sections: Array<{
  id: bigint;
  orderIndex: number;
  videos: Array<{
    id: bigint;
    orderIndex: number;
  }>;
}>): FlattenedVideo[] {
  const flattened: FlattenedVideo[] = [];
  
  const sortedSections = sections.sort((a, b) => a.orderIndex - b.orderIndex);
  
  for (const section of sortedSections) {
    const sortedVideos = section.videos.sort((a, b) => a.orderIndex - b.orderIndex);
    
    for (const video of sortedVideos) {
      flattened.push({
        id: video.id,
        sectionId: section.id,
        orderIndex: video.orderIndex,
        sectionOrderIndex: section.orderIndex,
        previousVideoId: null,
        nextVideoId: null,
      });
    }
  }
  
  for (let i = 0; i < flattened.length; i++) {
    flattened[i].previousVideoId = i > 0 ? flattened[i - 1].id : null;
    flattened[i].nextVideoId = i < flattened.length - 1 ? flattened[i + 1].id : null;
  }
  
  return flattened;
}

export function getPrerequisiteVideo(
  videoId: bigint,
  flattenedVideos: FlattenedVideo[]
): bigint | null {
  const video = flattenedVideos.find(v => v.id === videoId);
  return video?.previousVideoId || null;
}
