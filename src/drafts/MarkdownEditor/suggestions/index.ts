import {Suggestion, Trigger} from '../../InlineAutocomplete'

const MAX_SUGGESTIONS = 5

export type UseSuggestionsHook<T> = (options: T[]) => {
  trigger: Trigger
  calculateSuggestions: (query: string) => Suggestion[]
}

export const suggestionsCalculator =
  <T>(options: T[], score: (query: string, option: T) => number, toSuggestion: (option: T) => Suggestion) =>
  (query: string) => {
    // If the query is empty, scores will be -INFINITY
    const scoredAndSorted = query
      ? options
          .map(o => [score(query, o), o] as const)
          .filter(([s]) => s > 0)
          .sort(([a], [b]) => b - a)
          .slice(0, MAX_SUGGESTIONS)
          .map(([, o]) => o)
      : options.slice(0, MAX_SUGGESTIONS)

    return scoredAndSorted.map(toSuggestion)
  }
