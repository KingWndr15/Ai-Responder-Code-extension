let selectedText = "";

// Create context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copy-selected-text",
    title: "Copy to Ai Text Responder",
    contexts: ["selection"],
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "copy-selected-text") {
    // Store the selected text
    selectedText = info.selectionText;

    // Open the popup programmatically (same as clicking the extension icon)
    chrome.action.openPopup();
  }
});

// Listen for messages from popup.js to send the selected text
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_SELECTED_TEXT") {
    sendResponse({ text: selectedText });
  }
});
