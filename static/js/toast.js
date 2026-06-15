function showToast(message){

    const toast =
    document.createElement("div");

    toast.innerHTML =
    message;

    toast.style.position =
    "fixed";

    toast.style.top =
    "20px";

    toast.style.right =
    "20px";

    toast.style.background =
    "#22c55e";

    toast.style.color =
    "white";

    toast.style.padding =
    "15px";

    toast.style.borderRadius =
    "10px";

    toast.style.zIndex =
    "9999";

    document.body.appendChild(
        toast
    );

    setTimeout(()=>{

        toast.remove();

    },3000);

}