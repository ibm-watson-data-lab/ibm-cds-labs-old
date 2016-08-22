$(document).on('ready', function() {

  // Place holder
  var languages = [];
  var technologies = [];

  // Build the list of languages and technologies
  $('.repo').each(function(key, value) {
    var classes = $(value).attr('class').split(' ');
    for (var i = 0; i < classes.length; i++) {
      // Add languages
      if (classes[i].indexOf('language-') > -1) {
        var language = classes[i].substr(9);
        if (languages.indexOf(language) < 0) {
          languages.push(language);
        }
      }

      // Add technologies
      if (classes[i].indexOf('tech-') > -1) {
        var technology = classes[i].substr(5);
        if (technologies.indexOf(technology) < 0) {
          technologies.push(technology);
        }
      }
    }
  });

  for (var i = 0; i < languages.length; i++) {
    var langwidget = '<button class=\"btn language\">';
    langwidget += '<span class=\"data\" >' + languages[i] + '</span>';
    langwidget += '<i class="fa fa-square-o"></i></button>';
    $('.faceted-languages').append(langwidget);
  }

  for (var i = 0; i < technologies.length; i++) {
    var techwidget = '<button class=\"btn tech\">';
    techwidget += '<span class=\"data\" >' + technologies[i] + '</span>';
    techwidget += '<i class="fa fa-square-o"></i></button>';
    $('.faceted-technologies').append(techwidget);
  }

  // Click event
  $('.faceted-languages .language, .faceted-technologies .tech').on('click', function(e) {

    var checkbox = $(this).children('i.fa');
    if (checkbox.hasClass('fa-square-o')) {
      checkbox.removeClass('fa-square-o');
      checkbox.addClass('fa-check-square-o');
    } else {
      checkbox.addClass('fa-square-o');
      checkbox.removeClass('fa-check-square-o');
    }

    $('.repo').addClass('hide');

    if ($('i.fa.fa-check-square-o').length == 0) {
      $('.repo').removeClass('hide');
    }

    $('i.fa.fa-check-square-o').each(function(key, value) {
      var container = $(value).parent();
      var word = container.attr('class').substr(4);
      $('.repo.' + word + '-' + container.children('span.data').html()).removeClass('hide');
    });

    trackClick();
    e.preventDefault();
  });

});

function trackClick() {
  var chk = '';
  $('button.tech').each(function() {
    if ( $(this).children('i.fa').first().hasClass('fa-check-square-o') ) {
      chk += 'tech-' + $(this).children('span').first().text() + ',';
    }
  });
  $('button.language').each(function() {
    if ( $(this).children('i.fa').first().hasClass('fa-check-square-o') ) {
      chk += 'language-' + $(this).children('span').first().text() + ',';
    }
  });
  chk = chk.substr(0, chk.length-1);
  _paq.push(['trackEvent', 'Facets', chk]);
}