/*
    jquery.showTweets.js

    Author: Mike Haugland
    Date: Dec 4th, 2011
    Version: 1.0.0
*/

(function( $ ){

  $.fn.showTweets = function( options ) {

    var settings = $.extend( {
      'username'         : 'mikehaugland',
      'amount' : 2,
      'includeReplies' : false,
      'includeRetweets' : false
    }, options);

    $.fn.extend({
      linkUrl: function() {
        var returning = [];
        var regexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
        this.each(function() {
          returning.push(this.replace(regexp,"<a href=\"$1\">$1</a>"));
        });
        return $(returning);
      },
      linkUser: function() {
        var returning = [];
        var regexp = /[\@]+([A-Za-z0-9-_]+)/gi;
        this.each(function() {
          returning.push(this.replace(regexp,"<a href=\"http://twitter.com/$1\">@$1</a>"));
        });
        return $(returning);
      },
      linkHash: function() {
        var returning = [];
        var regexp = / [\#]+([A-Za-z0-9-_]+)/gi;
        this.each(function() {
          returning.push(this.replace(regexp, ' <a href="http://search.twitter.com/search?q=&tag=$1">#$1</a>'));
        });
        return $(returning);
      },
      makeHeart: function() {
        var returning = [];
        this.each(function() {
          returning.push(this.replace(/(&lt;)+[3]/gi, "<tt class='heart'>&#x2665;</tt>"));
        });
        return $(returning);
      }
    });

    return this.each(function(){
      var node = $(this);

      var endpoint = "http://api.twitter.com/1/statuses/user_timeline.json?callback=?";
      endpoint += "&screen_name=" + settings.username;
      endpoint += "&count=" + settings.amount;
      endpoint += "&include_rts=" + settings.includeRetweets;
      endpoint += "&exclude_replies=" + !settings.includeReplies;

      $.getJSON(endpoint, function(data) {
        node.empty();
        $.each(data, function(i, tweet) {
          var from_user = tweet.from_user || tweet.user.screen_name;
          node.append('<li><span class="tweet_text">'+$([tweet.text]).linkUrl().linkUser().linkHash().makeHeart()[0]+'</span><div class="tweet_metadata"><span class=""><a href="http://twitter.com/'+from_user+'/status/'+tweet.id_str+'" title="view tweet on twitter">'+$.relativeTime(tweet.created_at)+'</a></span></div></li>');
        });
      });
    });

  };

})( jQuery );
