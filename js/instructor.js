document.addEventListener('DOMContentLoaded', async () => {
    const classesContainer = document.getElementById('classesContainer');
    const searchInput = document.getElementById('searchInput');
    let classes = [];

    try {
        const response = await fetch('users.json');
        const usersData = await response.json();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
       
        const instructor = usersData.instructors.find(
            i => i.username === currentUser.username
        );
        
        if (instructor) {
            classes = instructor.classes;
            displayClasses(classes);
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredClasses = classes.filter(course => 
            course.name.toLowerCase().includes(searchTerm) ||
            course.students.some(s => s.name.toLowerCase().includes(searchTerm))
        );
        displayClasses(filteredClasses);
    });

    function displayClasses(classes) {
        classesContainer.innerHTML = classes.map(cls => `
            <div class="class-card">
                <h3 class="class-title">${cls.name}</h3>
                <div class="students-list">
                    ${cls.students.map(student => `
                        <div class="student-item">
                            <span>${student.name}</span>
                            <input type="number" 
                                   class="grade-input" 
                                   min="0" 
                                   max="100"
                                   value="${student.grade || ''}"
                                   placeholder="Grade"
                                   data-student-id="${student.id}">
                        </div>
                    `).join('')}
                </div>
                <button class="submit-btn" onclick="submitGrades('${cls.id}')">Submit Grades</button>
                <div class="submit-feedback" id="feedback-${cls.id}">Grades submitted successfully!</div>
            </div>
        `).join('');
    }

    window.submitGrades = function(classId) {
        const feedback = document.getElementById(`feedback-${classId}`);
        feedback.style.display = 'block';
        setTimeout(() => feedback.style.display = 'none', 2000);
        
        
        console.log('Grades submitted for class:', classId);
    }

    
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    
    localStorage.removeItem('currentUser');
    
    window.location.href = 'index.html';
});

