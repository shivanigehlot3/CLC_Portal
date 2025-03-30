const BASE_URL = "http://localhost:9091";

document.addEventListener("DOMContentLoaded", async function () {
    const rollNumber = localStorage.getItem("rollNumber");

    if (!rollNumber) {
        alert("No roll number found. Please log in.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/students/${rollNumber}`);
        if (!response.ok) {
            alert("Failed to fetch student data");
            return;
        }
        const student = await response.json();

        document.getElementById('user-name').textContent = student.name;
        document.getElementById('roll-number').textContent = student.rollNumber;
        document.getElementById('father-name').textContent = student.fatherName;
        document.getElementById('user-email').textContent = student.email;
        document.getElementById('user-phone').textContent = student.phoneNumber;
        document.getElementById('dob').textContent = student.dob;
        document.getElementById('user-address').textContent = student.address;
        document.getElementById('branch-name').textContent = student.branch;
        document.getElementById('rank').textContent = student.rank;
    } catch (error) {
        console.error("Error fetching student data:", error);
        alert("Error fetching student data");
    }

    showSection('profile');  // Show profile by default
});

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("rollNumber");
        window.location.href = "login.html";
    }
}

async function loadSeatMatrix() {
const seatMatrixTable = document.querySelector("#seat-matrix-table tbody");
seatMatrixTable.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

try {
    const response = await fetch(`${BASE_URL}/seat-matrix`);
    if (!response.ok) {
        seatMatrixTable.innerHTML = "<tr><td colspan='4'>Failed to load data</td></tr>";
        return;
    }

    const seatMatrixData = await response.json();
    if (seatMatrixData.length === 0) {
        seatMatrixTable.innerHTML = "<tr><td colspan='4'>No data available</td></tr>";
        return;
    }

    seatMatrixTable.innerHTML = "";  // Clear loading message

    seatMatrixData.forEach(seat => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${seat.branch}</td>
            <td>${seat.totalSeats}</td>
            <td>${seat.filledSeats}</td>
            <td>${seat.totalSeats - seat.filledSeats}</td>
        `;
        seatMatrixTable.appendChild(row);
    });
} catch (error) {
    console.error("Error loading seat matrix:", error);
    seatMatrixTable.innerHTML = "<tr><td colspan='4'>Error fetching data</td></tr>";
}
}



function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    if (sectionId === "seat-matrix") {
    loadSeatMatrix();
    }else if (sectionId === "branch-leaderboard") {
    loadBranchLeaderboard();
}
}

function goToStanding() {
    showSection('standings');
}

async function loadBranchLeaderboard() {
const rollNumber = localStorage.getItem("rollNumber");
if (!rollNumber) {
    alert("No roll number found. Please log in.");
    window.location.href = "login.html";
    return;
}

const leaderboardTable = document.querySelector("#leaderboard-table tbody");
leaderboardTable.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

try {
    const response = await fetch(`${BASE_URL}/students/${rollNumber}`);
    if (!response.ok) {
        alert("Failed to fetch student data");
        return;
    }
    const student = await response.json();
    const branch = student.branch;
    showQualificationMessage(student.status);

    const branchResponse = await fetch(`${BASE_URL}/students/branch/${branch}?limit=100`);
    if (!branchResponse.ok) {
        leaderboardTable.innerHTML = "<tr><td colspan='4'>Failed to load data</td></tr>";
        return;
    }

    const branchData = await branchResponse.json();
    if (branchData.length === 0) {
        leaderboardTable.innerHTML = "<tr><td colspan='4'>No data available</td></tr>";
        return;
    }

    leaderboardTable.innerHTML = "";  // Clear loading message
    branchData.forEach((student, index) => {
        const row = document.createElement("tr");
        // Highlight the logged-in student
        if (student.rollNumber === rollNumber) {
            row.classList.add("logged-in-student");
        }

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.rollNumber}</td>
            <td>${student.branch}</td>
            <td>${student.status}</td>
        `;
        leaderboardTable.appendChild(row);
    });
} catch (error) {
    console.error("Error loading branch leaderboard:", error);
    leaderboardTable.innerHTML = "<tr><td colspan='4'>Error fetching data</td></tr>";
}

function showQualificationMessage(status) {
const messageDiv = document.getElementById("student-message");

if (status === "Qualified") {
    messageDiv.textContent = "🎉 Congratulations! You have qualified for counselling.";
    messageDiv.style.color = "#042b0d";
} else if (status === "Not Qualified") {
    messageDiv.textContent = "❌ Unfortunately, you did not qualify for counselling. Keep trying!";
    messageDiv.style.color = "red";
} else if (status === "Waitlisted") {
    messageDiv.textContent = "⏳ You are waitlisted for counselling. Please stay tuned for further updates.";
    messageDiv.style.color = "orange";
} else {
    messageDiv.textContent = "⚠️ Status not available.";
    messageDiv.style.color = "gray";
}
}
}
