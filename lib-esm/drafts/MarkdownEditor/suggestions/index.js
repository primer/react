const MAX_SUGGESTIONS = 5;
const suggestionsCalculator = (options, score, toSuggestion) => query => {
  // If the query is empty, scores will be -INFINITY
  const scoredAndSorted = query ? options.map(o => [score(query, o), o]).filter(([s]) => s > 0).sort(([a], [b]) => b - a).slice(0, MAX_SUGGESTIONS).map(([, o]) => o) : options.slice(0, MAX_SUGGESTIONS);
  return scoredAndSorted.map(toSuggestion);
};

export { suggestionsCalculator };
