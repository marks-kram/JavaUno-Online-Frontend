
function showToast(text){
    let toast = new iqwerty.toast.Toast();
    toast = toast.setText(sanitize(text)).setDuration(3000);
    toast.show();
}

function sanitize(text){
    return text.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
