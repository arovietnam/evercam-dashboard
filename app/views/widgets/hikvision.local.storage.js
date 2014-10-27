/*!
 * LocalStorage JavaScript v0.0.1
 * http://www.evercam.io/
 *
 * Copyright 2014 Evercam.io
 * Released
 *
 * Date: 2014-07-15
 */
(function(window) {

    "use strict";

    // Localize jQuery variable
    var jQuery,
        playbackUrl = 'http://playback.azurewebsites.net/home/doc/page/main.aspx';
          /*cameraId: "",
          token: "",
          api_id: "",
          api_key: ""*/

    function scriptLoadHandler() {
      // Restore $ and window.jQuery to their previous values and store the
      // new jQuery in our local jQuery variable
      jQuery = window.jQuery.noConflict(true);
      // Call our main function
      initStorage();
    };

    function initStorage() {
        var priv = <%= params[:private] %>;

        if(priv) {
            var iframe =
            jQuery("<iframe />")
            .css({ "overflow-y": "hidden", "overflow-x": "scroll", "width": "100%", "height": "640px" })
            .attr({ "src": '<%= request.base_url %>/hikvision.private.widget?camera=<%= params[:camera] %>&token=<%= params[:token] %>&api_id=<%= params[:api_id] %>&api_key=<%= params[:api_key] %>', "frameborder": "0" })
            .appendTo("div[evercam='localstorage']");
        } else {
            var iframe =
            jQuery("<iframe />")
            .css({ "overflow-y": "hidden", "overflow-x": "scroll", "width": "100%", "height": "640px" })
            .attr({ "src": playbackUrl + '?camera=<%= params[:camera] %>&token=<%= params[:token] %>&api_id=<%= params[:api_id] %>&api_key=<%= params[:api_key] %>', "frameborder": "0" })
            .appendTo("div[evercam='localstorage']");
        }
    };

    /* Load jQuery if not present */
    if (window.jQuery === undefined) {
      var script_tag = document.createElement('script');
      script_tag.setAttribute("type", "text/javascript");
      script_tag.setAttribute("src",
        "https://code.jquery.com/jquery-2.1.1.min.js");

      if (script_tag.readyState) {
          script_tag.onreadystatechange = function () { // For old versions of IE
              if (this.readyState === 'complete' || this.readyState === 'loaded') {
                  scriptLoadHandler();
              }
          };
      } else {
          script_tag.onload = scriptLoadHandler;
      }
      // Try to find the head, otherwise default to the documentElement
      (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);

    } else {
      // The jQuery version on the window is the one we want to use
      jQuery = window.jQuery;
      initStorage();
    }

}(window));
