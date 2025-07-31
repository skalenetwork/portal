import { describe, expect, test } from 'bun:test'

// Import the filtering function to test
import { filterAppsBySearchTerm } from '../src/core/ecosystem/apps'
import { type types } from '../src/core'

// Mock chain metadata
const mockChainsMeta: types.ChainsMetadataMap = {
  'europa-europa': {
    alias: 'Europa',
    minSfuelWei: '1000000',
    faucetUrl: 'https://sfuel.europa.skale.network',
    apps: {
      'ruby-exchange': {
        alias: 'Ruby Exchange',
        categories: { defi: ['dex'] }
      }
    }
  },
  'calypso-europa': {
    alias: 'Calypso',
    minSfuelWei: '1000000', 
    faucetUrl: 'https://sfuel.calypso.skale.network',
    apps: {
      'nft-trade': {
        alias: 'NFT Trade',
        categories: { gaming: ['nft'] }
      }
    }
  }
}

// Mock app data
const mockApps: types.AppWithChainAndName[] = [
  {
    alias: 'Ruby Exchange',
    chain: 'europa-europa',
    appName: 'ruby-exchange',
    categories: { defi: ['dex'] }
  },
  {
    alias: 'NFT Trade', 
    chain: 'calypso-europa',
    appName: 'nft-trade',
    categories: { gaming: ['nft'] }
  },
  {
    alias: 'Another App',
    chain: 'europa-europa', 
    appName: 'another-app',
    categories: { gaming: ['casual'] }
  }
]

describe('App search functionality with chain aliases', () => {
  test('should filter apps by chain alias "Europa"', () => {
    const result = filterAppsBySearchTerm(mockApps, 'Europa', mockChainsMeta)
    
    // Should return apps that match "Europa" - both from europa-europa chain and calypso-europa chain  
    // since "calypso-europa" contains "europa"
    expect(result.length).toBe(3)
    expect(result.some(app => app.chain === 'europa-europa')).toBe(true)
    expect(result.some(app => app.chain === 'calypso-europa')).toBe(true)
  })

  test('should filter apps by chain alias "Calypso"', () => {
    const result = filterAppsBySearchTerm(mockApps, 'Calypso', mockChainsMeta)
    
    // Should return apps from calypso-europa chain
    expect(result.length).toBe(1)
    expect(result[0].chain).toBe('calypso-europa')
    expect(result[0].appName).toBe('nft-trade')
  })

  test('should filter apps by app name', () => {
    const result = filterAppsBySearchTerm(mockApps, 'Ruby', mockChainsMeta)
    
    // Should return the Ruby Exchange app
    expect(result.length).toBe(1)
    expect(result[0].appName).toBe('ruby-exchange')
  })

  test('should be case insensitive', () => {
    const result = filterAppsBySearchTerm(mockApps, 'europa', mockChainsMeta)
    
    // Should still return europa apps with lowercase search (all 3 since both chains contain "europa")
    expect(result.length).toBe(3)
  })

  test('should return empty array for non-matching search', () => {
    const result = filterAppsBySearchTerm(mockApps, 'NonExistent', mockChainsMeta)
    
    expect(result.length).toBe(0)
  })

  test('should return all apps when search term is empty', () => {
    const result = filterAppsBySearchTerm(mockApps, '', mockChainsMeta)
    
    expect(result.length).toBe(3)
  })
})