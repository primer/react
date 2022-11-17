import {create} from '@storybook/theming'
import packageJson from '../package.json'

export default create({
  brandTitle: `
    <div style="display: flex; gap: 4px; align-items: center;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <rect width="24" height="24" rx="4" fill="#0969DA"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M3 7.37867V16.6151C3 17.1716 3.36 17.6538 3.9 17.8145L11.7 19.9536C11.892 20.0155 12.108 20.0155 12.3 19.9536L20.1 17.8145C20.64 17.6538 21 17.1716 21 16.6151V7.37867C21 6.82226 20.64 6.34003 20.1 6.17929L12.3 4.02782C12.1016 3.99073 11.8984 3.99073 11.7 4.02782L3.9 6.17929C3.36 6.34003 3 6.82226 3 7.37867ZM11.4 18.6182L4.2 16.6522V8.2813L11.4 10.272V18.6182ZM4.2 7.04482L7.2 6.21639L15 8.35549L12 9.18393L4.2 7.04482ZM19.8 16.6522L12.6 18.6182V10.272L15 9.59197V12.609L17.4 11.9536V8.93663L19.8 8.2813V16.6522ZM17.4 7.70016L9.6 5.56105L12 4.90572L19.8 7.04482L17.4 7.70016V7.70016Z" fill="white"/>
      </svg>
      <span>${packageJson.name}@${packageJson.version}</span>
    </div>
  `
})
