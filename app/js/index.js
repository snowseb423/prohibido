import $ from 'jquery';
// import debounce from 'debounce';

$('#menu').on('click', e => {
  $(['#menu', '#menu2', '#arrow-menu']).toggleClass('clicked');
  e.preventDefault();
});

const medias = () => {
  console.log($("#media").children().length);
  const width = window.innerWidth;
  const height = (width/16)*9;
  $('#medias').css({width, height});
};
medias();
window.addEventListener('resize', medias);
