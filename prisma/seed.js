import { PrismaClient } from '@prisma/client';
import fs from 'fs-extra';
import path from 'path';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding started...');

  // Load JSON files
  const studentsPath = path.join(process.cwd(), 'data/users.json');
  const coursesPath = path.join(process.cwd(), 'data/courses.json');

  const studentsData = await fs.readJSON(studentsPath);
  const coursesData = await fs.readJSON(coursesPath);

  await prisma.pendingCourse.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.completedCourse.deleteMany();
  await prisma.user.deleteMany();
  await prisma.course.deleteMany();


  // Seed courses and map them by name
  const courseMap = {};
  for (const course of coursesData) {
    const created = await prisma.course.upsert({
      where: { name: course.name },
      update: {},
      create: course,
    });
    courseMap[course.name] = created;
  }

  // Seed users and their course relations
  for (const student of studentsData.students) {
    const createdUser = await prisma.user.create({
      data: {
        username: student.username,
        password: student.password,
        name: student.name,
      },
    });

    // Completed courses
    for (const completed of student.completed) {
      const course = courseMap[completed.course];
      if (course) {
        await prisma.completedCourse.create({
          data: {
            studentId: createdUser.id,
            courseId: course.id,
            grade: completed.grade,
          },
        });
      }
    }

    // In-progress courses
    for (const courseName of student.inProgress) {
      const course = courseMap[courseName];
      if (course) {
        await prisma.courseEnrollment.create({
          data: {
            studentId: createdUser.id,
            courseId: course.id,
          },
        });
      }
    }

    // Pending courses
    for (const courseName of student.pending) {
      const course = courseMap[courseName];
      if (course) {
        await prisma.pendingCourse.create({
          data: {
            studentId: createdUser.id,
            courseId: course.id,
          },
        });
      }
    }
  }

  console.log('Seeding complete.');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error('Seeding error:', e);
  prisma.$disconnect();
});
