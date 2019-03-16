function save(){
  localStorage.setItem('serverUrl', document.getElementById('serverUrl').value);

  alert('sukses');
  location.reload();
}

window.onload = ()=>{
  if(localStorage.getItem('serverUrl')){
    document.getElementById('serverUrl').value = localStorage.getItem('serverUrl');
  }
}
