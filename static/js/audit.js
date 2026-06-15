async function loadAuditLogs(){

    const container =
    document.getElementById(
    "auditContainer"
    );

    const response =
    await fetch(
    "/audit-data"
    );

    const logs =
    await response.json();

    container.innerHTML="";

    logs.forEach(log=>{

        container.innerHTML += `

        <div style="
        background:#1e293b;
        padding:15px;
        margin-bottom:10px;
        border-radius:10px;">

        <strong>
        ${log.action}
        </strong>

        <br>

        ${log.timestamp}

        </div>

        `;

    });

}

window.onload=()=>{

    loadAuditLogs();

}