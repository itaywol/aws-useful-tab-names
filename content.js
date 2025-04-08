// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateTitle" && message.title) {
    // Update the page title
    document.title = message.title;
    console.log("Title updated to:", message.title);
    
    // Send a response back to confirm
    sendResponse({ success: true });
    
    // Set up a MutationObserver to catch if AWS tries to change the title back
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target === document.querySelector('title')) {
          // If AWS changes title back, we reapply our custom title
          if (document.title !== message.title) {
            document.title = message.title;
          }
        }
      });
    });
    
    // Start observing the title element
    const titleElement = document.querySelector('title');
    if (titleElement) {
      observer.observe(titleElement, { childList: true, characterData: true, subtree: true });
    }
  }
  return true; // Keep the message channel open for async responses
});

console.log("AWS Console Title Changer content script loaded"); 