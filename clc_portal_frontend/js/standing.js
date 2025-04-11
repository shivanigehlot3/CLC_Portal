console.log("Loading Student Standings...");

const BASE_URL = "http://localhost:9091";

//top 15 students from all branches
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
    try {
        const response = await fetch(`${BASE_URL}/students/branch/${branch}`);
        if (!response.ok) {
            throw new Error("Failed to fetch branch students");
        }
        const students = await response.json();
        displayStudents(students);
        console.log(`Fetched ${branch} students:`, students);
    } catch (error) {
        console.error("Error:", error);
    }
}

//student detail inside card
function displayStudents(students) {
    const container = document.getElementById('student-cards');
    container.innerHTML = ''; 

    const topStudents = students.slice(0, 15);

    topStudents.forEach((student, index) => {
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
    const selectedBranch = branchFilter.value;
    if (selectedBranch === 'all') {
        fetchTopStudents();
    } else {
        fetchStudentsByBranch(selectedBranch);
    }
});

window.onload = fetchTopStudents;
