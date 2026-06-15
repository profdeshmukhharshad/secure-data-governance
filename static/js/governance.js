async function createPolicy(){

    const role =
    document.getElementById(
    "role"
    ).value;

    const classification =
    document.getElementById(
    "classification"
    ).value;

    const action =
    document.getElementById(
    "action"
    ).value;

    await fetch(
    "/create-policy",
    {
        method:"POST",

        headers:{
            "Content-Type":
            "application/json"
        },

        body:JSON.stringify({

            role,

            classification,

            action

        })

    });

    loadPolicies();

}

async function loadPolicies(){

    const response =
    await fetch(
    "/list-policies"
    );

    const policies =
    await response.json();

    const container =
    document.getElementById(
    "policyList"
    );

    container.innerHTML="";

    policies.forEach(policy=>{

        container.innerHTML += `

        <div style="
        background:#0f172a;
        padding:15px;
        margin-bottom:10px;
        border-radius:10px;">

        IF Role =
        <strong>${policy.role}</strong>

        AND Classification =
        <strong>${policy.classification}</strong>

        THEN

        <strong>
        ${policy.action}
        </strong>

        </div>

        `;

    });

}

window.onload=()=>{

    loadPolicies();

}