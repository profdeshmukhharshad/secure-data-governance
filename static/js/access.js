async function loadRequests(){

    const response =
    await fetch(
    "/access-data"
    );

    const requests =
    await response.json();

    const container =
    document.getElementById(
    "requestList"
    );

    container.innerHTML="";

    requests.forEach(req=>{

        container.innerHTML += `

        <div style="
        background:#1e293b;
        padding:15px;
        margin-bottom:10px;
        border-radius:10px;">

        <strong>
        ${req.fileName}
        </strong>

        <br>

        User:
        ${req.user}

        <br>

        Risk:
        ${req.riskScore}

        <br>

        Status:
        ${req.status}

        <br><br>

<button
onclick="approveRequest(
'${req.id}'
)">

Approve

</button>

<button
onclick="rejectRequest(
'${req.id}'
)">

Reject

</button>

        </div>

        `;

    });

}

window.onload=()=>{

    loadRequests();

}

async function approveRequest(id){

    await fetch(

        "/approve-request/" + id,

        {
            method:"POST"
        }

    );

    loadRequests();

}

async function rejectRequest(id){

    await fetch(

        "/reject-request/" + id,

        {
            method:"POST"
        }

    );

    loadRequests();

}