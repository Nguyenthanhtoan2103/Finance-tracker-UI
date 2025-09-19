const keywordCategoryMap = {
  coffee: "Food & Drink",
  restaurant: "Food & Drink",
  uber: "Transport",
  bus: "Transport",
  salary: "Income",
  freelance: "Income",
  rent: "Housing",
  electricity: "Utilities",
  water: "Utilities",
  shopping: "Shopping",
};

export function suggestCategory(note) {
  if (!note) return "Others";
  const lowerNote = note.toLowerCase();
  for (const [keyword, category] of Object.entries(keywordCategoryMap)) {
    if (lowerNote.includes(keyword)) return category;
  }
  return "Others";
}