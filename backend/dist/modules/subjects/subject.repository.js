"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectRepository = void 0;
const db_1 = require("../../config/db");
class SubjectRepository {
    async findAll(page = 1, pageSize = 10, query) {
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
            db_1.prisma.subject.findMany({
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
            db_1.prisma.subject.count({ where }),
        ]);
        return {
            subjects,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }
    async findById(subjectId) {
        return db_1.prisma.subject.findUnique({
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
    async findSubjectTree(subjectId, userId) {
        const subject = await db_1.prisma.subject.findUnique({
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
        if (!subject)
            return null;
        const flattenedVideos = [];
        const sortedSections = subject.sections.sort((a, b) => a.orderIndex - b.orderIndex);
        for (const section of sortedSections) {
            const sortedVideos = section.videos.sort((a, b) => a.orderIndex - b.orderIndex);
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
        const sectionsWithVideos = subject.sections.map((section, sectionIndex) => {
            const sectionStartIndex = flattenedVideos.findIndex((video) => video.sectionId === section.id);
            const sectionVideos = section.videos.map((video, videoIndex) => {
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
    async getFirstUnlockedVideo(subjectId, userId) {
        const subjectTree = await this.findSubjectTree(subjectId, userId);
        if (!subjectTree)
            return null;
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
exports.SubjectRepository = SubjectRepository;
