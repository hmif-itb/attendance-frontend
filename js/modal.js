function closeDialog(modalName){
    $('#modal-'+modalName).removeClass('modal-open');
}

function openDialog(modalName){
    $('#modal-'+modalName).addClass('modal-open');
}

function notice(message, btnText, dismissable){
    $('#noticeBtn').text(btnText);
    $('#noticeBtn').show();
    $('#noticeText').text(message);
    if(!dismissable){
        $('#noticeBtn').hide();
    }
    $('#modal-notice').addClass('modal-open');
}