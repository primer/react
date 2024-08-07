import type {Suggestion, Trigger} from '../../InlineAutocomplete'

const MAX_SUGGESTIONS = 5

export type SuggestionOptions<T> = T[] | (() => Promise<T[]>) | 'loading'

export type UseSuggestionsHook<T> = (options: SuggestionOptions<T>) => {
  trigger: Trigger
  calculateSuggestions: (query: string) => Promise<Suggestion[] | 'loading'>
}

export const suggestionsCalculator =
  <T>(
    options: SuggestionOptions<T>,
    score: (query: string, option: T) => number,
    toSuggestion: (option: T) => Suggestion,
  ) =>
  async (query: string) => {
    if (options === 'loading') return 'loading'

    const optionsArray = Array.isArray(options) ? options : await options()

    // If the query is empty, scores will be -INFINITY
    const scoredAndSorted = query
      ? optionsArray
          .map(o => [score(query, o), o] as const)
          .filter(([s]) => s > 0)
          .sort(([a], [b]) => b - a)
          .slice(0, MAX_SUGGESTIONS)
          .map(([, o]) => o)
      : optionsArray.slice(0, MAX_SUGGESTIONS)

    return scoredAndSorted.map(toSuggestion)
  }
