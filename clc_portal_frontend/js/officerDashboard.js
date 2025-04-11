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

function logout() {
    localStorage.removeItem("officerId");
    window.location.href = "login.html";
}

document.getElementById("admit-students").addEventListener("click", async function () {
    try {
        const response = await fetch(`${BASE_URL}/students/admitted`);
        if (!response.ok) {
            throw new Error("Failed to fetch admitted students.");
        }

        const admittedStudents = await response.json();
        console.log("Admitted Students Fetched:", admittedStudents);

        const tableBody = document.getElementById("admitted-students-table");
        tableBody.innerHTML = "";

        if (admittedStudents.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='4'>No admitted students available.</td></tr>";
            return;
        }

        admittedStudents.forEach(student => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${student.rollNumber || "N/A"}</td>
                <td>${student.name || "N/A"}</td>
                <td>${student.email || "N/A"}</td>
                <td>${student.branch || "N/A"}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error(" Error fetching admitted students:", error);
    }
});
