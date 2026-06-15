let totalUsers = 0;
let pendingUsersCount = 0;
let approvedUsersCount = 0;
let rejectedUsersCount = 0;

async function loadPendingUsers() {

    const container =
    document.getElementById("pendingUsers");

    container.innerHTML = "";

    totalUsers = 0;
    pendingUsersCount = 0;
    approvedUsersCount = 0;
    rejectedUsersCount = 0;

    const snapshot =
    await db.collection("users").get();

    snapshot.forEach((doc)=>{

        totalUsers++;

        const user = doc.data();

        if(user.status==="pending")
            pendingUsersCount++;

        if(user.status==="approved")
            approvedUsersCount++;

        if(user.status==="rejected")
            rejectedUsersCount++;

        if(user.status==="pending"){

            container.innerHTML += `

            <div class="user-row">

                <div>

                <strong>${user.email}</strong>

                <br>

                ${user.role}

                </div>

                <div>

                <button
                class="btn approve"
                onclick="approveUser('${doc.id}')">

                Approve

                </button>

                <button
                class="btn reject"
                onclick="rejectUser('${doc.id}')">

                Reject

                </button>

                </div>

            </div>

            `;
        }

    });

    document.getElementById("totalUsers").innerText =
    totalUsers;

    document.getElementById("pendingCount").innerText =
    pendingUsersCount;

    document.getElementById("approvedCount").innerText =
    approvedUsersCount;

    document.getElementById("rejectedCount").innerText =
    rejectedUsersCount;

    loadChart();

}

async function approveUser(uid){

    await db.collection("users")
    .doc(uid)
    .update({

        status:"approved"

    });

    alert("User Approved");

    loadPendingUsers();

}

async function rejectUser(uid){

    await db.collection("users")
    .doc(uid)
    .update({

        status:"rejected"

    });

    alert("User Rejected");

    loadPendingUsers();

}

function loadChart(){

    const ctx =
    document.getElementById("userChart");

    new Chart(ctx,{

        type:'doughnut',

        data:{

            labels:[
                'Pending',
                'Approved',
                'Rejected'
            ],

            datasets:[{

                data:[
                    pendingUsersCount,
                    approvedUsersCount,
                    rejectedUsersCount
                ]

            }]

        }

    });

}

window.onload=()=>{

    loadPendingUsers();

}