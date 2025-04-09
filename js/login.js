document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('users.json');
        const users = await response.json();

        const validUser = users.find(user => 
            user.username === username && user.password === password
        );

        if (validUser) {
            window.location.href = 'main.html';
        } else {
            document.getElementById('error-message').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error-message').style.display = 'block';
    }
});
