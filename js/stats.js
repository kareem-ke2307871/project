const gradeMap = {
    "A": 4.0, "A-": 3.7, "B+": 3.5, "B": 3.0, "B-": 2.7,
    "C+": 2.5, "C": 2.0, "C-": 1.7, "D": 1.0, "F": 0.0
  };
  
  fetch('users.json')
    .then(res => res.json())
    .then(data => {
      const students = data.students; 
  
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
  
      function mostFrequentCourse(freqMap) {
        return Object.entries(freqMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
      }
  
      const avgGrade = (courseFreq.gradeSum / courseFreq.totalGrades).toFixed(2);
  
      const totalInProgress = Object.values(courseFreq.inProgress).reduce((a, b) => a + b, 0);
      const totalPending = Object.values(courseFreq.pending).reduce((a, b) => a + b, 0);
      const courseCompletionRate = ((totalCompleted / (totalCompleted + totalInProgress + totalPending)) * 100).toFixed(2);
  
      const studentStats = `
        <div class="card"><div class="stat-title">Total Number of Students</div><div class="stat-value">${totalStudents}</div></div>
        <div class="card"><div class="stat-title">Average Completed Courses per Student</div><div class="stat-value">${avgCompletedPerStudent}</div></div>
        <div class="card"><div class="stat-title">Active Students</div><div class="stat-value">${activeStudents}</div></div>
        <div class="card"><div class="stat-title">Most Active Student</div><div class="stat-value">${mostActive.name}</div></div>
      `;
  
      const courseStats = `
        <div class="card"><div class="stat-title">Most Completed Course</div><div class="stat-value">${mostFrequentCourse(courseFreq.completed)}</div></div>
        <div class="card"><div class="stat-title">Most In-Progress Course</div><div class="stat-value">${mostFrequentCourse(courseFreq.inProgress)}</div></div>
        <div class="card"><div class="stat-title">Most Pending Course</div><div class="stat-value">${mostFrequentCourse(courseFreq.pending)}</div></div>
        <div class="card"><div class="stat-title">Average Grade (GPA)</div><div class="stat-value">${avgGrade}</div></div>
      `;
  
      let gradeDistHTML = '';
      for (const [grade, count] of Object.entries(courseFreq.gradeDist)) {
        gradeDistHTML += `<div>${grade}: ${count}</div>`;
      }
  
      const trendStats = `
        <div class="card"><div class="stat-title">Course Completion Rate</div><div class="stat-value">${courseCompletionRate}%</div></div>
        <div class="card"><div class="stat-title">Grade Distribution</div>${gradeDistHTML}</div>
      `;
  
      document.getElementById('studentStats').innerHTML = studentStats;
      document.getElementById('courseStats').innerHTML = courseStats;
      document.getElementById('trendStats').innerHTML = trendStats;
    })
    .catch(error => {
      console.error('Error loading data:', error);
      document.body.innerHTML = "<h1 style='text-align:center;'>Error loading data. Please check users.json.</h1>";
    });
  