"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenVideos = flattenVideos;
exports.getPrerequisiteVideo = getPrerequisiteVideo;
function flattenVideos(sections) {
    const flattened = [];
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
function getPrerequisiteVideo(videoId, flattenedVideos) {
    const video = flattenedVideos.find(v => v.id === videoId);
    return video?.previousVideoId || null;
}
