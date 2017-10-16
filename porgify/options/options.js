(function() {
  self = {
    //Bind events
    init: function() {
      //Analytics
      (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function() {
          (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
          m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
      })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

      ga('create', 'UA-108160361-1', 'auto'); // Replace with your property ID.
      ga('send', 'pageview');

      //Header
      document.title = chrome.i18n.getMessage("optionsHeader");

      //Lang
      var langs = ["optionsPageActivate", "optionsPageContextLink", "optionsPageContextLinkActivate"];
      for (var i = 0; i < langs.length; i++) {
        var message = chrome.i18n.getMessage(langs[i]);
        document.getElementById(langs[i]).textContent = message;
      }

      //Options
      self.restoreOptions();
      document.getElementById('chkActivate').addEventListener('change', self.saveOptions);
      document.getElementById('chkUseContextMenu').addEventListener('change', self.saveOptions);
      document.getElementById('chkUseContextMenuActivate').addEventListener('change', self.saveOptions);

      //Options info ([LINK] not in use)
      var optionsInfo = chrome.i18n.getMessage("openOptionsInfo").replace("[LINK]", "chrome://extensions/");
      document.getElementById("optionsPage").innerHTML = optionsInfo;

      //Link
      var extensionsLink = document.getElementById('extensionsLink');
      //extensionsLink.addEventListener('click', self.linkExtensions);
      extensionsLink.textContent = "chrome://extensions/";

      //Privacy Terms
      document.getElementById('termsToggle').addEventListener('click', self.togglePrivacyTerms);
    },
    //Save to storage
    saveOptions: function() {
      var activate = document.getElementById('chkActivate').checked;
      var contextmenu = document.getElementById('chkUseContextMenu').checked;
      var contextmenuActivate = document.getElementById('chkUseContextMenuActivate').checked;
      var items = {
        activate: activate,
        contextmenu: contextmenu,
        contextmenuActivate: contextmenuActivate
      };
      chrome.storage.sync.set(items, function() {
        self.setStatus(activate);
        setTimeout(function() {}, 750);
      });

      //Notify bg.js
      chrome.runtime.sendMessage({
        type: "options",
        items: items
      }, function(response) {
        var a = "";
      });
    },
    //Load from storage
    restoreOptions: function() {
      chrome.storage.sync.get({
        activate: true,
        contextmenu: true,
        contextmenuActivate: true
      }, function(items) {
        document.getElementById('chkActivate').checked = items.activate;
        document.getElementById('chkUseContextMenu').checked = items.contextmenu;
        document.getElementById('chkUseContextMenuActivate').checked = items.contextmenuActivate;
        self.setStatus(items.activate);
      });
    },
    //Update page with status
    setStatus: function(active) {
      var url;
      if (active) {
        url = chrome.extension.getURL('porgify/options/on.jpg');
      } else {
        url = chrome.extension.getURL('porgify/options/off.jpg');
      }

      document.getElementById('imgStatus').src = url;
    },
    //Open extensions page (not working, not in use)
    linkExtensions: function() {
      chrome.runtime.sendMessage({
        type: "extensions"
      }, function(response) {
        var a = "";
      });
    },
    togglePrivacyTerms: function() {
      var holder = document.getElementById('termsHolder');
      if (holder.style.display == "none")
        holder.style.display = "";
      else
        holder.style.display = "none";
    },

  };

  document.addEventListener('DOMContentLoaded', self.init);


})();
