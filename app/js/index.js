import $ from 'jquery';

$('#menu').on('click', e => {
  $('#menu').toggleClass('clicked');
  $('#menu2').toggleClass('clicked');
  $('#arrow-menu').toggleClass('clicked');
  e.preventDefault();
});
