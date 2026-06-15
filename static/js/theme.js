function toggleTheme(){

    document.body.classList.toggle(
        "light-theme"
    );

    const enabled =

    document.body.classList.contains(
        "light-theme"
    );

    localStorage.setItem(
        "theme",
        enabled
    );

}

window.onload = ()=>{

    const theme =
    localStorage.getItem(
        "theme"
    );

    if(theme==="true"){

        document.body.classList.add(
            "light-theme"
        );

    }

}