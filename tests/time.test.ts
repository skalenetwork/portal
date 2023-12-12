import { describe, expect, test } from 'bun:test'
import { daysBetweenTimestamps, monthsBetweenTimestamps, formatTimePeriod } from '../src/core/timeHelper'

const BASE_TS = 1710262826n

describe('test timeHelper functions', () => {
    test('daysBetweenNowAndTimestamp test', () => {
        let days: number
        days = daysBetweenTimestamps(BASE_TS, 1712937626n) // +31 days
        expect(days).toBe(31)
        days = daysBetweenTimestamps(BASE_TS, 1710273626n) // +1 hour
        expect(days).toBe(0)
        days = daysBetweenTimestamps(BASE_TS, 1710180026n) // -2 hours
        expect(days).toBe(-1)
        days = daysBetweenTimestamps(BASE_TS, 1710097226n) // -2 days
        expect(days).toBe(-2)
    })

    test('daysBetweenNowAndTimestamp test', () => {
        let months: number
        months = monthsBetweenTimestamps(BASE_TS, 1712937626n) // +31 days
        expect(months).toBe(1)
        months = monthsBetweenTimestamps(BASE_TS, 1710273626n) // +1 hour
        expect(months).toBe(0)
        months = monthsBetweenTimestamps(BASE_TS, 1710097226n) // -2 days
        expect(months).toBe(-0)
        months = monthsBetweenTimestamps(BASE_TS, 1741719626n) // +1 year
        expect(months).toBe(12)
        months = monthsBetweenTimestamps(BASE_TS, 2025716426n) // +10 years
        expect(months).toBe(120)
    })

    test('formatTimePeriod test', () => {
        let text: string
        text = formatTimePeriod(2, 'month')
        expect(text).toBe('2 months')
        text = formatTimePeriod(-1, 'month')
        expect(text).toBe('-1 month')
        text = formatTimePeriod(-0, 'month')
        expect(text).toBe('>1 month')
        text = formatTimePeriod(0, 'month')
        expect(text).toBe('>1 month')
    })
})
