import type { Preview } from '@storybook/react'

const preview: Preview = {
  parameters: {
    grid: true,
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#222425',
        }
      ]
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
