/* Institution locations — DUMMY for the prototype.
   HEAP carries no geography; Navigate hold real geocoding for every
   institution. Here we infer a place from the institution name and look it
   up in a small UK gazetteer, which is good enough to make distance and
   setting feel real on screen. Unmatched institutions get no location and
   are simply excluded from distance-based filtering. */

export const HOME = { label: 'Sittingbourne, Kent', lat: 51.34, lng: 0.73 }

/* place → lat, lng, region, setting (city | campus | town | coastal) */
const PLACES = {
  london: [51.5074, -0.1278, 'London', 'city'],
  birmingham: [52.4862, -1.8904, 'West Midlands', 'city'],
  manchester: [53.4808, -2.2426, 'North West', 'city'],
  leeds: [53.8008, -1.5491, 'Yorkshire', 'city'],
  sheffield: [53.3811, -1.4701, 'Yorkshire', 'city'],
  liverpool: [53.4084, -2.9916, 'North West', 'city'],
  bristol: [51.4545, -2.5879, 'South West', 'city'],
  newcastle: [54.9783, -1.6178, 'North East', 'city'],
  nottingham: [52.9548, -1.1581, 'East Midlands', 'city'],
  leicester: [52.6369, -1.1398, 'East Midlands', 'city'],
  coventry: [52.4068, -1.5197, 'West Midlands', 'city'],
  edinburgh: [55.9533, -3.1883, 'Scotland', 'city'],
  glasgow: [55.8642, -4.2518, 'Scotland', 'city'],
  aberdeen: [57.1497, -2.0943, 'Scotland', 'city'],
  dundee: [56.462, -2.9707, 'Scotland', 'city'],
  stirling: [56.1165, -3.9369, 'Scotland', 'campus'],
  'st andrews': [56.3398, -2.7967, 'Scotland', 'town'],
  inverness: [57.4778, -4.2247, 'Scotland', 'town'],
  paisley: [55.8456, -4.4239, 'Scotland', 'town'],
  cardiff: [51.4816, -3.1791, 'Wales', 'city'],
  swansea: [51.6214, -3.9436, 'Wales', 'coastal'],
  bangor: [53.2274, -4.1293, 'Wales', 'coastal'],
  aberystwyth: [52.4153, -4.0829, 'Wales', 'coastal'],
  pontypridd: [51.6021, -3.342, 'Wales', 'town'],
  wrexham: [53.0466, -2.9931, 'Wales', 'town'],
  carmarthen: [51.856, -4.3117, 'Wales', 'town'],
  belfast: [54.5973, -5.9301, 'Northern Ireland', 'city'],
  oxford: [51.752, -1.2577, 'South East', 'city'],
  cambridge: [52.2053, 0.1218, 'East of England', 'city'],
  southampton: [50.9097, -1.4044, 'South East', 'city'],
  portsmouth: [50.8198, -1.088, 'South East', 'coastal'],
  brighton: [50.8225, -0.1372, 'South East', 'coastal'],
  canterbury: [51.2802, 1.0789, 'South East', 'town'],
  reading: [51.4543, -0.9781, 'South East', 'campus'],
  guildford: [51.2362, -0.5704, 'South East', 'town'],
  winchester: [51.0632, -1.308, 'South East', 'town'],
  chichester: [50.8365, -0.7792, 'South East', 'coastal'],
  farnham: [51.215, -0.8, 'South East', 'town'],
  buckingham: [51.995, -0.987, 'South East', 'town'],
  'high wycombe': [51.6287, -0.7482, 'South East', 'town'],
  egham: [51.4297, -0.5479, 'South East', 'campus'],
  exeter: [50.7184, -3.5339, 'South West', 'campus'],
  plymouth: [50.3755, -4.1427, 'South West', 'coastal'],
  bath: [51.3811, -2.359, 'South West', 'campus'],
  bournemouth: [50.7192, -1.8808, 'South West', 'coastal'],
  falmouth: [50.153, -5.071, 'South West', 'coastal'],
  cirencester: [51.7175, -1.968, 'South West', 'town'],
  gloucester: [51.8642, -2.2382, 'South West', 'campus'],
  cheltenham: [51.8994, -2.0783, 'South West', 'town'],
  norwich: [52.6309, 1.2974, 'East of England', 'campus'],
  colchester: [51.8959, 0.8919, 'East of England', 'campus'],
  chelmsford: [51.7356, 0.4685, 'East of England', 'town'],
  luton: [51.8787, -0.42, 'East of England', 'town'],
  hatfield: [51.763, -0.228, 'East of England', 'campus'],
  ipswich: [52.0567, 1.1482, 'East of England', 'town'],
  'milton keynes': [52.0406, -0.7594, 'East of England', 'town'],
  bedford: [52.1361, -0.4667, 'East of England', 'town'],
  york: [53.96, -1.0873, 'Yorkshire', 'campus'],
  hull: [53.7676, -0.3274, 'Yorkshire', 'city'],
  bradford: [53.796, -1.7594, 'Yorkshire', 'city'],
  huddersfield: [53.6458, -1.785, 'Yorkshire', 'town'],
  durham: [54.7753, -1.5849, 'North East', 'town'],
  sunderland: [54.9069, -1.3838, 'North East', 'city'],
  middlesbrough: [54.5742, -1.235, 'North East', 'town'],
  lancaster: [54.0466, -2.8007, 'North West', 'campus'],
  preston: [53.7632, -2.7031, 'North West', 'city'],
  salford: [53.4875, -2.2901, 'North West', 'city'],
  bolton: [53.5769, -2.4282, 'North West', 'town'],
  chester: [53.1905, -2.8908, 'North West', 'town'],
  ormskirk: [53.5688, -2.8845, 'North West', 'campus'],
  carlisle: [54.8925, -2.9329, 'North West', 'town'],
  keele: [53.0035, -2.2734, 'West Midlands', 'campus'],
  wolverhampton: [52.587, -2.1288, 'West Midlands', 'city'],
  worcester: [52.1936, -2.2216, 'West Midlands', 'town'],
  stoke: [53.0027, -2.1794, 'West Midlands', 'city'],
  warwick: [52.3838, -1.5601, 'West Midlands', 'campus'],
  'newport shropshire': [52.77, -2.43, 'West Midlands', 'campus'],
  derby: [52.9225, -1.4746, 'East Midlands', 'city'],
  lincoln: [53.2307, -0.5406, 'East Midlands', 'city'],
  loughborough: [52.7721, -1.2062, 'East Midlands', 'campus'],
  northampton: [52.2405, -0.9027, 'East Midlands', 'town'],
}

/* Names that don't contain their place, or contain a misleading one. */
const OVERRIDES = [
  ['west of england', 'bristol'], ['west of scotland', 'paisley'], ['highlands', 'inverness'],
  ['strathclyde', 'glasgow'], ['caledonian', 'glasgow'], ['heriot', 'edinburgh'], ['napier', 'edinburgh'],
  ['queen margaret', 'edinburgh'], ['robert gordon', 'aberdeen'], ['abertay', 'dundee'],
  ['south wales', 'pontypridd'], ['trinity saint david', 'carmarthen'], ['ulster', 'belfast'], ["queen's", 'belfast'],
  ['imperial', 'london'], ['ucl', 'london'], ["king's college", 'london'], ['lse', 'london'],
  ['london school', 'london'], ['goldsmiths', 'london'], ['queen mary', 'london'], ['westminster', 'london'],
  ['greenwich', 'london'], ['kingston', 'london'], ['middlesex', 'london'], ['roehampton', 'london'],
  ['brunel', 'london'], ['south bank', 'london'], ['royal holloway', 'egham'], ["st mary's", 'london'],
  ['birkbeck', 'london'], ['soas', 'london'], ['city, university', 'london'], ['east london', 'london'],
  ['west london', 'london'], ['arts london', 'london'], ['royal veterinary', 'london'],
  ['anglia ruskin', 'cambridge'], ['open university', 'milton keynes'], ['cranfield', 'bedford'],
  ['harper adams', 'newport shropshire'], ['royal agricultural', 'cirencester'], ['hartpury', 'gloucester'],
  ['oxford brookes', 'oxford'], ['bath spa', 'bath'], ['solent', 'southampton'], ['creative arts', 'farnham'],
  ['leeds beckett', 'leeds'], ['leeds trinity', 'leeds'], ['leeds arts', 'leeds'], ['sheffield hallam', 'sheffield'],
  ['manchester metropolitan', 'manchester'], ['john moores', 'liverpool'], ['liverpool hope', 'liverpool'],
  ['northumbria', 'newcastle'], ['nottingham trent', 'nottingham'], ['de montfort', 'leicester'],
  ['birmingham city', 'birmingham'], ['aston', 'birmingham'], ['newman', 'birmingham'], ['edge hill', 'ormskirk'],
  ['cumbria', 'carlisle'], ['suffolk', 'ipswich'], ['gloucestershire', 'cheltenham'], ['marjon', 'plymouth'],
  ['buckinghamshire new', 'high wycombe'], ['york st john', 'york'], ['bishop grosseteste', 'lincoln'],
  ['staffordshire', 'stoke'], ['central lancashire', 'preston'], ['teesside', 'middlesbrough'],
  ['hertfordshire', 'hatfield'], ['bedfordshire', 'luton'], ['east anglia', 'norwich'], ['essex', 'colchester'],
  ['surrey', 'guildford'], ['sussex', 'brighton'], ['kent', 'canterbury'], ['warwick', 'warwick'],
]

const KEYS = Object.keys(PLACES).sort((a, b) => b.length - a.length)

export function locateInstitution(name) {
  if (!name) return null
  const n = name.toLowerCase()
  let place = OVERRIDES.find(([needle]) => n.includes(needle))?.[1]
  if (!place) place = KEYS.find((k) => n.includes(k))
  if (!place) return null
  const [lat, lng, region, setting] = PLACES[place]
  const city = place.replace(/\b\w/g, (c) => c.toUpperCase()).replace('Newport Shropshire', 'Newport')
  return { city, region, setting, lat, lng }
}

export function distanceMiles(a, b) {
  if (!a || !b) return null
  const R = 3958.8
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return Math.round(2 * R * Math.asin(Math.sqrt(s)))
}

/* Rough door-to-door feel for a 17-year-old without a car. */
export function travelLabel(miles) {
  if (miles == null) return 'Location unknown'
  if (miles <= 20) return 'Commutable — stay at home'
  if (miles <= 50) return 'About an hour away'
  if (miles <= 120) return 'A couple of hours by train'
  return 'A proper move'
}
