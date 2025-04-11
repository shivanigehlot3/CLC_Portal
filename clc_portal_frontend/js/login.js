console.log("Script Loaded!");

const BASE_URL = "http://localhost:9091";

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginLink = document.getElementById('loginLink');
const registerLink = document.getElementById('registerLink');

const registerRole = document.getElementById('registerRole');
const loginRole = document.getElementById('loginRole');

const registerIdentifierInput = document.getElementById('registerIdentifierInput');
const loginIdentifierInput = document.getElementById('loginIdentifierInput');

const studentFields = document.getElementById('studentFields');
const officerAdminFields = document.getElementById('officerAdminFields');

const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');
const closePopup = document.getElementById('closePopup');

function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = 'flex';
}

closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
});

registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
});

registerRole.addEventListener('change', () => {
    const role = registerRole.value;

    if (role === 'student') {
        studentFields.style.display = 'block';
        officerAdminFields.style.display = 'none';

        studentFields.querySelectorAll('input, select').forEach(field => field.setAttribute('required', 'required'));
        officerAdminFields.querySelectorAll('input, select').forEach(field => field.removeAttribute('required'));

        registerIdentifierInput.placeholder = 'Roll Number';
    } else {
        studentFields.style.display = 'none';
        officerAdminFields.style.display = 'block';

        officerAdminFields.querySelectorAll('input, select').forEach(field => field.setAttribute('required', 'required'));
        studentFields.querySelectorAll('input, select').forEach(field => field.removeAttribute('required'));

        registerIdentifierInput.placeholder = 'Username';
    }
});

loginRole.addEventListener('change', () => {
    if (loginRole.value === 'student') {
        loginIdentifierInput.placeholder = 'Roll Number';
    } else {
        loginIdentifierInput.placeholder = 'Username';
    }
});


registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Register Button Clicked!");

    const role = registerRole.value;
    const identifier = registerIdentifierInput.value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
        showPopup('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.');
        return;
    }

    if (password !== confirmPassword) {
        showPopup('Passwords do not match. Please try again.');
        return;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    const phonePattern = /^[6-9]\d{9}$/;
    if (role === "student") {
        const email = document.getElementById("registerEmail").value;
        const phone = document.getElementById("registerPhoneNumber").value;

        if (!email.match(emailPattern)) {
            e.preventDefault();
            showPopup("Please enter a valid student email address.");
            return;
        }

        if (!phone.match(phonePattern)) {
            e.preventDefault();
            showPopup("Please enter a valid student 10-digit phone number.");
            return;
        }

    } else if (role === "officer") {
        const email = document.getElementById("officerEmail").value;
        const phone = document.getElementById("officerPhoneNumber").value;

        if (!email.match(emailPattern)) {
            e.preventDefault();
            showPopup("Please enter a valid officer email address.");
            return;
        }

        if (!phone.match(phonePattern)) {
            e.preventDefault();
            showPopup("Please enter a valid officer 10-digit phone number.");
            return;
        }
    }

    let registerData = {};

    if (role === 'student') {
        registerData = {
            rollNumber: identifier,
            password,
            name: document.getElementById('registerName').value,
            branch: document.getElementById("registerBranch").value,
            rank: parseInt(document.getElementById('registerRank').value),
            email: document.getElementById('registerEmail').value,
            phoneNumber: document.getElementById('registerPhoneNumber').value,
            address: document.getElementById('registerAddress').value,
            fatherName: document.getElementById('registerFatherName').value,
            dob: document.getElementById('registerDob').value
        };
    } else {
        registerData = {
            username: identifier,
            password,
            name: document.getElementById('officerName').value,
            email: document.getElementById('officerEmail').value,
            phoneNumber: document.getElementById('officerPhoneNumber').value
        };
    }

    console.log("Register Data:", registerData);

    let registerEndpoint = `${BASE_URL}/students/register`;
    if (role === 'officer') {
        registerEndpoint = `${BASE_URL}/admin/officer/register`;
    } else if (role === 'admin') {
        registerEndpoint = `${BASE_URL}/admin/register`;
    }

    try {
        const response = await fetch(registerEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        if (response.ok) {
            showPopup(`${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!`);
            setTimeout(() => window.location.reload(), 1500);
        } else {
            const errorData = await response.json();
            showPopup(errorData.message || 'Registration failed. Try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showPopup('Something went wrong during registration.');
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Login Button Clicked!");

    const role = loginRole.value;
    const identifier = loginIdentifierInput.value;
    const password = document.getElementById('loginPassword').value;

    if (identifier === '' || password === '') {
        showPopup('Please enter both identifier and password.');
        return;
    }

    let loginEndpoint = `${BASE_URL}/admin/login`;
    if (role === 'student') {
        loginEndpoint = `${BASE_URL}/students/login`;
    } else if (role === 'officer') {
        loginEndpoint = `${BASE_URL}/admin/officer/login`;
    }

    const loginData = {
        rollNumber: role === 'student' ? identifier : undefined,
        username: role !== 'student' ? identifier : undefined,
        password
    };

    console.log("Login Data:", loginData);

    try {
        const response = await fetch(loginEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        console.log("Response Status:", response.status);

        if (response.ok) {
            const identifier = loginIdentifierInput.value;
            localStorage.setItem("rollNumber", identifier);

            showPopup(`${role.charAt(0).toUpperCase() + role.slice(1)} logged in successfully!`);
            setTimeout(() => {
                if (role === 'student') {
                    window.location.href = 'studentDashboard.html';
                } else if (role === 'officer') {
                    window.location.href = 'officerDashboard.html';
                } else {
                    window.location.href = 'adminDashboard.html';
                }
            }, 1500);
        } else {
            showPopup('Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showPopup('Something went wrong during login.');
    }
});

registerRole.dispatchEvent(new Event('change'));
loginRole.dispatchEvent(new Event('change'));

