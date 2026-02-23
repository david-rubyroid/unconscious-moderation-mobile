const BONUS_BOOST_VIDEOS = {
  'day-1': 'https://www.youtube.com/watch?v=O3BC3zU1VcU&t=16s',
  'day-2': 'https://www.youtube.com/watch?v=YvlJT9dimiM',
  'day-3': 'https://www.youtube.com/watch?v=dkkqPF5mBpg',
  'day-4': 'https://www.youtube.com/watch?v=8EMhFeWuVzE',
  'day-5': 'https://www.youtube.com/watch?v=5de8lmcJZvU',
  'day-6': 'https://www.youtube.com/watch?v=el87AL4eZo0',
  'day-7': 'https://www.youtube.com/watch?v=43fEg2_eHxs',
  'day-8': 'https://www.youtube.com/watch?v=CZlcfsDRDGw',
  'day-9': 'https://www.youtube.com/watch?v=2bVIcC07wQA',
  'day-10': 'https://www.youtube.com/watch?v=XGRLemNYgho',
  'day-11': 'https://www.youtube.com/watch?v=UM_Ez2afwlY',
  'day-12': 'https://www.youtube.com/watch?v=gD1FjPWm9OI',
  'day-13': 'https://www.youtube.com/watch?v=qpqM4C-6U3I',
  'day-14': 'https://www.youtube.com/watch?v=EZshSVHZDyk',
  'day-15': 'https://www.youtube.com/watch?v=EZshSVHZDyk',
  'day-16': 'https://www.youtube.com/watch?v=vCMDYIeyAO4',
  'day-17': 'https://www.youtube.com/watch?v=AgbNlLIUaIw',
  'day-18': 'https://www.youtube.com/watch?v=JJfDDNiGbMk',
  'day-19': 'https://www.youtube.com/watch?v=zF2a7Adha0c',
  'day-20': 'https://www.youtube.com/watch?v=k3RLskFhtEg&t=535s',
  'day-21': 'https://www.youtube.com/watch?v=eBNC4zKZ7B8',
  'day-22': 'https://www.youtube.com/watch?v=kWBs4WaIniQ',
  'day-23': 'https://www.youtube.com/watch?v=F6NBpQmRrE0',
  'day-24': 'https://www.youtube.com/watch?v=kzMEMVuyTi8',
  'day-25': 'https://www.youtube.com/watch?v=HYWOsmrtsIw',
  'day-26': 'https://www.youtube.com/watch?v=8JBPxyZwpeA&t=1128s',
  'day-27': 'https://www.youtube.com/watch?v=Cnaucu6PLhE',
  'day-28': 'https://www.youtube.com/watch?v=7gVOfZ3tD1c',
  'day-29': 'https://www.youtube.com/watch?v=2UUEa-0wnXU&t=83s',
  'day-30': 'https://www.youtube.com/watch?v=BHBdmURS7q4',
} as const

export type BonusBoostDay = keyof typeof BONUS_BOOST_VIDEOS

export function getBonusBoostVideoUrl(day: number): string {
  const key = `day-${day}` as BonusBoostDay
  return BONUS_BOOST_VIDEOS[key] ?? BONUS_BOOST_VIDEOS['day-1']
}

export { BONUS_BOOST_VIDEOS }
