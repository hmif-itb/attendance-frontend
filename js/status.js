let eventId = '';
let serverUrl = '';
let jwtKey = '';

let lastNim = 0;
let lastArr = [];

function viewAll(){
  notice('Loading','',false);

  let namePromise = [];

  lastArr.forEach(el => {
    let nimUrl = serverUrl + '/students/'+el;
    namePromise.push(fetch(nimUrl,{
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+jwtKey, 
        'Content-Type':'application/JSON'
      }
    }));
  });

  Promise.all(namePromise).then((val)=>{
    $('#listName').empty();
    val.forEach(el=>{
      el.json().then((userData)=>{
        $('#listName').append('<p class="no-margin">'+userData[0].name+'</p>');
        closeDialog('notice');
        openDialog('list');
        console.log(userData[0].name);
      });
    });
  }).catch((err)=>{

  });
  
}

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
        lastArr = content;
        $('#attendCount').text(content.length);
        let tempNim = 0;
        
        if(content[0]){
          tempNim = content[0];

        }
        
        if(lastNim!=tempNim){
          lastNim = tempNim;
  
          let nimUrl = serverUrl + '/students/'+lastNim;
  
          fetch(nimUrl,{
            method: 'GET',
            headers: {
              'Authorization': 'Bearer '+jwtKey, 
              'Content-Type':'application/JSON'
            }
          }).then((val)=>{
            val.json().then((content)=>{
              if(val.status==200){
                $('#lastAttend').text(content[0].name);
              }
            });
          }).catch((err)=>{
            console.error(err);
            alert(err);
          });
        }
        setTimeout(updateCount,1000);
      }else{
        console.error(content);
        alert(content.detail);
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
