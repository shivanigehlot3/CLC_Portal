const API_URL = "http://localhost:9091/admin";

// 🔹 Fetch and display all admission officers
async function loadOfficers() {
    try {
        let response = await fetch(`${API_URL}/officers`);
        let officers = await response.json();
        let tableBody = document.getElementById("officerTableBody");

        tableBody.innerHTML = "";
        officers.forEach(officer => {
            let row = `<tr>
                <td>${officer.officerId}</td>
                <td>${officer.name}</td>
                <td>${officer.username}</td>
                <td>${officer.email}</td>
                <td>${officer.phoneNumber}</td>
                <td><button onclick="removeOfficer(${officer.officerId})">Remove</button></td>

            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error loading officers:", error);
    }
}

// 🔹 Add a new admission officer
async function addOfficer() {
    let name = document.getElementById("officerName").value;
    let username = document.getElementById("officerUsername").value;
    let password = document.getElementById("officerPassword").value;
    let email = document.getElementById("officerEmail").value;
    let phone = document.getElementById("officerPhoneNumber").value;

    let officerData = { 
        name, 
        username, 
        password, 
        email, 
        phoneNumber: phone 
    };

    try {
        let response = await fetch(`${API_URL}/officer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(officerData)
        });

        let result = await response.json();
        console.log("Response:", result);

        if (response.ok) {
            document.getElementById("statusMessage").textContent = "Officer added successfully!";
            loadOfficers();
        } else {
            document.getElementById("statusMessage").textContent = "Failed to add officer!";
        }
    } catch (error) {
        console.error("Error adding officer:", error);
    }
}

// 🔹 Remove an admission officer
async function removeOfficer(id) {
    try {
        let response = await fetch(`${API_URL}/officer/${id}`, { method: "DELETE" });

        if (response.ok) {
            document.getElementById("statusMessage").textContent = "Officer removed successfully!";
            loadOfficers(); // Refresh the list after deletion
        } else {
            document.getElementById("statusMessage").textContent = "Failed to remove officer!";
        }
    } catch (error) {
        console.error("Error removing officer:", error);
    }
}


// 🔹 Logout function
function logout() {
    alert("Admin logged out!");
    window.location.href = "..html/login.html"; 
}

// Load officers when the page loads
window.onload = loadOfficers;
