$(document).on('ready',function() {

  // Place holder
  var languages = [];
  var technologies = [];

  // Build the list of languages and technologies
  $('.repo').each(function(key, value) {
    var classes = $(value).attr('class').split(' ');
    for (var i = 0; i < classes.length; i++) {
      // Add languages
      if (classes[i].indexOf('lang-') > -1) {
        var language = classes[i].substr(5);
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
    $('.faceted-languages').append('<span class=\"language\">' + languages[i] + '</span>');
  }

  for (var i = 0; i < technologies.length; i++) {
    $('.faceted-technologies').append('<span class=\"tech\">' + technologies[i] + '</span>');
  }

  // Click event
  $('.faceted-languages .language').on('click', function(e) {

    var language = $(this).html();
    $('.repo').addClass('hide');
    $('.repo.lang-' + language).removeClass('hide');

    e.preventDefault();
  });

  $('.faceted-technologies .tech').on('click', function(e) {

    var technology = $(this).html();
    $('.repo').addClass('hide');
    $('.repo.tech-' + technology).removeClass('hide');

    e.preventDefault();
  });

});
