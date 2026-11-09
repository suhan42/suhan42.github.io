//配合hc-mobile-nav的demo改的菜单隐藏在左边（手机适应）
(function($) {
  var $nav = $('.main-nav');
  var $toggle = $('.toggle');
  var defaultData = {
    maxWidth: false,
    customToggle: $toggle,
    navTitle: 'All Categories',
    levelTitles: true
  };

  // we'll store our temp stuff here
  var $clone = null;
  var data = {levelOpen: 'expand', levelSpacing: 25};

  // calling like this only for demo purposes

  const initNav = function(conf) {

    // make copy
    $clone = $nav.clone();

    // call the plugin
    $clone.hcMobileNav($.extend({}, defaultData, data));
  //   测试
  //   console.info(data);
  //   console.info($clone);
  }

  // run first demo
  initNav({});
})(jQuery);


