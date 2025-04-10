
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const learningPathBtn = document.getElementById('learningPathBtn');
const learningPathSidebar = document.getElementById('learningPathSidebar');
const mainContainer = document.querySelector('.main-container');


function toggleButtonVisibility(visible) {
    const btn = document.getElementById('learningPathBtn');
    btn.classList.toggle('visible', visible);
    btn.classList.toggle('hidden', !visible);
}

if (currentUser?.role === 'student') {
    toggleButtonVisibility(true);
}


if (currentUser?.role === 'student') {
    learningPathBtn.style.display = 'block';

    learningPathBtn.addEventListener('click', () => {
        learningPathSidebar.classList.add('active');
        mainContainer.classList.add('sidebar-open');
        toggleButtonVisibility(false);
        populateLearningPath();
    });
      
}else {
    learningPathBtn.style.display = 'none';
}

document.getElementById('closeSidebar').addEventListener('click', () => {
    learningPathSidebar.classList.remove('active');
    mainContainer.classList.remove('sidebar-open');
    toggleButtonVisibility(true);
});

document.addEventListener('click', (e) => {
    if (learningPathSidebar.classList.contains('active') &&
        !learningPathSidebar.contains(e.target) &&
        e.target !== learningPathBtn) {
        learningPathSidebar.classList.remove('active');
        mainContainer.classList.remove('sidebar-open');
        toggleButtonVisibility(true);
    }
});

function populateLearningPath() {
    const studentData = currentUser;
    
    
    document.getElementById('completedCourses').innerHTML = studentData.completed
        .map(course => `
            <div class="course-item completed">
                ${course.course} - Grade: ${course.grade}
            </div>
        `).join('');
    
    
    document.getElementById('inProgressCourses').innerHTML = studentData.inProgress
        .map(course => `
            <div class="course-item in-progress">
                ${course}
            </div>
        `).join('');
    
    
    document.getElementById('pendingCourses').innerHTML = studentData.pending
        .map(course => `
            <div class="course-item pending">
                ${course}
            </div>
        `).join('');
}


document.addEventListener('DOMContentLoaded', async () => {
    const coursesContainer = document.getElementById('coursesContainer');
    const searchInput = document.getElementById('searchInput');

    
    let courses = [];
    
    try {
        const response = await fetch('courses.json');
        courses = await response.json();
        displayCourses(courses);
    } catch (error) {
        console.error('Error loading courses:', error);
    }

    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCourses = courses.filter(course => 
            course.name.toLowerCase().includes(searchTerm) ||
            course.category.toLowerCase().includes(searchTerm)
        );
        displayCourses(filteredCourses);
    });

    function displayCourses(courses) {
        coursesContainer.innerHTML = courses.map(course => `
            <div class="course-card">
                <div class="course-category">${course.category}</div>
                <h3 class="course-name">${course.name}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-duration">Duration: ${course.duration}</div>
            </div>
        `).join('');
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    // Clear user session
    localStorage.removeItem('currentUser');
    // Redirect to login page
    window.location.href = 'index.html';
});