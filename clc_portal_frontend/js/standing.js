console.log("Loading Student Standings...");

const BASE_URL = "http://localhost:9091";

async function fetchTopStudents() {
    try {
        const response = await fetch(`${BASE_URL}/students/top`);
        if (!response.ok) {
            throw new Error("Failed to fetch students");
        }
        const students = await response.json();
        displayStudents(students);
        console.log("Fetched students:", students);

    } catch (error) {
        console.error("Error:", error);
    }
}

async function fetchStudentsByBranch(branch) {
    const response = await fetch(`${BASE_URL}/students/branch/${branch}`);
    const students = await response.json();
    displayStudents(students);
}

function displayStudents(students) {
    const container = document.getElementById('student-cards');
    container.innerHTML = ''; 
    students.forEach((student, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-branch', student.branch);
        card.setAttribute('data-rank', student.rank);

        card.innerHTML = `
            <div class="rank">${index + 1}</div>
            <div class="info"><strong>Name:</strong> ${student.name}</div>
            <div class="info"><strong>Branch:</strong> ${student.branch}</div>
            <div class="info"><strong>Rank:</strong> ${student.rank}</div>
            <div class="info"><strong>Status:</strong> 
                <span class="status ${getStatusClass(student.status)}">${student.status}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function getStatusClass(status) {
    switch (status) {
        case 'Qualified':
            return 'qualified';
        case 'Waitlisted':
            return 'waitlisted';
        case 'Not Qualified':
            return 'not-qualified';
        default:
            return '';
    }
}

const branchFilter = document.getElementById('branchFilter');
branchFilter.addEventListener('change', () => {
    const selectedBranch = branchFilter.value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const cardBranch = card.getAttribute('data-branch').toLowerCase();
        card.style.display = (selectedBranch === 'all' || cardBranch === selectedBranch) ? 'block' : 'none';
    });
});

const rankSort = document.getElementById('rankSort');
rankSort.addEventListener('change', () => {
    const container = document.getElementById('student-cards');
    const cards = Array.from(container.querySelectorAll('.card'));

    cards.sort((a, b) => {
        const rankA = parseInt(a.getAttribute('data-rank'));
        const rankB = parseInt(b.getAttribute('data-rank'));
        return rankSort.value === 'asc' ? rankA - rankB : rankB - rankA;
    });

    cards.forEach(card => container.appendChild(card));
});

window.onload = fetchTopStudents;
