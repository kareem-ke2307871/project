document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('users.json');
        const userData = await response.json();

        
        const validUser = [
            ...userData.students.map(u => ({...u, role: 'student'})),
            ...userData.instructors.map(u => ({...u, role: 'instructor'})),
            ...userData.admins.map(u => ({...u, role: 'admin'}))
        ].find(user => 
            user.username === username && 
            user.password === password
        );

        if (validUser) {
            
            localStorage.setItem('currentUser', JSON.stringify(validUser));
            
            
            switch(validUser.role) {
                case 'student':
                    window.location.href = 'main.html';
                    break;
                case 'instructor':
                    window.location.href = 'instructor_dashboard.html';
                    break;
                case 'admin':
                    window.location.href = 'admin_dashboard.html';
                    break;
                default:
                    throw new Error('Unknown user role');
            }
        } else {
            document.getElementById('error-message').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error-message').style.display = 'block';
    }
});

