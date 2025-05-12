"use client"
import { useState, useEffect } from 'react';
import styles from '@/app/styles/Stats.module.css';

const gradeMap = {
  "A": 4.0, "A-": 3.7, "B+": 3.5, "B": 3.0, "B-": 2.7,
  "C+": 2.5, "C": 2.0, "C-": 1.7, "D": 1.0, "F": 0.0
};

export default function StatsPage() {
  const [studentStats, setStudentStats] = useState([]);
  const [courseStats, setCourseStats] = useState([]);
  const [trendStats, setTrendStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/users.json');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        processData(data.students);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processData = (students) => {
    // Student stats calculations
    const totalStudents = students.length;
    let totalCompleted = 0, activeStudents = 0;
    let mostActive = { name: '', count: 0 };

    students.forEach(student => {
      const completed = student.completed || [];
      const inProgress = student.inProgress || [];
      const pending = student.pending || [];

      const total = completed.length + inProgress.length + pending.length;
      totalCompleted += completed.length;

      if (inProgress.length || pending.length) activeStudents++;
      if (total > mostActive.count) {
        mostActive = { name: student.name, count: total };
      }
    });

    const avgCompletedPerStudent = (totalCompleted / totalStudents).toFixed(2);

    // Course stats calculations
    const courseFreq = {
      completed: {}, inProgress: {}, pending: {}, gradeDist: {}, totalGrades: 0, gradeSum: 0
    };

    students.forEach(student => {
      (student.completed || []).forEach(c => {
        courseFreq.completed[c.course] = (courseFreq.completed[c.course] || 0) + 1;
        const grade = c.grade;
        if (grade in gradeMap) {
          courseFreq.gradeDist[grade] = (courseFreq.gradeDist[grade] || 0) + 1;
          courseFreq.totalGrades++;
          courseFreq.gradeSum += gradeMap[grade];
        }
      });

      (student.inProgress || []).forEach(c => {
        courseFreq.inProgress[c] = (courseFreq.inProgress[c] || 0) + 1;
      });

      (student.pending || []).forEach(c => {
        courseFreq.pending[c] = (courseFreq.pending[c] || 0) + 1;
      });
    });

    const mostFrequentCourse = (freqMap) => {
      return Object.entries(freqMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    };

    const avgGrade = (courseFreq.gradeSum / courseFreq.totalGrades).toFixed(2);
    const totalInProgress = Object.values(courseFreq.inProgress).reduce((a, b) => a + b, 0);
    const totalPending = Object.values(courseFreq.pending).reduce((a, b) => a + b, 0);
    const courseCompletionRate = ((totalCompleted / (totalCompleted + totalInProgress + totalPending)) * 100).toFixed(2);

    // Set state for rendering
    setStudentStats([
      { title: 'Total Number of Students', value: totalStudents },
      { title: 'Average Completed Courses per Student', value: avgCompletedPerStudent },
      { title: 'Active Students', value: activeStudents },
      { title: 'Most Active Student', value: mostActive.name }
    ]);

    setCourseStats([
      { title: 'Most Completed Course', value: mostFrequentCourse(courseFreq.completed) },
      { title: 'Most In-Progress Course', value: mostFrequentCourse(courseFreq.inProgress) },
      { title: 'Most Pending Course', value: mostFrequentCourse(courseFreq.pending) },
      { title: 'Average Grade (GPA)', value: avgGrade }
    ]);

    setTrendStats([
      { title: 'Course Completion Rate', value: `${courseCompletionRate}%` },
      { 
        title: 'Grade Distribution', 
        value: Object.entries(courseFreq.gradeDist).map(([grade, count]) => (
          <div key={grade}>{grade}: {count}</div>
        ))
      }
    ]);
  };

  if (error) {
    return (
      <h1 style={{ textAlign: 'center' }}>
        Error loading data. Please check users.json.
      </h1>
    );
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>📊 Student & Course Statistics</h1>
      
      <h2>🎓 Student-Centric Stats</h2>
      <div className={styles.statsContainer}>
        {studentStats.map((stat, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.statTitle}>{stat.title}</div>
            <div className={styles.statValue}>{stat.value}</div>
          </div>
        ))}
      </div>

      <h2>📘 Course-Centric Stats</h2>
      <div className={styles.statsContainer}>
        {courseStats.map((stat, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.statTitle}>{stat.title}</div>
            <div className={styles.statValue}>{stat.value}</div>
          </div>
        ))}
      </div>

      <h2>📈 Performance & Trends</h2>
      <div className={styles.statsContainer}>
        {trendStats.map((stat, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.statTitle}>{stat.title}</div>
            <div className={styles.statValue}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}