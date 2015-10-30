(function($) {
  $(function() {
    var handleNavigationHover, handlePageUpdate, handlePortfolioModule, handleContactForm, fullPageOptionsInjector;

    handleNavigationHover = function(event) {
      var span = $(this).find('span');
      var defaultCSS = {
        'padding-left': '',
        'background-color': '',
        'text-align': ''
      };

      var mouseEnterCSS = $.extend(true, {}, defaultCSS);
      mouseEnterCSS['background-color'] = '#FF9900';
      mouseEnterCSS['padding-left'] = '25px';
      mouseEnterCSS['text-align'] = 'left';

      var mouseLeaveCSS = $.extend(true, {}, defaultCSS);
      mouseLeaveCSS['background-color'] = '#424242';
      mouseLeaveCSS['padding-left'] = '0px';
      mouseLeaveCSS['text-align'] = 'center';

      if(event.type == 'mouseenter') {
        span.css({'padding-left': '5px'}).show().parent().animate({
          'width': '150px'
        }, 200).css(mouseEnterCSS);
      }
      if(event.type == 'mouseleave') {
        span.hide().parent().animate({
          'width': '80px'
        }, 200).css(mouseLeaveCSS);
      }
    };

    handlePageUpdate = function() {
      var cache = 'FourGigaByte - {page}';
      var hash = location.hash.replace(/^#/, '') || 'home';
      var navItems = [];
      var spanText = '';

      document.title = cache.replace('{page}', caseFirstLetter('uppercase', hash));

      $('.navigation a').each(function() {
        spanText = $(this).find('span').text().toLowerCase();
        if(spanText == hash.toLowerCase()) {
          $('.navigation a').removeClass('active');
          $(this).addClass('active');
        }
      });

      function caseFirstLetter(lettercase, string) {
        if(lettercase == 'uppercase') return string.charAt(0).toUpperCase() + string.slice(1);
        if(lettercase == 'lowercase') return string.charAt(0).toLowerCase() + string.slice(1);
      }
    };

    handlePortfolioModule = function() {
      var sliderControls = {
        'close': $('.portfolio-slider-controls a[data-tooltip="Close"]'),
        'next': $('.portfolio-slider-controls a[data-tooltip="Next Slide"]'),
        'prev': $('.portfolio-slider-controls a[data-tooltip="Previous Slide"]')
      };

      $.each(sliderControls, function(name, element) {
        element.on('click', function(e) {
          e.preventDefault();
        });
      });

      sliderControls.close.on('click', function() {
        $('.modal').fadeOut(200);
      });

      $('#portfolio .portfolio-item').on('click', function() {
        $('.portfolio-slider .portfolio-item-slide-information').html($(this).find('.portfolio-information').html());
        $('.portfolio-slider .portfolio-item-slide-preview img').attr('src', $(this).find('.portfolio-preview').attr('src'));
        $('.modal').fadeIn(200);
      });
    };

    handleContactForm = function(e) {
      e.preventDefault();

      var name = $(this).find('#first-name'),
          email = $(this).find('#email-addr'),
          msg = $(this).find('#message-body'),
          csrf = $(this).find('#csrf_token'),
          errors = '';

      if(isEmpty(name.val())) {
        errors += "Please enter a valid username \n";
      }
      if(!isValidEmail(email.val())) {
        errors += "Please enter a valid email address \n";
      }
      if(isEmpty(msg.val())) {
        errors += "Please enter a valid message \n";
      }

      if(!isEmpty(errors)) {
        swal({
          title: 'Woah there!',
          text: errors,
          type: 'error'
        });
        return;
      }

      $('.loader').fadeIn(400);

      $.ajax({
        type: 'POST',
        url: 'api/contact/submit',
        data: {
          name: name.val(),
          email: email.val(),
          message: msg.val(),
          csrf_token: csrf.val()
        }
      }).success(function(res) {
        $('.loader').fadeOut(200);
        if(res.error) {
          swal('We ran into a slight problem', res.error, 'error');
          return;
        }
        if(res.message === 'success') {
          name.val('');
          email.val('');
          msg.val('');
          swal('Awesome!', 'Your inquiry has been submitted!', 'success');
        }
      });

      function isEmpty(str){
        return !str.replace(/^\s+/g, '').length;
      }
      function isValidEmail(email) {
          var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
          return re.test(email);
      }
    };

    fullPageOptionsInjector = function() {
      var options = {
        anchors: [],
        menu: '.navigation',
        css3: false,
        verticalCentered: true
      };
      var spanText = '';
      $('.navigation a').each(function() {
        spanText = $(this).find('span').text().toLowerCase();
        options.anchors.push(spanText);
      });
      return options;
    };

    $('.pages').fullpage(fullPageOptionsInjector);
    $('.navigation a').each(function() {
      $(this).on('mouseenter mouseleave', handleNavigationHover);
    });
    $(window).on('hashchange', handlePageUpdate);
    $('#contact-form form').on('submit', handleContactForm);

    handlePageUpdate();
    handlePortfolioModule();
  });
})(jQuery);
