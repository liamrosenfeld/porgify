//porgify background script
(() => {

    var self = {
        //Get saved setting and initialize GUI items
        init() {
            chrome.storage.sync.get({
                activate: true,
                contextmenu: true,
                contextmenuActivate: true
            }, function (items) {
                self.updateContextMenu(items);
            });

            chrome.runtime.onInstalled.addListener(self.onInstalled);
            chrome.runtime.onMessage.addListener(self.onMessageReceived);
        },

        //On first install
        onInstalled(details) {
            if (details.reason === "install") {
                self.openOptions();
            }
        },

        //On message received
        onMessageReceived(message, sender, sendResponse) {

            //Option page saved
            if (message.type === "options") {
                self.updateContextMenu(message.items);
            }
            else if (message.type === "extensions") {
                self.openExtensions();
            }
            if(typeof (sendResponse) == "function")
                sendResponse();
        },

        //Update GUI
        updateContextMenu(items) {

            chrome.contextMenus.remove("porgifyInactivate");
            chrome.contextMenus.remove("porgifyInactivate");

            if (items.contextmenu && items.activate) {
                chrome.contextMenus.create({
                    "id": "porgifyInactivate",
                    "title": chrome.i18n.getMessage("contextMenuInactivate"),
                    "contexts": ["page"],
                    "onclick"(e) {
                        self.openOptions();
                    }
                });
            } else if (items.contextmenuActivate && !items.activate) {
                chrome.contextMenus.create({
                    "id": "porgifyInactivate",
                    "title": chrome.i18n.getMessage("contextMenuActivate"),
                    "contexts": ["page"],
                    "onclick": function (e) {
                        self.openOptions();
                    }
                });
            }
        },

        //Opens the options tab
        openOptions() {
            var optionsUrl = chrome.extension.getURL('porgify/options/options.html');
            self.openUrl(optionsUrl);

        },

        openUrl(url) {
            chrome.tabs.query({ url }, function (tabs) {
                if (tabs.length) {
                    chrome.tabs.update(tabs[0].id, { active: true });
                    chrome.windows.update(tabs[0].windowId, { focused: true });
                } else {
                    chrome.tabs.create({ url });
                }
            });
        }
    };

    self.init();

})();
