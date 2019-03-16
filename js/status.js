let eventId = '';
let serverUrl = '';
let jwtKey = '';

function updateCount(){
  let eventsUrl = serverUrl + '/events/'+eventId+'/attendances';

  fetch(eventsUrl,{
    method: 'GET',
    headers: {
      'Authorization': 'Bearer '+jwtKey, 
      'Content-Type':'application/JSON'
    }
  }).then((val)=>{
    val.json().then((content)=>{
      if(val.status==200){
        $('#attendCount').text(content.length);
        setTimeout(updateCount,2000);
      }else{
        console.error(content);
        alert(content);
      }
    });
  }).catch((err)=>{
    console.error(err);
    alert(err);
  });
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
              $('#eventName').text('Status '+content.name);
            }
          });
        }).catch((err)=>{
          console.error(err);
          alert(err);
        });

        updateCount();
        
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