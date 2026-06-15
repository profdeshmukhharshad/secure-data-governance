async function uploadFile() {

    const file =
    document.getElementById("fileInput")
    .files[0];

    if (!file) {

        alert("Please select a file");

        return;
    }

    const classification =
    document.getElementById("classification")
    .value;

    const status =
    document.getElementById("uploadStatus");

    status.innerHTML =
    "🔐 Encrypting File...";

    document.getElementById(
    "progressBar"
    ).style.width="20%";

    const formData =
    new FormData();

    formData.append(
        "file",
        file
    );

    formData.append(
        "classification",
        classification
    );
    formData.append(
    "role",
    localStorage.getItem(
        "userRole"
    )
);

    try {

        status.innerHTML =
"🔑 Generating SHA-256 Hash...";

document.getElementById(
"progressBar"
).style.width="50%";

await new Promise(
resolve => setTimeout(
resolve,
500
)
);

status.innerHTML =
"⚠ Governance Validation...";

document.getElementById(
"progressBar"
).style.width="75%";

        const response =
        await fetch(
            "/upload-file",
            {
                method: "POST",
                body: formData
            }
        );

        const result =
        await response.json();

        if (result.success) {

            document.getElementById(
"progressBar"
).style.width="100%";

status.innerHTML = `

            ✅ Upload Completed

            <br><br>

            Risk Score:
            ${result.riskScore}

            <br><br>

            Hash:
            ${result.hash}

            `;

        }
        else {

            status.innerHTML =
            "❌ Upload Failed";

        }

    }
    catch (error) {

        console.error(error);

        status.innerHTML =
        "❌ Error Uploading File";

    }

}

async function loadFiles(){

    const response =
    await fetch("/list-files");

    const files =
    await response.json();

    const table =
    document.getElementById("fileTable");

    table.innerHTML="";

    files.forEach(file=>{

        table.innerHTML += `

        <tr>

        <td>${file.fileName}</td>

        <td>${file.classification}</td>

        <td>${file.riskScore}</td>

        <td>${file.encryption}</td>

        <td>${file.status}</td>

<td>

<button
onclick="previewFile(
'${file.fileName}'
)">
Preview
</button>

<button
onclick="requestAccess(
'${file.fileName}',
${file.riskScore}
)">
Request Access
</button>

</td>

        </tr>

        `;

    });

}

window.onload=()=>{

    loadFiles();

}

document.addEventListener("DOMContentLoaded", () => {

    const fileInput = document.getElementById("fileInput");

    if(fileInput){

        fileInput.addEventListener("change", () => {

            if(fileInput.files.length > 0){

                document.getElementById("selectedFile").innerHTML =
                "Selected: " + fileInput.files[0].name;

            }

        });

    }

});

async function requestAccess(
fileName,
riskScore
){

    await fetch(
    "/request-access",
    {

        method:"POST",

        headers:{
            "Content-Type":
            "application/json"
        },

        body:JSON.stringify({

            fileName:fileName,

            riskScore:riskScore,

            user:localStorage.getItem(
                "userEmail"
            )

        })

    });

    alert(
    "Access Request Submitted"
    );

}

function previewFile(
fileName
){

    window.location.href =

    "/preview?file=" +

    encodeURIComponent(
        fileName
    );

}