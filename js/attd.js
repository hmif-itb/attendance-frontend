let eventId = '';
let serverUrl = '';
let jwtKey = '';

let enterAction = ()=>{check();};
let onAction = false;

const NIM_REGEX = /(135|182)[0-9]{5}/;

function closeDialogEnter(name){
  closeDialog(name);
  if(!onAction && name=='notice'){
    enterAction = ()=>{check();};
  }
}

function send(){
  onAction = true;
  closeDialogEnter('cek');
  notice('Loading','',false);
  enterAction = ()=>{closeDialogEnter('notice');};
  
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
    closeDialogEnter('notice');
    if(val.status==200){
      $('#nimInput').val('');
      setTimeout(()=>{
        notice('Sukses','OK',true);
      },50);
    }else{
      setTimeout(()=>{
        notice(content.detail,'OK',true);
      },50);
    }
    setTimeout(()=>{
      onAction = false;
      enterAction = ()=>{
        closeDialogEnter('notice');
      };
    },50);
  }).catch((err)=>{
    console.error(err);
    alert(err);
    onAction = false;
  });
}

function check(){
  onAction = true;
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
        closeDialogEnter('notice');
        if(val.status==200){
          $('#nameCheck').text(content[0].name);
          openDialog('cek');
          onAction = false;
          enterAction = ()=>{send();};
        }else{
          setTimeout(()=>{
            $('#nimInput').val('');
            onAction = false;
            notice(content.detail,'OK',true);
            enterAction = ()=>{closeDialogEnter('notice');};
          },50);
        }
      });
    }).catch((err)=>{
      console.error(err);
      alert(err);
      onAction = false;
    });
    
  }else {
    onAction = false;
    notice('Invalid NIM','OK',true);
    enterAction = ()=>{closeDialogEnter('notice');};
  };
}

$( document ).ready(function() {
  if(localStorage.getItem('serverUrl')){
    serverUrl = localStorage.getItem('serverUrl');
    
    if(sessionStorage.getItem('jwt')){
      jwtKey = sessionStorage.getItem('jwt');
      if(window.location.hash.length==21){
        eventId = window.location.hash.substr(1,20);
        
        let eventsUrl = serverUrl + '/events/'+eventId;
        
        fetch(eventsUrl,{
          method: 'GET',
          headers: {
            'Authorization': 'Bearer '+jwtKey, 
            'Content-Type':'application/JSON'
          }
        }).then((val)=>{
          val.json().then((content)=>{
            if(val.status==200){
              $('#eventName').text('Pendaftaran '+content.name);
            }
          });
        }).catch((err)=>{
          console.error(err);
          alert(err);
        });
        
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

$(document).keypress(function(event){
  let keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
    if(!onAction){
      enterAction();
    }
  }
});