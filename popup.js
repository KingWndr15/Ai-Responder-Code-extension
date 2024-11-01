document.addEventListener("DOMContentLoaded", () => {
  // Request the selected text from the background script
  chrome.runtime.sendMessage({ type: "GET_SELECTED_TEXT" }, (response) => {
    if (response && response.text) {
      document.getElementById("message-input").value = response.text;
    }
  });
});

let generatedResponse = "";

document
  .getElementById("message-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = document.getElementById("message-input").value;
    const style = document.getElementById("style-select").value;
    const responseArea = document.getElementById("response-area");
    const copyButton = document.getElementById("copy-button");

    responseArea.innerHTML =
      '<p style="color: #888;">Generating response...</p>';
    copyButton.style.display = "none";

    try {
      const response = await fetch("http://localhost:3000/api/v1/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, style }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      generatedResponse = data.response;

      responseArea.innerHTML = `<p>${generatedResponse}</p>`;
      copyButton.style.display = "block";
    } catch (error) {
      responseArea.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
      console.error("Fetch error:", error);
    }
  });

// Copy response to clipboard
document.getElementById("copy-button").addEventListener("click", () => {
  navigator.clipboard
    .writeText(generatedResponse)
    .then(() => {
      alert("Response copied to clipboard!");
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
    });
});
