import styled from 'styled-components';
import { get } from './constants.js';
import sx from './sx.js';

const FilteredSearch = styled.div.withConfig({
  displayName: "FilteredSearch",
  componentId: "sc-1q2r5fr-0"
})(["display:flex;align-items:stretch;summary,> button{border-radius:0;border-top-left-radius:", ";border-bottom-left-radius:", ";border-right:0;}.TextInput-wrapper{border-radius:0;border-top-right-radius:", ";border-bottom-right-radius:", ";}", ""], get('radii.2'), get('radii.2'), get('radii.2'), get('radii.2'), sx);
var FilteredSearch$1 = FilteredSearch;

export { FilteredSearch$1 as default };
