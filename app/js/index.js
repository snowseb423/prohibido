import $ from 'jquery';

$('#menu').on('click', e => {
  $(['#menu', '#menu2', '#arrow-menu']).toggleClass('clicked');
  e.preventDefault();
});
