import $ from 'jquery';
// import debouce from 'debounce';

/////////MENU/////////////////////////////////

$('#menu').on('click', e => {
  $(['#menu', '#menu2', '#arrow-menu']).toggleClass('clicked');
  e.preventDefault();
});

$('a[href^="#"]').click(function(){
	let the_id = $(this).attr("href");
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
