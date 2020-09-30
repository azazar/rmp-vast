(function() {
  // Settings ///
  
  var containerId = 'rmpPlayer';
  
  var adTags = [
    'data:text/xml,',
    'https://www.radiantmediaplayer.com/vast/tags/empty.xml',
    'https://www.radiantmediaplayer.com/vast/tags/inline-linear-skippable-per-cent.xml',
  ];

  var params = {
    displayClickLink: true,
    styleForClickLink: 'color: #0f0',
    clickLinkDelay: 5,
    skipOverride: 1,
    enableVpaid: true,
    playVastOnPageLoad: false,
  };
  
  var cssUrl = '../css/rmp-vast.min.css';
  var jsUrl = '../js/dist/rmp-vast.min.js';
  
  //////////////

  var attachVast = function() {
    var container = document.getElementById(containerId);
    
    if (container.clientWidth === 0 || container.clientHeight === 0) {
      window.setTimeout(attachVast, 100);
      return;
    }
    
    container.style.minWidth = container.clientWidth + 'px';
    container.style.minHeight = container.clientHeight + 'px';

    var child = container.children[0];
    var video;
    
    var contentWrapper;
    
    if (child.tagName === 'VIDEO') {
      contentWrapper = document.createElement('DIV');
      child.parentNode.removeChild(child);
      contentWrapper.appendChild(child);
      container.appendChild(contentWrapper);
      video = child;
    }
    else {
      contentWrapper = child;
      video = contentWrapper.querySelector('VIDEO');
    }
    
    container.classList.add('rmp-container');
    contentWrapper.classList.add('rmp-content');
    video.classList.add('rmp-video');

    var rmpVast = new RmpVast(containerId, params);

    if (params.playVastOnPageLoad) {
      rmpVast.loadAds(adTags);
    } else {
      var play = true;
      rmpVast.contentPlayer.addEventListener('play', function (event) {
        if (play) {
          rmpVast.loadAds(adTags);
          event.preventDefault();
          play = false;
        }
      });
    }

    container.addEventListener('adimpression', function () {
      // Place impression tracker code here
    });

    container.addEventListener('adclick', function () {
      // Place click tracker code here
    });
  };

  var cssId = 'rmp_vast_css_link';
  if (!document.getElementById(cssId)) {
    var link = document.createElement('link');
    link.setAttribute('id', cssId);
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', cssUrl);
    document.head.appendChild(link);
  }
  
  var jsId = 'rmp_vast_js';
  if (!document.getElementById(jsId)) {
    var script = document.createElement('script');
    script.setAttribute('id', jsId);
    script.setAttribute('type', 'text/javascript');
    document.head.appendChild(script);
    script.addEventListener('load', attachVast);
    script.setAttribute('src', jsUrl);
  }
  else {
    attachVast();
  }
  
})();
