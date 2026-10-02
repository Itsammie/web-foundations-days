let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 1. Search notes (ignoring case)
function searchNotes(word) {
  const lowerWord = word.toLowerCase();
  return notes.filter(note => note.text.toLowerCase().includes(lowerWord));
}

// 2. Find the longest note
function longestNote() {
  if (notes.length === 0) return null;
  return notes.reduce((longest, current) => 
    current.text.length > longest.text.length ? current : longest
  );
}

// 3. Count notes by category
function countByCategory() {
  let counts = {};
  for (let note of notes) {
    counts[note.category] = (counts[note.category] || 0) + 1;
  }
  return counts;
}

// 4. Get a summary string
function getSummary() {
  const counts = countByCategory();
  const total = notes.length;
  const noteWord = total === 1 ? "note" : "notes";
  
  // Convert the counts object into an array of strings like "2 personal"
  const details = Object.entries(counts)
    .map(([category, count]) => `${count} ${category}`)
    .join(", ");
    
  return `${total} ${noteWord}: ${details}.`;
}

// 5. Check if a note text already exists (ignoring case and extra spaces)
function isDuplicate(text) {
  const cleanText = text.trim().toLowerCase();
  return notes.some(note => note.text.trim().toLowerCase() === cleanText);
}

// 6. Add a new note with validation
function addNote(text, category) {
  const cleanText = text.trim();
  const validCategories = ["personal", "work", "study"];

  if (cleanText.length < 1 || cleanText.length > 200) {
    console.log(`Failed to add: Text must be 1-200 characters. (Attempted: "${text}")`);
    return false;
  }
  if (!validCategories.includes(category)) {
    console.log(`Failed to add: Invalid category "${category}".`);
    return false;
  }
  if (isDuplicate(cleanText)) {
    console.log(`Failed to add: Note already exists. (Attempted: "${text}")`);
    return false;
  }

  // Find the highest current ID and add 1, or start at 1 if array is empty
  const newId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
  notes.push({ id: newId, text: cleanText, category: category });
  return true;
}

/* =========================================
   TESTING ALL FUNCTIONS
========================================= */

console.log("--- Testing searchNotes ---");
console.log(searchNotes("day")); // Expected: [{id: 2, text: "Finish the Day 3 assignment", category: "study"}]
console.log(searchNotes("javascript")); // Expected: [{id: 4, text: "Revise JavaScript arrays", category: "study"}]
console.log(searchNotes("xylophone")); // Expected: [] (Edge case: no results)

console.log("\n--- Testing longestNote ---");
console.log(longestNote()); // Expected: {id: 3, text: "Email the project report to Grace", category: "work"}
// Edge case tested temporarily by emptying array (uncomment to test):
// const backup = notes; notes = []; console.log(longestNote()); notes = backup; 

console.log("\n--- Testing countByCategory ---");
console.log(countByCategory()); // Expected: { personal: 2, study: 2, work: 1 }

console.log("\n--- Testing getSummary ---");
console.log(getSummary()); // Expected: "5 notes: 2 personal, 2 study, 1 work."

console.log("\n--- Testing isDuplicate ---");
console.log(isDuplicate("call mum")); // Expected: true
console.log(isDuplicate("   CALL MUM   ")); // Expected: true (Edge case: weird spacing/casing)
console.log(isDuplicate("Call dad")); // Expected: false

console.log("\n--- Testing addNote ---");
console.log(addNote("Buy apples", "personal")); // Expected: true
console.log(addNote("   Call mum   ", "personal")); // Expected: false (logs duplicate reason)
console.log(addNote("", "work")); // Expected: false (logs length reason)
console.log(addNote("Go running", "health")); // Expected: false (logs invalid category reason)

console.log("\n--- Final getSummary to verify addNote worked ---");
console.log(getSummary()); // Expected: "6 notes: 3 personal, 2 study, 1 work."