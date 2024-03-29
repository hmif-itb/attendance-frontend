let eventId = '';
let serverUrl = '';
let jwtKey = '';

let lastNim = 0;
let lastArr = [];

function viewAll(){

  openDialog('list');

  $("#listName").html('<div style="margin-top:20px;margin-bottom:20px;" ><b>Loading...</b></div>')
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
        $('#listName').append('<li class="list-item">'+userData[0].nim+' - ' + userData[0].name+'</li>');
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
              $('#eventName').text(content.name);
            }
          });
        }).catch((err)=>{
          console.error(err);
          alert(err);
        });

        updateCount();
        
      }else{
        window.location.href = '/event.html';
      }
    }else{
      window.location.href = '/' ;
    }
  }else{
    alert('Error, URL not supplied');
  }
});
