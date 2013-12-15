var messages = null;

$(function(){

    $('#messages .list-group').on('click', 'a', function() {
        var clickId = $(this).data('id');
        $.each(messages, function(idx, elm){
            if (elm.id == clickId) {
                $('#message-plain').text(elm.text);

                var newIframe = document.createElement('iframe');
                newIframe.width = '100%';
                newIframe.height = '350';
                newIframe.border = '0';
                newIframe.src = 'about:blank';
                $('#message-html').html(newIframe);
                newIframe.contentWindow.document.open('text/html', 'replace');
                newIframe.contentWindow.document.write(elm.html);
                newIframe.contentWindow.document.close();

                $('#message-json pre').text(JSON.stringify(elm, null, " "));
                $('#message-subject').text(elm.subject);
                $('#message-date').text(elm.headers.date);

                // compose the from/to/cc/bcc fields
                $.each(['from', 'to', 'cc', 'bcc'], function(idx,field){
                    var addresses = [];
                    if (elm[field]) {
                        $.each(elm[field], function(idx, address) {
                            addresses.push(address.name + ' <' + address.address + '>')
                        });
                    }
                    $('#message-' + field).text(addresses.join(', '));
                    if (addresses.length == 0) {
                        $('#message-' + field).parent('tr').hide();
                    }
                    else {
                        $('#message-' + field).parent('tr').show();
                    }

                });
            }
        });
        return false;
    });
});


var socket = io.connect('//');
socket.on('mailset', function (data) {
    messages = data;
    $('#messages .list-group').html('');
    $.each(data, function(idx, elm) {
        $('#messages .list-group').append('<a class="list-group-item" href="#" data-id="'+ elm.id +'"><strong>'+ elm.subject +'</strong><br/><small>'+ elm.headers.date +'</small></a>');
    });
});