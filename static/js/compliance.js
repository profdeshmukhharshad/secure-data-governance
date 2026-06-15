window.onload = () => {

    const ctx =
    document.getElementById(
    "complianceChart"
    );

    new Chart(ctx,{

        type:"bar",

        data:{

            labels:[

                "GDPR",

                "ISO 27001",

                "HIPAA",

                "NIST"

            ],

            datasets:[{

                label:
                "Compliance Score",

                data:[

                    92,

                    95,

                    88,

                    90

                ]

            }]

        }

    });

}