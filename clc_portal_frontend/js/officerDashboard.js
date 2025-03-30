const sidebarItems = document.querySelectorAll('.sidebar-menu-item');
const contentSections = document.querySelectorAll('.content-section');

function showSection(targetId) {
    contentSections.forEach(section => {
        if (section.id === targetId) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        showSection(targetId);
    });
});

showSection('standing-page');
const officerId = localStorage.getItem("officerId");

const BASE_URL = "http://localhost:9091";

function fetchSeatMatrix() {
    fetch(`${BASE_URL}/seat-matrix`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch seat matrix');
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#seat-matrix-table tbody');
            tableBody.innerHTML = '';

            data.forEach(seat => {
                const availableSeats = seat.totalSeats - seat.filledSeats;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${seat.branch}</td>
                    <td>${seat.totalSeats}</td>
                    <td id="filledSeats-${seat.branch}">${seat.filledSeats}</td>
                    <td>
                        <input type="number" min="0" value="${availableSeats}" id="availableSeats-${seat.branch}" />
                    </td>
                    <td>
                        <button onclick="updateSeatMatrix('${seat.branch}', ${seat.totalSeats})">Update</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching seat matrix:', error));
}

function updateSeatMatrix(branch, totalSeats) {
    const newAvailableSeats = parseInt(document.getElementById(`availableSeats-${branch}`).value);

    if (isNaN(newAvailableSeats) || newAvailableSeats < 0 || newAvailableSeats > totalSeats) {
        alert('Please enter a valid number of available seats.');
        return;
    }

    const newFilledSeats = totalSeats - newAvailableSeats;

    fetch(`${BASE_URL}/seat-matrix/${branch}?filledSeats=${newFilledSeats}`, {
        method: 'PUT',
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to update seat matrix');
        alert(`Available seats updated for ${branch}`);
        return fetchSeatMatrix();  
    })
    .catch(error => console.error('Error updating seat matrix:', error));
}

fetchSeatMatrix();


async function fetchStudentDetails() {
    console.log("fetch btn clicked!");
    const rollNumberInput = document.querySelector('input#student-roll');
    
    if (!rollNumberInput) {
        alert('Please enter a Roll Number!');
        return;
    }

    const rollNumber = rollNumberInput.value.trim();
    if (!rollNumber) {
        alert("Roll Number cannot be empty!");
        return;
    }

    try {
        console.log("Roll Number before API call:", rollNumber);

        const response = await fetch(`${BASE_URL}/students/${rollNumber}`);
        if (!response.ok) {
            throw new Error('Student not found');
        }

        const student = await response.json();
        console.log("Fetched Student Data:", student);
        console.log("Available Keys:", Object.keys(student));

        const nameField = document.querySelector('input#student-name');
        const branchField = document.querySelector('input#student-branch');
        const rankField = document.querySelector('input#student-rank');

        if (!nameField || !branchField || !rankField) {
            console.error("One or more form fields are missing in the DOM.");
            return;
        }

        setTimeout(() => {
            nameField.value = String(student.name || '');
            branchField.value = String(student.branch || '');
            rankField.value = String(student.rank !== undefined ? student.rank : '');
            
            document.getElementById('student-email').value = String(student.email || '');
            document.getElementById('student-phone').value = String(student.phoneNumber || '');
            document.getElementById('student-address').value = String(student.address || '');
            document.getElementById('student-father-name').value = String(student.fatherName || '');
            document.getElementById('student-dob').value = student.dob || '';
        }, 100);

        alert('Student details fetched successfully!');
    } catch (error) {
        alert(error.message);
        console.error('Error fetching student details:', error);
    }
}

async function updateStudentDetails(event) {
    event.preventDefault();

    const studentData = {
        rollNumber: document.querySelector('input#student-roll').value.trim(),
        name: document.querySelector('input#student-name').value.trim(),
        email: document.getElementById('student-email').value.trim(),
        phoneNumber: document.getElementById('student-phone').value.trim(),
        address: document.getElementById('student-address').value.trim(),
        fatherName: document.getElementById('student-father-name').value.trim(),
        dob: document.getElementById('student-dob').value.trim(),
        branch: document.querySelector('input#student-branch').value.trim(),
        rank: parseInt(document.querySelector('input#student-rank').value) || 0,
    };

    try {
        const response = await fetch(`${BASE_URL}/students/updateStudent/${studentData.rollNumber}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData),
        });

        if (!response.ok) {
            throw new Error('Failed to update student details');
        }

        alert('Student Details Updated');
        document.getElementById('update-student-form').reset();
    } catch (error) {
        console.error('Error updating student details:', error);
    }
}


async function loadAdmittedStudents() {
    try {
        const response = await fetch("http://localhost:9091/students/admitted");
        const admittedStudents = await response.json();

        let tableBody = document.getElementById("admitted-students-table");
        tableBody.innerHTML = "";

        admittedStudents.forEach(student => {
            let row = `<tr>
                        <td>${student.rollNumber}</td>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.admissionDate}</td>
                       </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching admitted students:", error);
    }
}

function logout() {
    localStorage.removeItem("officerId");
    window.location.href = "login.html";
}



let students = [];
let currentIndex = 0;

async function fetchStudents() {
try {
const response = await fetch('http://localhost:9091/students');
students = await response.json();
if (students.length > 0) {
    loadStudent();
} else {
    document.getElementById("student-details").innerHTML = "<p>No students available.</p>";
    document.querySelector(".action-buttons").style.display = "none";
}
} catch (error) {
console.error("Error fetching student data:", error);
document.getElementById("student-details").innerHTML = "<p>Error loading students.</p>";
}
}

function loadStudent() {
if (currentIndex < students.length) {
let student = students[currentIndex];
document.querySelector("h3#student-name").textContent = student.name;
document.querySelector("span#student-roll").textContent = student.rollNumber; // Fixed roll number key
document.querySelector("span#student-branch").textContent = student.branch;
document.querySelector("span#student-rank").textContent = student.rank;
document.querySelector("span#student-status").textContent = student.status;
document.querySelector("p#status-message").textContent = "";
} else {
document.getElementById("student-details").innerHTML = "<p>No more students to process.</p>";
document.querySelector(".action-buttons").style.display = "none";
}
}

async function admitStudent() {
if (currentIndex < students.length) {
let student = students[currentIndex];
try {
    console.log(`${student.admissionStatus}`);
    const response = await fetch(`http://localhost:9091/students/admit/${student.rollNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
    });

    let responseData;
    try {
        responseData = await response.json();
    } catch (jsonError) {
        responseData = { message: "Invalid response from server" };
    }

    if (response.ok) {
        document.getElementById("status-message").textContent = `${student.name} has been admitted!`;
        console.log("✅ Admission successful:", responseData);
        currentIndex++;
        setTimeout(loadStudent, 1000);
    } else {
        const errorMessage = responseData.message || "Unknown error";
        document.getElementById("status-message").textContent = `Failed to admit ${student.name}: ${errorMessage}`;
        console.error("❌ Admission failed:", responseData);
    }
} catch (error) {
    console.error("⚠️ Error admitting student:", error);
    document.getElementById("status-message").textContent = "Error connecting to server.";
}
}
}

async function skipStudent() {
// console.log("skip fn called");
if (currentIndex < students.length) {
let student = students[currentIndex];
console.log("Skipping student:", student);
console.log(`${student.rollNumber}`);

try {
    const response = await fetch(`http://localhost:9091/students/skip/${student.rollNumber}`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roll: student.roll, status: "Skipped" })
    });

    if (response.ok) {
        document.getElementById("status-message").textContent = `${student.name} has been skipped!`;
    } else {
        console.error("Error: API did not return success.", response.status);
    }
} catch (error) {
    console.error("Error skipping student:", error);
}

currentIndex++;
console.log("Current Index after skipping:", currentIndex);

if (currentIndex < students.length) {
    setTimeout(loadStudent, 1000);
} else {
    document.getElementById("student-details").innerHTML = "<p>No more students to process.</p>";
    document.querySelector(".action-buttons").style.display = "none";
}
}
}

window.onload = fetchStudents;