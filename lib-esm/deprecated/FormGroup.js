import styled from 'styled-components';
import { get } from '../constants.js';
import sx from '../sx.js';

const FormGroup = styled.div.withConfig({
  displayName: "FormGroup",
  componentId: "sc-16u5rpr-0"
})(["margin:", " 0;font-weight:", ";", ";"], get('space.3'), get('fontWeights.normal'), sx);
/** @deprecated Use FormControl instead. See https://primer.style/react/FormControl for more details. */

const FormGroupLabel = styled.label.withConfig({
  displayName: "FormGroup__FormGroupLabel",
  componentId: "sc-16u5rpr-1"
})(["display:block;margin:0 0 ", ";font-size:", ";font-weight:", ";", ";"], get('space.2'), get('fontSizes.1'), get('fontWeights.bold'), sx);
FormGroupLabel.displayName = 'FormGroup.Label';

/** @deprecated Use FormControl instead. See https://primer.style/react/FormControl for more details. */
var FormGroup$1 = Object.assign(FormGroup, {
  Label: FormGroupLabel
});

export { FormGroup$1 as default };
