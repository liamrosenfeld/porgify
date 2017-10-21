(() => {
  let self = {
    //Bind events
    init() {
      //Header
      document.title = chrome.i18n.getMessage("optionsHeader");

      //Lang
      let langs = ["optionsPageActivate", "optionsPageContextLink", "optionsPageContextLinkActivate"];
      for (let i = 0; i < langs.length; i++) {
        let message = chrome.i18n.getMessage(langs[i]);
        document.getElementById(langs[i]).textContent = message;
      }

      //Options
      self.restoreOptions();
      document.getElementById("chkActivate").addEventListener("change", self.saveOptions);
      document.getElementById("chkUseContextMenu").addEventListener("change", self.saveOptions);
      document.getElementById("chkUseContextMenuActivate").addEventListener("change", self.saveOptions);

      //Options info ([LINK] not in use)
      let optionsInfo = chrome.i18n.getMessage("openOptionsInfo").replace("[LINK]", "chrome://extensions/");
      document.getElementById("optionsPage").innerHTML = optionsInfo;

      //Link
      let extensionsLink = document.getElementById("extensionsLink");
      //extensionsLink.addEventListener("click", self.linkExtensions);
      extensionsLink.textContent = "chrome://extensions/";

      //Privacy Terms
      document.getElementById("termsToggle").addEventListener("click", self.togglePrivacyTerms);
    },
    //Save to storage
    saveOptions() {
      var activate = document.getElementById("chkActivate").checked;
      var contextmenu = document.getElementById("chkUseContextMenu").checked;
      var contextmenuActivate = document.getElementById("chkUseContextMenuActivate").checked;
      var items = {
        activate,
        contextmenu,
        contextmenuActivate
      };
      chrome.storage.sync.set(items, function() {
        self.setStatus(activate);
        setTimeout(function() {}, 750);
      });

      //Notify bg.js
      chrome.runtime.sendMessage({
        type: "options",
      });
    },
    //Load from storage
    restoreOptions() {
      chrome.storage.sync.get({
        activate: true,
        contextmenu: true,
        contextmenuActivate: true
      }, function(items) {
        document.getElementById("chkActivate").checked = items.activate;
        document.getElementById("chkUseContextMenu").checked = items.contextmenu;
        document.getElementById("chkUseContextMenuActivate").checked = items.contextmenuActivate;
        self.setStatus(items.activate);
      });
    },
    //Update page with status
    setStatus(active) {
      var url;
      if (active) {
        url = chrome.extension.getURL("porgify/options/on.jpg");
      } else {
        url = chrome.extension.getURL("porgify/options/off.jpg");
      }

      document.getElementById("imgStatus").src = url;
    },
    //Open extensions page (not working, not in use)
    linkExtensions() {
      chrome.runtime.sendMessage({
        type: "extensions"
      });
    },
    togglePrivacyTerms() {
      var holder = document.getElementById("termsHolder");
      if (holder.style.display === "none")
        holder.style.display = "";
      else
        holder.style.display = "none";
    },

  };

  document.addEventListener("DOMContentLoaded", self.init);


})();
