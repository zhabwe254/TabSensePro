const categories = {
  'Video': ['youtube', 'vimeo', 'netflix', 'hulu', 'twitch'],
  'Social': ['facebook', 'twitter', 'instagram', 'linkedin', 'reddit'],
  'Educational': ['coursera', 'edx', 'udemy', 'khanacademy', '.edu'],
  'Work': ['docs.google', 'sheets.google', 'slack', 'trello', 'asana'],
  'News': ['news', 'bbc', 'cnn', 'nytimes', 'reuters'],
  'Shopping': ['amazon', 'ebay', 'etsy', 'walmart', 'shopify'],
  'Other': []
};

const categoryColors = {
  'Video': 'red',
  'Social': 'blue',
  'Educational': 'green',
  'Work': 'yellow',
  'News': 'orange',
  'Shopping': 'pink',
  'Other': 'purple'
};

function categorizeTabs() {
  chrome.tabs.query({}, (tabs) => {
    const categorizedTabs = {};
    tabs.forEach((tab) => {
      const category = getCategoryForTab(tab);
      if (!categorizedTabs[category]) {
        categorizedTabs[category] = [];
      }
      categorizedTabs[category].push(tab.id);
    });

    for (const [category, tabIds] of Object.entries(categorizedTabs)) {
      chrome.tabs.group({ tabIds }, (groupId) => {
        chrome.tabGroups.update(groupId, { 
          title: category, 
          collapsed: false,
          color: categoryColors[category]
        });
      });
    }
  });
}

function getCategoryForTab(tab) {
  const url = new URL(tab.url);
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => url.hostname.includes(keyword))) {
      return category;
    }
  }
  return 'Other';
}

function toggleCategoryVisibility(category, isVisible) {
  chrome.tabs.query({}, (tabs) => {
    const groupIds = new Set();
    tabs.forEach((tab) => {
      if (tab.groupId !== -1) {
        groupIds.add(tab.groupId);
      }
    });

    groupIds.forEach((groupId) => {
      chrome.tabGroups.get(groupId, (group) => {
        if (group.title === category) {
          chrome.tabGroups.update(groupId, { collapsed: !isVisible });
        }
      });
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'categorizeTabs') {
    categorizeTabs();
    sendResponse({ status: 'success' });
  } else if (request.action === 'toggleCategory') {
    toggleCategoryVisibility(request.category, request.isVisible);
    sendResponse({ status: 'success' });
  }
});
