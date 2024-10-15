const categories = [
  'Video', 'Social', 'Educational', 'Work', 'News', 'Shopping', 'Other'
];

document.getElementById('categorize').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'categorizeTabs' }, (response) => {
    if (response.status === 'success') {
      showFeedback('Tabs categorized successfully!');
      updateCategoryToggles();
    }
  });
});

function updateCategoryToggles() {
  const container = document.getElementById('categoryToggles');
  container.innerHTML = '';

  categories.forEach(category => {
    const toggle = document.createElement('div');
    toggle.className = 'flex items-center justify-between';
    toggle.innerHTML = `
      <span class="font-semibold">${category}</span>
      <label class="switch">
        <input type="checkbox" id="${category.toLowerCase()}-toggle" checked>
        <span class="slider round"></span>
      </label>
    `;
    container.appendChild(toggle);

    document.getElementById(`${category.toLowerCase()}-toggle`).addEventListener('change', (e) => {
      chrome.runtime.sendMessage({ 
        action: 'toggleCategory', 
        category: category,
        isVisible: e.target.checked
      }, (response) => {
        if (response.status === 'success') {
          showFeedback(`${category} tabs ${e.target.checked ? 'shown' : 'hidden'}`);
        }
      });
    });
  });
}

function showFeedback(message) {
  const feedback = document.getElementById('feedback');
  feedback.textContent = message;
  feedback.classList.remove('hidden');
  setTimeout(() => {
    feedback.classList.add('hidden');
  }, 3000);
}

updateCategoryToggles();
