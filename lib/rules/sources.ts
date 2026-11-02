import type { Source } from './types'

// Source registry. Every Source id referenced by a Step must exist here.
// checkedAt is set only when we actually loaded the page during this build.
export const SOURCES: Record<string, Source> = {
  // Trade license (Path A)
  'btp-procedure': {
    id: 'btp-procedure',
    name: 'Bangladesh Trade Portal — trade licence procedure',
    url: 'https://bangladeshtradeportal.gov.bd/',
    authority: 'official',
    publishedAt: '2017',
  },
  'etradelicense-portal': {
    id: 'etradelicense-portal',
    name: 'National e-Trade Licence portal',
    url: 'https://etradelicense.gov.bd',
    authority: 'official',
    checkedAt: '2026-11-01',
  },
  'dncc-erevenue': {
    id: 'dncc-erevenue',
    name: 'DNCC e-Revenue portal',
    url: 'https://erevenue.dncc.gov.bd',
    authority: 'official',
    checkedAt: '2026-11-01',
  },
  'dscc-erevenue': {
    id: 'dscc-erevenue',
    name: 'DSCC e-Revenue portal',
    url: 'https://erevenue.dscc.gov.bd',
    authority: 'official',
    checkedAt: '2026-11-01',
  },
  'etradelicense-userguide': {
    id: 'etradelicense-userguide',
    name: 'e-Trade Licence user guide (2017 screenshots)',
    url: 'https://etradelicense.gov.bd',
    authority: 'official',
    publishedAt: '2017',
  },
  'dncc-procedure': {
    id: 'dncc-procedure',
    name: 'DNCC trade licence procedure notes (industrial units)',
    url: 'https://dncc.gov.bd',
    authority: 'official',
    publishedAt: '2017',
  },
  'unofficial-calculator': {
    id: 'unofficial-calculator',
    name: 'Unofficial fee calculator sites',
    url: 'https://example.invalid',
    authority: 'unofficial',
  },

  // DBID (Path B)
  'dbid-application-info': {
    id: 'dbid-application-info',
    name: 'DBID application information (dbid.gov.bd)',
    url: 'https://dbid.gov.bd/application-info',
    authority: 'official',
    checkedAt: '2026-11-01',
  },
  'dbid-faq': {
    id: 'dbid-faq',
    name: 'DBID FAQ (dbid.gov.bd/faq)',
    url: 'https://dbid.gov.bd/faq',
    authority: 'official',
    checkedAt: '2026-11-01',
  },
  'dbid-home': {
    id: 'dbid-home',
    name: 'DBID homepage',
    url: 'https://dbid.gov.bd',
    authority: 'official',
    checkedAt: '2026-11-01',
  },

  // Tax and other obligations (informational)
  'nbr-etin': {
    id: 'nbr-etin',
    name: 'NBR e-TIN portal',
    url: 'https://secure.incometax.gov.bd',
    authority: 'official',
    checkedAt: '2026-11-01',
  },
  'nbr-ereturn-news': {
    id: 'nbr-ereturn-news',
    name: 'News report on NBR 2026-27 e-return service',
    url: 'https://www.nbr.gov.bd',
    authority: 'unofficial',
    publishedAt: '2026',
  },
  'nbr-vat': {
    id: 'nbr-vat',
    name: 'NBR VAT registration guidance',
    url: 'https://www.nbr.gov.bd',
    authority: 'official',
  },
}

export const ALL_SOURCE_IDS = Object.keys(SOURCES)