 //porgify background script
(() => {

  let self = {
    //Get saved setting and initialize GUI items
    init() {
      chrome.storage.sync.get({
        activate: true,
        contextmenu: true,
        contextmenuActivate: true
      }, function(items) {
        self.updateContextMenu(items);
      });

      chrome.runtime.onInstalled.addListener(self.onInstalled);
      chrome.runtime.onMessage.addListener(self.onMessageReceived);
    },

    //On first install
    onInstalled(details) {
      if (details.reason === "install") {
        chrome.runtime.openOptionsPage();
      }
    },

    //On message received
    onMessageReceived(message, sender, sendResponse) {

      //Option page saved
      if (message.type === "options") {
        self.updateContextMenu(message.items);
      } else if (message.type === "extensions") {
        self.openExtensions();
      }
      if (typeof(sendResponse) === "function")
        sendResponse();
    },

    //Update GUI
    updateContextMenu(items) {

      chrome.contextMenus.remove("porgifyOptions");

      if (items.contextmenu) {
        chrome.contextMenus.create({
          "id": "porgifyOptions",
          "title": chrome.i18n.getMessage("contextMenuOptions"),
          "contexts": ["page"],
          "onclick" () {
            chrome.runtime.openOptionsPage();
          }
        });
      }
    },
  };

  self.init();

})();
