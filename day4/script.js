// Select all required elements
const noteText = document.getElementById('note-text');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const clearBtn = document.getElementById('clear-btn');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Function to update counters and apply warning classes
function updateCounts() {
  const text = noteText.value;
  const length = text.length;
  
  // Calculate word count (splitting by spaces and ignoring empty strings)
  const words = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

  // Update text content
  charCount.textContent = `${length} / 200 characters`;
  wordCount.textContent = `${words} words`;

  // Reset classes
  charCount.className = '';

  // Apply warning or over classes based on length
  if (length > 200) {
    charCount.classList.add('over');
  } else if (length > 180) {
    charCount.classList.add('warning');
  }
}

// Function to clear everything
function clearAll() {
  noteText.value = '';
  localStorage.removeItem('draftNote');
  updateCounts();
}

// Event Listener: Typing in the textarea
noteText.addEventListener('input', () => {
  updateCounts();
  localStorage.setItem('draftNote', noteText.value);
});

// Event Listener: Clear button
clearBtn.addEventListener('click', clearAll);

// Event Listener: Pressing Escape inside the textarea
noteText.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    clearAll();
  }
});

// Event Listener: Theme toggle button
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  
  if (body.classList.contains('dark')) {
    themeToggle.textContent = 'Light mode';
    localStorage.setItem('theme', 'dark');
  } else {
    themeToggle.textContent = 'Dark mode';
    localStorage.setItem('theme', 'light');
  }
});

// Initialization: Run when the page loads
function init() {
  // Restore saved draft
  const savedNote = localStorage.getItem('draftNote');
  if (savedNote) {
    noteText.value = savedNote;
  }

  // Restore saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
    themeToggle.textContent = 'Light mode';
  } else {
    themeToggle.textContent = 'Dark mode';
  }

  // Update counts based on restored text
  updateCounts();
}

init();