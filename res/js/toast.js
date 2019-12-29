function showToast(text) {
    let toast = document.getElementById('toast');
    toast.innerText = text;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}
