// Detect text selection
document.addEventListener("mouseup", function () {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    // Send selected text to background script to store
    chrome.runtime.sendMessage({
      type: "STORE_SELECTED_TEXT",
      text: selectedText,
    });
  }
});

// Listen for message to populate popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "POPULATE_POPUP") {
    // When popup opens, if there's stored text, copy it to clipboard
    if (message.text) {
      navigator.clipboard.writeText(message.text).catch((err) => {
        console.error("Failed to copy text: ", err);
      });
    }
  }
});
