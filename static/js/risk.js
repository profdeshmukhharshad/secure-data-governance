async function loadRiskData(){

    const response =
    await fetch("/risk-data");

    const data =
    await response.json();

    document.getElementById(
    "lowRisk").innerText =
    data.low;

    document.getElementById(
    "mediumRisk").innerText =
    data.medium;

    document.getElementById(
    "highRisk").innerText =
    data.high;

    document.getElementById(
    "criticalRisk").innerText =
    data.critical;

    const ctx =
    document.getElementById(
    "riskChart"
    );

    new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:[
            "Low",
            "Medium",
            "High",
            "Critical"
            ],

            datasets:[{

                data:[

                    data.low,

                    data.medium,

                    data.high,

                    data.critical

                ]

            }]

        }

    });

}

window.onload=()=>{

    loadRiskData();

}