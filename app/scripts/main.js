
const API_ROOT = 'https://api.github.com/users/';

var Router = Backbone.Router.extend({
  routes: {
    "": "showAbout",
    "about": "showAbout",
    ":name/repos": "showRepos",
    ":name": "showProfile"
  },

  showAbout: function() {
    this.navigate("#rynatk", { trigger: true });
  },

  showProfile: function(name) {
    Promise.all([
      this.showPage('profile'),
      $.get(API_ROOT + name)
    ]).then(function(data) {
      var profile = data[1];
      $('.content img').attr('src', profile.avatar_url);
      $('.content h1').text(profile.name);
      $('.content h2').text(profile.login);
      $('.memberSince').append(profile.created_at);
      $('.profileName').append(profile.name);
      $('.profileCompany').append(profile.company);
      $('.profileBlog').append(profile.blog);
      $('.profileLocation').append(profile.location);
      $('.profileEmail').append(profile.email);
      $('.profileHireable').append(profile.hireable);
      $('.profileBio').append(profile.bio);
      $('.profileRepos').append(profile.public_repos);
      $('.profileGists').append(profile.public_gists);
      $('.profileFollowers').append(profile.followers);
      $('.profileFollowing').append(profile.following);
    });
  },

  showRepos: function(name) {
    Promise.all([
      this.showPage('repos'),
      $.get(API_ROOT + name + '/repos')
    ]).then(function(data) {
      $('.content h2').text(data[1][1].owner.login + '\'s Repositories');
      _.each(data[1], function (repo) {
        $('.content ul').append('<li class="list-group-item"><a href="https://github.com/' + name + '/' + repo.name + '">' + repo.name + '</a></li>');
      })
    });
  },

  showPage: function(pageName) {
    document.title = "Github - " + pageName.toUpperCase();

    $('.nav li').removeClass('active');
    $('.nav li.' + pageName).addClass('active');

    return $.get(pageName + '.html').then(function(response) {
      $('.content').html(response);
    });
  },

  initialize: function() {
    Backbone.history.start();
  }
});

$(function() {
  var router = new Router();

  $('#searchForm').submit(function(event) {
    var userName = $('#userSearch').val();
    router.navigate("#" + userName, { trigger: true });
    return false;
  });
})
