chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only proceed if the URL has changed and it's an AWS console URL
  if (changeInfo.url && changeInfo.url.includes("console.aws.amazon.com")) {
    try {
      const url = new URL(changeInfo.url);

      // Extract account ID from hostname
      const hostnamePattern =
        /^(\d+)-[a-z0-9]+\.([a-z0-9-]+)\.console\.aws\.amazon\.com/;
      const hostnameMatch = url.hostname.match(hostnamePattern);

      if (!hostnameMatch) return;

      const accountId = hostnameMatch[1];
      const region = hostnameMatch[2];

      // Extract service from the path
      const pathParts = url.pathname.split("/");
      let service = "";

      if (pathParts.length > 1 && pathParts[1]) {
        // Extract the service name, removing any trailing numbers and special characters
        service = pathParts[1]
          .replace(/[0-9]/g, "")
          .replace(/list|home|dashboard/i, "");
      }

      // Create a shortened account ID (first 4 digits)
      const shortAccountId = accountId.slice(0,4);

      // Create a more concise region format that keeps the main region (e.g., "us-east-1" → "us-e1")
      let shortRegion = "";
      const regionParts = region.split("-");
      if (regionParts.length >= 2) {
        // Keep main region (us, eu, ap, etc.), first letter of second part, and the number
        shortRegion =
          regionParts[0] + "-" + regionParts[1].charAt(0) + regionParts[2];
      } else {
        shortRegion = region;
      }

      // Format the new title (more concise)
      const newTitle = `${shortAccountId}|${shortRegion}|${service}`;

      // Update the tab title
      chrome.tabs.update(tabId, { title: newTitle });
    } catch (error) {
      console.error("Error updating AWS tab title:", error);
    }
  }
});

// content.js (optional, for more complex title updates)
// This can be used if you need to extract more info from the page content
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.hostname.includes("console.aws.amazon.com")) {
    // You can add additional logic here if needed
    // For example, extracting service-specific information from the page
  }
});

