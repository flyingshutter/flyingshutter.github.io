function setFontSizes() {
  var scale = document.devicePixelRatio;
  console.log(scale);
  $('html')[0].style['font-size'] = 14*scale +'px';
  $('html')[0].style;
  $(window).trigger('resize');
  // $('body')[0].style['font-size'] = 140*scale +'px';
}
