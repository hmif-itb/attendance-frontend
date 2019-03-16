let eventId = '';
let serverUrl = '';
let jwtKey = '';

const NIM_REGEX = /(135|182)[0-9]{5}/;

function send(){
  closeDialog('cek');
  notice('Loading','',false);

  let nimData =  $('#nimInput').val();
  let attendUrl = serverUrl+'/events/'+eventId+'/attend';

  let postData = {
    nim: nimData
  }

  fetch(attendUrl,{
    method: 'POST',
    headers: {
      'Authorization': 'Bearer '+jwtKey, 
      'Content-Type':'application/JSON'
    },
    body: JSON.stringify(postData)
  }).then((val)=>{
    closeDialog('notice');
    if(val.status==200){
      $('#nimInput').val('');
      setTimeout(()=>{notice('Sukses','OK',true);},50);
    }else{
      setTimeout(()=>{notice(content.detail,'OK',true);},50);
    }
  }).catch((err)=>{
      console.error(err);
      alert(err);
  });
}

function check(){
  let nimData = $('#nimInput').val();

  if(NIM_REGEX.test(nimData)){
    notice('Loading','',false);

    let nimUrl = serverUrl + '/students/'+nimData;

    fetch(nimUrl,{
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+jwtKey, 
        'Content-Type':'application/JSON'
      }
    }).then((val)=>{
      val.json().then((content)=>{
        closeDialog('notice');
        if(val.status==200){
          $('#nameCheck').text(content[0].name);
          openDialog('cek');
        }else{
          setTimeout(()=>{notice(content.detail,'OK',true);},50);
        }
      });
    }).catch((err)=>{
        console.error(err);
        alert(err);
    });



  }else {
    notice('Invalid NIM','OK',true);
  };
}

$( document ).ready(function() {
  if(localStorage.getItem('serverUrl')){
    serverUrl = localStorage.getItem('serverUrl');

    if(sessionStorage.getItem('jwt')){
      jwtKey = sessionStorage.getItem('jwt');
      if(window.location.hash.length==21){
        eventId = window.location.hash.substr(1,20);
      }else{
        window.location.replace('/event.html');
      }
    }else{
      window.location.replace('/');
    }
  }else{
    alert('Error, URL not supplied');
  }
});