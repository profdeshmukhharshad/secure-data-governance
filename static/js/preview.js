async function loadPreview(){

    const params =
    new URLSearchParams(
        window.location.search
    );

    const fileName =
    params.get("file");

    const response =
    await fetch(
        "/file-metadata?file=" +
        encodeURIComponent(fileName)
    );

    const file =
    await response.json();

   document.getElementById(
"previewContainer"
).innerHTML = `

<div class="card">

<h2>${file.fileName}</h2>

<hr>

<p>
📂 Classification:
<b>${file.classification}</b>
</p>

<p>
⚠ Risk Score:
<b>${file.riskScore}</b>
</p>

<p>
🔐 Encryption:
<b>${file.encryption}</b>
</p>

<p>
📦 Status:
<b>${file.status}</b>
</p>

<p>
☁ Cloud Storage:
<b>Firebase Storage</b>
</p>

<p>
🔑 Hash Integrity:
</p>

<small>
${file.hash}
</small>

<br><br>

<button
onclick="
navigator.clipboard.writeText(
'${file.hash}'
)
">

Copy Hash

</button>

</div>

`;

}

window.onload=()=>{

    loadPreview();

}