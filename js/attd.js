let eventId = '';
let serverUrl = '';
let jwtKey = '';

let onAction = false;

let studentExists = false;
let nimChecked = "";

async function submit() {
    if(!onAction) {
        if(nimChecked === $("#nimInput").val() && nimChecked !== "") {
            // NIM is checked and not empty
            if(studentExists) {
                send();
            } else {
                if($("#name").val() !== "") {
                    // Name is not empty
                    if(confirm("A student with name " + $("#name").val() + " will be added to the system. Continue?")) {
                        await addStudent($("#name").val(), $("#nimInput").val());
                        send();
                    }
                } else {
                    alert("Name cannot be empty");
                }
            }
        } else {
            // NIM is not checked
            check();
        }
    }
}

function send(){
    $("#btn-submit").text('Loading...').attr("disabled", "disabled");
    onAction = true;
    //notice('Loading','',false);

    let nimData =  $('#nimInput').val();
    let attendUrl = serverUrl+'/events/'+eventId+'/attend';

    let postData = {
        nim: nimData
    };

    fetch(attendUrl,{
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+jwtKey,
            'Content-Type':'application/JSON'
        },
        body: JSON.stringify(postData)
    }).then((val)=>{
        $("#btn-submit").text('Record attendance');
        $('#nimInput').val('');
        $('#name').val('').attr("disabled", "disabled");
        nimChecked = "";
        studentExists = false;

        if(val.status==200){
            setTimeout(()=>{
                alert('Success!');
            },50);
        }else{
            setTimeout(()=>{
                alert(content.detail);
            },50);
        }
        setTimeout(()=>{
            onAction = false;
        },50);
    }).catch((err)=>{
        console.error(err);
        alert(err);
        $("#btn-submit").text('Record attendance').removeAttr("disabled");
        onAction = false;
    });
}

function check(){
    onAction = true;
    let nimData = $('#nimInput').val();
    let nimUrl = serverUrl + '/students/'+nimData;

    $("#btn-submit").attr("disabled", "disabled");

    nimChecked = "";
    fetch(nimUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '+jwtKey,
            'Content-Type':'application/JSON'
        }
    }).then((val)=>{
        val.json().then((content)=>{
          nimChecked = nimData;
            //closeDialogEnter('notice');
            if(val.status==200){
                studentExists = true;
                $('#name').val(content[0].name).attr("disabled", "disabled");
                $("#btn-submit").removeAttr("disabled");
                onAction = false;
                enterAction = ()=>{send();};
            }else{
                studentExists = false;
                setTimeout(()=>{
                    $('#name').val("").removeAttr("disabled");
                    $("#btn-submit").removeAttr("disabled");

                    onAction = false;
                    //notice(content.detail,'OK',true);
                    //enterAction = ()=>{closeDialogEnter('notice');};
                },50);
            }
        });
    }).catch((err)=>{
        console.error(err);
        alert(err);
        onAction = false;
    });
}

$( document ).ready(function() {
  $("#btn-submit").on('click', function() {
    submit();
  });

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

async function addStudent(name, nim) {
    let response = await fetch(serverUrl + '/students', {
        method: 'POST',
        body: JSON.stringify({name: name, nim: nim}),
        headers: {
            'Authorization': 'Bearer '+jwtKey,
            'Content-Type':'application/JSON'
        }
    });

    return response;
}