async function loadDashboardStats(){

    const response =
    await fetch("/dashboard-stats");

    const stats =
    await response.json();

    document.getElementById(
    "usersCount"
    ).innerText =
    stats.users;

    document.getElementById(
    "filesCount"
    ).innerText =
    stats.files;

    document.getElementById(
    "policiesCount"
    ).innerText =
    stats.policies;

    document.getElementById(
    "requestsCount"
    ).innerText =
    stats.requests;

}

async function loadActivities(){

    const response =
    await fetch(
    "/recent-activities"
    );

    const activities =
    await response.json();

    const container =
    document.getElementById(
    "activityFeed"
    );

    container.innerHTML="";

    activities.forEach(item=>{

        container.innerHTML += `

        <div style="
        padding:12px;
        margin-bottom:10px;
        background:#1e293b;
        border-radius:10px;">

        <strong>

        ${item.action}

        </strong>

        <br>

        ${item.timestamp}

        </div>

        `;

    });

}

window.onload=()=>{

    loadDashboardStats();

    loadActivities();

    loadExecutiveData();

}

async function loadExecutiveData(){

    const response =
    await fetch(
        "/executive-dashboard"
    );

    const data =
    await response.json();

    document.getElementById(
        "pendingCount"
    ).innerText =
    data.pendingRequests;

    document.getElementById(
        "approvedCount"
    ).innerText =
    data.approvedRequests;

    document.getElementById(
        "rejectedCount"
    ).innerText =
    data.rejectedRequests;

}