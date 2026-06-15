function registerUser() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.createUserWithEmailAndPassword(email, password)

    .then(async (userCredential) => {

        const user = userCredential.user;

        await db.collection("users")
        .doc(user.uid)
        .set({

            email: email,

            role: "user",

            status: "pending",

            createdAt: new Date().toISOString()

        });

        alert(
        "Registration Successful.\nWaiting for Super Admin Approval."
        );

        window.location.href="/login";

    })

    .catch(error => {

        alert(error.message);

    });

}


function loginUser() {

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email,password)

    .then(async(userCredential)=>{

        const uid = userCredential.user.uid;

        const doc =
        await db.collection("users")
        .doc(uid)
        .get();

        if(!doc.exists){

            alert("User record not found");

            return;
        }

        const data = doc.data();

        if(data.status==="pending"){

            alert(
            "Your account is waiting for approval."
            );

            auth.signOut();

            return;
        }

        if(data.status==="rejected"){

            alert(
            "Your account has been rejected."
            );

            auth.signOut();

            return;
        }

        localStorage.setItem(
    "userEmail",
    email
);

localStorage.setItem(
    "userRole",
    data.role
);

if(data.role==="superadmin"){

    alert("Welcome Super Admin");

    window.location.href="/superadmin";

}
else{

    alert("Login Successful");

    window.location.href="/dashboard";

}

    })

    .catch(error=>{

        alert(error.message);

    });

}


async function googleLogin() {

    const provider = new firebase.auth.GoogleAuthProvider();

    try {

        const result =
        await auth.signInWithPopup(provider);

        const user = result.user;

        console.log("UID:", user.uid);
        console.log("EMAIL:", user.email);

        const userRef =
        db.collection("users").doc(user.uid);

        const doc =
        await userRef.get();

        // First-time Google login
        if (!doc.exists) {

            await userRef.set({

                email: user.email,

                role: "user",

                status: "pending",

                createdAt: new Date().toISOString()

            });

            alert(
            "Account created. Waiting for Super Admin approval."
            );

            await auth.signOut();

            return;
        }

        const data = doc.data();

        if (data.status === "pending") {

            alert(
            "Your account is waiting for approval."
            );

            await auth.signOut();

            return;
        }

        if (data.status === "rejected") {

            alert(
            "Access denied."
            );

            await auth.signOut();

            return;
        }

        localStorage.setItem(
    "userEmail",
    user.email
);

localStorage.setItem(
    "userRole",
    data.role
);

if (data.role === "superadmin") {

    window.location.href = "/superadmin";

}
else {

    window.location.href = "/dashboard";

}

    }
    catch(error){

        alert(error.message);

    }

}


function logoutUser() {

    localStorage.removeItem(
        "userEmail"
    );

    localStorage.removeItem(
        "userRole"
    );

    auth.signOut()

        .then(() => {

            window.location.href = "/";

        });

}