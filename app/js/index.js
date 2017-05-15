import $ from 'jquery';
// import debouce from 'debounce';

var location;
if (window.location.hostname == 'localhost')
  location = 'http://'+ window.location.hostname + ':8080';
else
  location = 'http://'+ window.location.hostname;

/////////MENU/////////////////////////////////

$('#menu').on('click', e => {
  $(['#menu', '#menu2', '#arrow-menu']).toggleClass('clicked');
  e.preventDefault();
});

$('a[href^="#"]').click(function(){
	let the_id = $(this).attr('href');
	$('html, body').animate({
		scrollTop:$(the_id).offset().top
	}, 'slow');
	return false;
});

/////////HOMEPAGE///////////////////////////////

if ($('#homepage').height() < window.innerHeight ) {
  let dif = window.innerHeight - $('#homepage').height();
  $('#homepage').css('height', $('#homepage').height() + dif);
  $('#homepage .container.my-full-size').css({
    position: 'absolute',
    bottom: '0px'
  });
}

/////////MEDIAS///////////////////////////////

var countClickMedias = 0;
var width = $(window).width();
var height = (width/16)*9;
var length = $('#medias .container-medias > div').length;

$('#medias').css({'width': width, 'height': height, 'overflow': 'hidden' });
$('#medias .container-medias').css({'width': width*length, 'height': height});
$('#medias .container-medias .media').css({width, height});

$('#medias img').on('click', e => {
  if (e.target.className == 'right-button')
    countClickMedias = countClickMedias+1;
  else if (e.target.className == 'left-button')
    countClickMedias = countClickMedias-1;
  $('#medias .container-medias').css('margin-left', -countClickMedias*width);
  $('#medias img.right-button').css('display', countClickMedias == length-1 ? 'none' : 'inherit');
  $('#medias img.left-button').css('display', countClickMedias == 0 ? 'none' : 'inherit');
  e.preventDefault();
});

$('#team').css({ width, height: width/2});

$('#medias img.right-button').css({
  'margin-top': ( height / 2 ) - 25,
  'margin-left': width - 50,
  'display': countClickMedias == length ? 'none' : 'inherit'
});
$('#medias img.left-button').css({
  'transform': 'rotateY(180deg)',
  'margin-top': ( height / 2 ) - 25,
  'display': countClickMedias == 0 ? 'none' : 'inherit'
});

/////////RESIZE///////////////////////////////

window.addEventListener('resize', () => {
  width = $(window).width();
  height = (width/16)*9;
  $('#team').css({ width, height: width/2});
  $('#medias img.right-button').css({
    'margin-top': ( height / 2 ) - 25,
    'margin-left': width - 50
  });
  $('#medias img.left-button').css({'margin-top': ( height / 2 ) - 25});
  $('#medias').css({'width': width, 'height': height });
  $('#medias .container-medias').css({'width': width*length, 'height': height});
  $('#medias .container-medias .media').css({width, height});
  $('#medias .container-medias').css('margin-left', -countClickMedias * width);
});

////////AJAX////////////////////////////////////

$('#submit-registration').click(() => {
  let mail = $('#email-registration').val();
  $.post(location +'/registration', { mail }, data => {
    if (data === 'done') {
      $('#email-registration').css('border', 'rgba(255,255,255,0.4) solid 1px');
      $('#email-registration, #submit-registration').css({'opacity': '0', 'pointer-events': 'none'});
      $('#replace-registration').css({'opacity': '1', 'pointer-events': 'inherit'});
      setTimeout(() => {
        $('#email-registration, #submit-registration').css({'opacity': '1', 'pointer-events': 'inherit'});
        $('#replace-registration').css({'opacity': '0', 'pointer-events': 'none'});
        $('#email-registration').val('');
        $('#email-registration').attr('placeholder', 'E-mail*');
      }, 7000);
    } else if (data === 'false') {
      $('#email-registration').css('border', '1.5px solid red');
      $('#email-registration').val('');
      $('#email-registration').attr('placeholder', 'Veuillez saisir une adresse valide');
    }
  });
});

$('#submit-sendmail').click(() => {
  if($('#select-sendmail').val() == 'empty')
    $('#select-sendmail').css('border', '1.5px solid red');
  else
    $('#select-sendmail').css('border', 'rgba(255,255,255,0.4) solid 1px');
  const elements = [
    $('#email-sendmail'),
    $('#number-sendmail'),
    $('#date-sendmail'),
    $('#peoples-sendmail')
  ];
  elements.forEach(e => {
    if (!e.val())
      e.css({border: '1.5px solid red'});
    else
      e.css({border: 'rgba(255,255,255,0.4) solid 1px'});
  });
  if (
    $('#select-sendmail').val() != 'empty' &&
    $('#email-sendmail').val() &&
    $('#number-sendmail').val() &&
    $('#date-sendmail').val() &&
    $('#peoples-sendmail').val()
  ) {
    let mail = {
      objet : $('#select-sendmail').val(),
      email : $('#email-sendmail').val(),
      tel : $('#number-sendmail').val(),
      date : $('#date-sendmail').val(),
      nombre : $('#peoples-sendmail').val(),
      message : $('#txt-sendmail').val()
    };
    $.post(location +'/sendmail', mail, data => {
      if (data === 'done') {
        $('#form-sendmail').css({'opacity': '0', 'pointer-events': 'none'});
        $('#replace-sendmail').css({'opacity': '1', 'pointer-events': 'inherit'});
        setTimeout(() => {
          $('#form-sendmail').css({'opacity': '1', 'pointer-events': 'inherit'});
          $('#replace-sendmail').css({'opacity': '0', 'pointer-events': 'none'});
          $('#txt-sendmail').val('');
          elements.forEach(e => {
            e.val('');
          });
        }, 7000);
      }
    });
  }
});
