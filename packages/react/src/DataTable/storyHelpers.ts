import type {InputType} from 'storybook/internal/csf'

// Keeping this generic because we can't know how many columns there will be,
// so we can't know all the possible width keys (for example. 'colWidth1')
export type ColWidthArgTypes = Record<string, string>

export const getColumnWidthArgTypes = (colCount: number) => {
  const argTypes: InputType = {}
  for (let i = 0; i <= colCount - 1; i++) {
    argTypes[`colWidth${i}`] = {
      name: `column ${i + 1} width`,
      control: {
        type: 'radio',
      },
      defaultValue: 'grow',
      options: ['grow', 'growCollapse', 'auto', 'explicit width'],
      table: {
        category: 'Column widths',
      },
    }
    argTypes[`explicitColWidth${i}`] = {
      name: `column ${i + 1} explicit width`,
      control: {
        type: 'text',
      },
      defaultValue: '200px',
      if: {arg: `colWidth${i}`, eq: 'explicit width'},
      table: {
        category: 'Column widths',
      },
    }
    argTypes[`minColWidth${i}`] = {
      name: `column ${i + 1} min width`,
      control: {
        type: 'text',
      },
      table: {
        category: 'Column widths',
      },
    }
    argTypes[`maxColWidth${i}`] = {
      name: `column ${i + 1} max width`,
      control: {
        type: 'text',
      },
      table: {
        category: 'Column widths',
      },
    }
  }
  return argTypes
}
