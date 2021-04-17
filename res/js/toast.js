
function showToast(text){
    let toast = new iqwerty.toast.Toast();
    toast = toast.setText(text).setDuration(30000);
    toast.show();
}