import type { Meta, StoryObj } from '@storybook/react'
import Metaport from './Metaport'

import { METAPORT_CONFIG } from '../../meta/testnetConfig'
METAPORT_CONFIG.mainnetEndpoint = import.meta.env.VITE_MAINNET_ENDPOINT
METAPORT_CONFIG.projectId = import.meta.env.VITE_WC_PROJECT_ID

const meta: Meta<typeof Metaport> = {
  title: 'Functional/Metaport',
  component: Metaport
}

export default meta
type Story = StoryObj<typeof Metaport>

export const WidgetDemo: Story = {
  args: {
    config: METAPORT_CONFIG
  }
}
