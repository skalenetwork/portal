import { describe, expect, test } from 'bun:test'
import { schain, get, getProxyEndpoint } from '@/core/endpoints'
import { getRpcUrl, getRpcWsUrl, getFsUrl } from '@/lib/chain'

describe('endpoints', () => {
  test('schain http urls', () => {
    expect(schain('mainnet', 'elated-tan-skat')).toBe(
      'https://mainnet.skalenodes.com/v1/elated-tan-skat'
    )
    expect(schain('testnet', 'x')).toBe('https://testnet.skalenodes.com/v1/x')
    expect(schain('base', 'x')).toBe('https://skale-base.skalenodes.com/v1/x')
    expect(schain('base-sepolia-testnet', 'x')).toBe(
      'https://base-sepolia-testnet.skalenodes.com/v1/x'
    )
    expect(schain('legacy', 'x')).toBe('https://legacy-proxy.skalenodes.com/v1/x')
  })

  test('schain ws urls', () => {
    expect(schain('mainnet', 'x', 'ws')).toBe('wss://mainnet.skalenodes.com/v1/ws/x')
    expect(schain('base', 'x', 'ws')).toBe('wss://skale-base.skalenodes.com/v1/ws/x')
  })

  test('get returns the mainnet endpoint only for the mainnet chain name', () => {
    expect(get('https://rpc', 'mainnet', 'mainnet')).toBe('https://rpc')
    expect(get('https://rpc', 'mainnet', 'other')).toBe(
      'https://mainnet.skalenodes.com/v1/other'
    )
  })

  test('proxy endpoints', () => {
    expect(getProxyEndpoint('mainnet')).toBe('mainnet.skalenodes.com')
    expect(getProxyEndpoint('base')).toBe('skale-base.skalenodes.com')
  })

  test('lib url builders', () => {
    expect(getRpcUrl('proxy.example.com', 'x', 'https://')).toBe('https://proxy.example.com/v1/x')
    expect(getRpcWsUrl('proxy.example.com', 'x', 'wss://')).toBe('wss://proxy.example.com/v1/ws/x')
    expect(getFsUrl('proxy.example.com', 'x', 'https://')).toBe('https://proxy.example.com/fs/x')
  })
})
