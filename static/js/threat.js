async function loadThreats(){

    const response =
    await fetch(
    "/threat-summary"
    );

    const data =
    await response.json();

    document.getElementById(
    "lowCount"
    ).innerText =
    data.low;

    document.getElementById(
    "mediumCount"
    ).innerText =
    data.medium;

    document.getElementById(
    "highCount"
    ).innerText =
    data.high;

    document.getElementById(
    "criticalCount"
    ).innerText =
    data.critical;

}

window.onload=()=>{

    loadThreats();

}