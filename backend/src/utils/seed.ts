import { PrismaClient } from '@prisma/client';
import { hashPassword } from './password';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.com' },
    update: {},
    create: {
      email: 'admin@lms.com',
      passwordHash: adminPassword,
      name: 'Admin User',
    },
  });

  // Create test user
  const testPassword = await hashPassword('test123');
  const testUser = await prisma.user.upsert({
    where: { email: 'test@lms.com' },
    update: {},
    create: {
      email: 'test@lms.com',
      passwordHash: testPassword,
      name: 'Test User',
    },
  });

  console.log('Created users:', { admin, testUser });

  // Create subjects
  const javascriptSubject = await prisma.subject.upsert({
    where: { slug: 'javascript-basics' },
    update: {},
    create: {
      title: 'JavaScript Basics',
      slug: 'javascript-basics',
      description: 'Learn the fundamentals of JavaScript programming',
      isPublished: true,
    },
  });

  const reactSubject = await prisma.subject.upsert({
    where: { slug: 'react-development' },
    update: {},
    create: {
      title: 'React Development',
      slug: 'react-development',
      description: 'Master React.js and build modern web applications',
      isPublished: true,
    },
  });

  console.log('Created subjects:', { javascriptSubject, reactSubject });

  // Create sections for JavaScript
  const jsSection1 = await prisma.section.create({
    data: {
      subjectId: javascriptSubject.id,
      title: 'Introduction to JavaScript',
      orderIndex: 1,
    },
  });

  const jsSection2 = await prisma.section.create({
    data: {
      subjectId: javascriptSubject.id,
      title: 'JavaScript Fundamentals',
      orderIndex: 2,
    },
  });

  // Create sections for React
  const reactSection1 = await prisma.section.create({
    data: {
      subjectId: reactSubject.id,
      title: 'React Basics',
      orderIndex: 1,
    },
  });

  const reactSection2 = await prisma.section.create({
    data: {
      subjectId: reactSubject.id,
      title: 'Advanced React',
      orderIndex: 2,
    },
  });

  console.log('Created sections');

  // Create videos for JavaScript
  await prisma.video.createMany({
    data: [
      {
        sectionId: jsSection1.id,
        title: 'What is JavaScript?',
        description: 'Introduction to JavaScript and its role in web development',
        youtubeVideoId: 'xnOwOBYaA3w',
        orderIndex: 1,
        durationSeconds: 600,
      },
      {
        sectionId: jsSection1.id,
        title: 'Setting Up Development Environment',
        description: 'How to set up your JavaScript development environment',
        youtubeVideoId: 'Qyw1Q8BqGmM',
        orderIndex: 2,
        durationSeconds: 480,
      },
      {
        sectionId: jsSection2.id,
        title: 'Variables and Data Types',
        description: 'Understanding variables, let, const, and data types in JavaScript',
        youtubeVideoId: 'ZVnjOPwW4ZA',
        orderIndex: 1,
        durationSeconds: 720,
      },
      {
        sectionId: jsSection2.id,
        title: 'Functions and Scope',
        description: 'Learn about functions, parameters, and scope in JavaScript',
        youtubeVideoId: 'N8ap4k_1QEQ',
        orderIndex: 2,
        durationSeconds: 900,
      },
    ],
  });

  // Create videos for React
  await prisma.video.createMany({
    data: [
      {
        sectionId: reactSection1.id,
        title: 'Introduction to React',
        description: 'What is React and why should you use it?',
        youtubeVideoId: 'Ke90Tje7VS0',
        orderIndex: 1,
        durationSeconds: 540,
      },
      {
        sectionId: reactSection1.id,
        title: 'Creating Your First React App',
        description: 'Step-by-step guide to creating your first React application',
        youtubeVideoId: 'Tn6-PIqc4UM',
        orderIndex: 2,
        durationSeconds: 840,
      },
      {
        sectionId: reactSection2.id,
        title: 'React Hooks Deep Dive',
        description: 'Understanding useState, useEffect, and custom hooks',
        youtubeVideoId: 'TNhaISOUy6Q',
        orderIndex: 1,
        durationSeconds: 1200,
      },
      {
        sectionId: reactSection2.id,
        title: 'State Management with Context',
        description: 'Learn how to manage state using React Context API',
        youtubeVideoId: '35lXWvLiMjc',
        orderIndex: 2,
        durationSeconds: 960,
      },
    ],
  });

  console.log('Created videos');

  // Create enrollments for test user
  await prisma.enrollment.createMany({
    data: [
      {
        userId: testUser.id,
        subjectId: javascriptSubject.id,
      },
      {
        userId: testUser.id,
        subjectId: reactSubject.id,
      },
    ],
  });

  console.log('Created enrollments');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });