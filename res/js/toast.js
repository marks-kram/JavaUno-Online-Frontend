
function showToast(text){
    let toast = new iqwerty.toast.Toast();
    toast = toast.setText(text).setDuration(3000);
    toast.show();
}