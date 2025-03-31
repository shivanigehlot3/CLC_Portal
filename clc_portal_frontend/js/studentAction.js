let students = []; 
let filteredStudents = [];
let currentIndex = 0;

async function fetchStudents() {
    try {
        const response = await fetch("http://localhost:9091/students");
        students = await response.json();
        console.log("✅ Students data fetched:", students);
    } catch (error) {
        console.error("❌ Error fetching students:", error);
    }
}

function filterStudentsByBranch() {
    const selectedBranch = document.getElementById("branch-select").value;
    console.log(`📌 Selected Branch: ${selectedBranch}`);

    // Reset previous state
    filteredStudents = students.filter(student => student.branch === selectedBranch);
    currentIndex = 0;  
    document.getElementById("status-message").textContent = ""; 

    if (filteredStudents.length === 0) {
        console.log("❌ No students found for this branch.");
        document.getElementById("student-details").innerHTML = "<p>No students available for this branch.</p>";
        document.querySelector(".action-buttons").style.display = "none";
        return;
    } 

    document.querySelector(".action-buttons").style.display = "block";

    // Load first student of the new branch
    loadStudent();
}

function loadStudent() {
    if (filteredStudents.length === 0 || currentIndex >= filteredStudents.length) {
        document.getElementById("student-details").innerHTML = "<p>No students available for this branch.</p>";
        document.querySelector(".action-buttons").style.display = "none";
        return;
    }

    let student = filteredStudents[currentIndex];
    console.log("👀 Displaying Student:", student);

    document.getElementById("student-name").textContent = student.name || "N/A";
    document.getElementById("student-roll").textContent = student.rollNumber || "N/A";
    document.getElementById("student-branch").textContent = student.branch || "N/A";
    document.getElementById("student-rank").textContent = student.rank || "N/A";
    document.getElementById("student-status").textContent = student.status || "N/A";
    document.querySelector(".action-buttons").style.display = "block";
}

// Admit student
async function admitStudent() {
    if (currentIndex < filteredStudents.length) {
        let student = filteredStudents[currentIndex];

        try {
            const response = await fetch(`http://localhost:9091/students/admit/${student.rollNumber}/${student.branch}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });
            console.log("api called");

            if (response.ok) {
                document.getElementById("status-message").textContent = `${student.name} has been admitted! ✅`;
                currentIndex++;
                setTimeout(loadStudent, 1000);
            } else {
                document.getElementById("status-message").textContent = `Failed to admit ${student.name}`;
            }
        } catch (error) {
            document.getElementById("status-message").textContent = "Error connecting to server.";
        }
        console.log("admittt");
    }
}

// Skip student
async function skipStudent() {
    if (currentIndex < filteredStudents.length) {
        let student = filteredStudents[currentIndex];

        try {
            const response = await fetch(`http://localhost:9091/students/skip/${student.rollNumber}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Skipped" })
            });

            if (response.ok) {
                document.getElementById("status-message").textContent = `${student.name} has been skipped! ⏭️`;
                currentIndex++;
                setTimeout(loadStudent, 1000);
            }
        } catch (error) {
            console.error("Error skipping student:", error);
        }
        console.log("skipppp");
    }
}

fetchStudents();
