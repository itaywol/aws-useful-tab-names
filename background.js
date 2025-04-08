chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only proceed if the URL has changed and it's an AWS console URL
  const scrapedUrl = changeInfo.url || tab.url;
  if (scrapedUrl && scrapedUrl.includes("console.aws.amazon.com")) {
    console.log(`Processing AWS URL: ${scrapedUrl}`);
    try {
      const url = new URL(scrapedUrl);
      let accountId = "";
      let region = "";

      // Extract account ID from hostname - works with multiple AWS URL formats
      const hostnamePattern = /^(\d+)(?:-[a-z0-9]+)?\.([a-z0-9-]+)\.console\.aws\.amazon\.com/;
      const hostnameMatch = url.hostname.match(hostnamePattern);
      
      console.log(`Hostname: ${url.hostname}`);
      console.log(`Hostname match:`, hostnameMatch);

      if (hostnameMatch) {
        accountId = hostnameMatch[1];
        region = hostnameMatch[2];
        console.log(`Extracted from hostname - Account ID: ${accountId}, Region: ${region}`);
      }

      // If region not found in hostname, try query parameters
      if (!region && url.searchParams.has("region")) {
        region = url.searchParams.get("region");
        console.log(`Region from query params: ${region}`);
      }

      // Skip if we couldn't extract account or region
      if (!accountId || !region) {
        console.log(`Missing account ID (${accountId}) or region (${region}), skipping...`);
        return;
      }

      // Extract service from the path
      const pathParts = url.pathname.split("/");
      let service = "";
      console.log(`Path parts:`, pathParts);

      if (pathParts.length > 1 && pathParts[1]) {
        // Extract the service name, removing any trailing numbers and special characters
        service = pathParts[1]
          .replace(/list|home|dashboard/i, "");
        console.log(`Extracted service: ${service}`);
      }

      // Create a shortened account ID (first 4 digits)
      const shortAccountId = accountId.slice(0, 4);
      console.log(`Short account ID: ${shortAccountId}`);

      // Create a more concise region format that keeps the main region (e.g., "us-east-1" → "us-e1")
      let shortRegion = "";
      const regionParts = region.split("-");
      console.log(`Region parts:`, regionParts);
      
      if (regionParts.length >= 3) {
        // Keep main region (us, eu, ap, etc.), first letter of second part, and the number
        shortRegion =
          regionParts[0] + "-" + regionParts[1].charAt(0) + regionParts[2];
      } else {
        shortRegion = region;
      }
      console.log(`Short region: ${shortRegion}`);

      // Format the new title (more concise)
      const newTitle = `${shortAccountId}|${shortRegion}|${service}`;
      console.log(`Setting new tab title: ${newTitle}`);

      // Send message to content script instead of updating tab directly
      chrome.tabs.sendMessage(tabId, { action: "updateTitle", title: newTitle }, (response) => {
        if (chrome.runtime.lastError) {
          // Content script might not be loaded yet, inject it
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: injectTitleChanger,
            args: [newTitle]
          });
        }
      });
    } catch (error) {
      console.error("Error updating AWS tab title:", error);
    }
  }
});

// Function to be injected into the page
function injectTitleChanger(newTitle) {
  // Update the document title
  document.title = newTitle;
  
  // Also listen for future messages from the background script
  window.addEventListener("message", (event) => {
    if (event.data && event.data.action === "updateTitle") {
      document.title = event.data.title;
    }
  });
  
  // Let the background script know we've updated the title
  chrome.runtime.sendMessage({ status: "title_updated" });
}

chrome.runtime.onStartup.addListener(() => {
  console.log("Background script started");
});
