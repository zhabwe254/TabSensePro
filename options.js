const defaultTopicKeywords = {
  'Work': ['project', 'meeting', 'report', 'email', 'task'],
  'Entertainment': ['movie', 'music', 'game', 'video', 'stream'],
  'News': ['news', 'article', 'blog', 'update', 'headline'],
  'Social': ['facebook', 'twitter', 'instagram', 'linkedin', 'social'],
  'Shopping': ['shop', 'store', 'buy', 'price', 'deal']
};

function loadOptions() {
  chrome.storage.sync.get('topicKeywords', (data) => {
    const topicKeywords = data.topicKeywords || defaultTopicKeywords;
    const container = document.getElementById('topicKeywords');
    
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      const topicDiv = document.createElement('div');
      topicDiv.className = 'mb-2';
      topicDiv.innerHTML = `
        <label class="block font-semibold">${topic}</label>
        <input type="text" class="topic-keywords w-full p-2 border rounded" data-topic="${topic}" value="${keywords.join(', ')}">
      `;
      container.appendChild(topicDiv);
    }
  });
}

function saveOptions() {
  const topicKeywords = {};
  document.querySelectorAll('.topic-keywords').forEach(input => {
    const topic = input.dataset.topic;
    const keywords = input.value.split(',').map(k => k.trim()).filter(k => k);
    topicKeywords[topic] = keywords;
  });

  chrome.storage.sync.set({ topicKeywords }, () => {
    showFeedback('Options saved successfully!');
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

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('saveOptions').addEventListener('click', saveOptions);
