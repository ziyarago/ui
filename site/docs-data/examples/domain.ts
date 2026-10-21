import type { Example } from '../types'

const prayer = [
  { name: 'Fajr', time: '04:52' },
  { name: 'Dhuhr', time: '12:21' },
  { name: 'Asr', time: '15:48' },
  { name: 'Maghrib', time: '18:35' },
  { name: 'Isha', time: '20:05' },
]

const rooms = [
  { no: '101', type: 'Double', status: 'clean' },
  { no: '102', type: 'Twin', status: 'occupied' },
  { no: '103', type: 'Suite', status: 'occupied' },
  { no: '104', type: 'Double', status: 'dirty' },
  { no: '201', type: 'Family', status: 'clean' },
  { no: '202', type: 'Twin', status: 'blocked' },
  { no: '203', type: 'Double', status: 'occupied' },
  { no: '204', type: 'Suite', status: 'clean' },
]

const deal = (title: string, amount: string, stage: string, tone: string, probability: number, owner: string, due: string) => ({ title, amount, stage, tone, probability, owner, due })

const examples: Example[] = [
  {
    name: 'HotelCard',
    description: 'Hotel listing tile with tags, star rating, distance to the Haram and nightly price; the photo comes from the optional image prop. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      { label: 'Default', width: '320px', props: { name: 'Swissotel Makkah', stars: 5, distance: '120 m to Haram', rating: '9.2', price: 1450, tags: ['Haram view', 'Breakfast'] } },
      { label: 'Budget', width: '320px', props: { name: 'Al Safwah Residence', stars: 3, distance: '650 m to Haram', rating: '8.1', price: 380, tags: ['Shuttle'] } },
      {
        label: 'Sizes',
        width: '320px', items: [
          { props: { ...{ name: 'Swissotel Makkah', stars: 5, distance: '120 m to Haram', rating: '9.2', price: 1450, tags: ['Haram view', 'Breakfast'] }, size: 'xs' } },
          { props: { ...{ name: 'Swissotel Makkah', stars: 5, distance: '120 m to Haram', rating: '9.2', price: 1450, tags: ['Haram view', 'Breakfast'] }, size: 'sm' } },
          { props: { ...{ name: 'Swissotel Makkah', stars: 5, distance: '120 m to Haram', rating: '9.2', price: 1450, tags: ['Haram view', 'Breakfast'] }, size: 'md' } },
          { props: { ...{ name: 'Swissotel Makkah', stars: 5, distance: '120 m to Haram', rating: '9.2', price: 1450, tags: ['Haram view', 'Breakfast'] }, size: 'lg' } },
          { props: { ...{ name: 'Swissotel Makkah', stars: 5, distance: '120 m to Haram', rating: '9.2', price: 1450, tags: ['Haram view', 'Breakfast'] }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'TourCard',
    description: 'Tour package card with city, session count and a seat-fill progress bar; the actions slot holds buttons. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      { label: 'No seats (empty bar)', width: '360px', props: { name: 'Virtual Haram Tour', city: 'Makkah', booked: 0, seats: 0 } },
      { label: 'Empty props', width: '360px', props: {} },
      { label: 'Default', width: '360px', props: { name: 'Umrah Economy 10 days', city: 'Makkah', sessions: 4, seats: 40, booked: 26 } },
      { label: 'Almost full', width: '360px', props: { name: 'Ramadan Premium 15 days', city: 'Madinah', sessions: 6, seats: 30, booked: 29 } },
      {
        label: 'Sizes',
        width: '360px', items: [
          { props: { ...{ name: 'Umrah Economy 10 days', city: 'Makkah', sessions: 4, seats: 40, booked: 26 }, size: 'xs' } },
          { props: { ...{ name: 'Umrah Economy 10 days', city: 'Makkah', sessions: 4, seats: 40, booked: 26 }, size: 'sm' } },
          { props: { ...{ name: 'Umrah Economy 10 days', city: 'Makkah', sessions: 4, seats: 40, booked: 26 }, size: 'md' } },
          { props: { ...{ name: 'Umrah Economy 10 days', city: 'Makkah', sessions: 4, seats: 40, booked: 26 }, size: 'lg' } },
          { props: { ...{ name: 'Umrah Economy 10 days', city: 'Makkah', sessions: 4, seats: 40, booked: 26 }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'PrayerTimes',
    description: 'Row of daily prayer times; next is the index of the upcoming prayer and gets highlighted. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      { label: 'Next: Asr', props: { items: prayer, next: 2 } },
      { label: 'Next: Fajr', props: { items: prayer, next: 0 } },
      {
        label: 'Sizes',
        items: [
          { props: { ...{ items: prayer, next: 2 }, size: 'xs' } },
          { props: { ...{ items: prayer, next: 2 }, size: 'sm' } },
          { props: { ...{ items: prayer, next: 2 }, size: 'md' } },
          { props: { ...{ items: prayer, next: 2 }, size: 'lg' } },
          { props: { ...{ items: prayer, next: 2 }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'RamadanTracker',
    description: 'Thirty-day Ramadan grid that marks past days, the current day and the last ten nights. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      { label: 'Day 7', width: '420px', props: { day: 7 } },
      { label: 'Day 24', width: '420px', props: { day: 24 } },
      {
        label: 'Sizes',
        width: '420px', items: [
          { props: { ...{ day: 7 }, size: 'xs' } },
          { props: { ...{ day: 7 }, size: 'sm' } },
          { props: { ...{ day: 7 }, size: 'md' } },
          { props: { ...{ day: 7 }, size: 'lg' } },
          { props: { ...{ day: 7 }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'BookingCard',
    description: 'Compact booking summary with code, status badge, guest, hotel, dates and total in SAR. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      {
        label: 'Statuses',
        width: '340px',
        items: [
          { props: { code: 'BK-20418', status: 'Confirmed', guest: 'Omar Hassan', hotel: 'Swissotel Makkah', dates: '12 - 19 Mar', amount: 9800 } },
          { props: { code: 'BK-20419', status: 'Pending', guest: 'Aisha Rahman', hotel: 'Dar Al Iman', dates: '14 - 18 Mar', amount: 4200 } },
          { props: { code: 'BK-20420', status: 'Cancelled', guest: 'Yusuf Karim', hotel: 'Anwar Madinah', dates: '20 - 25 Mar', amount: 3100 } },
        ],
      },
      {
        label: 'Sizes',
        width: '340px', items: [
          { props: { ...{ code: 'BK-20418', status: 'Confirmed', guest: 'Omar Hassan', hotel: 'Swissotel Makkah', dates: '12 - 19 Mar', amount: 9800 }, size: 'xs' } },
          { props: { ...{ code: 'BK-20418', status: 'Confirmed', guest: 'Omar Hassan', hotel: 'Swissotel Makkah', dates: '12 - 19 Mar', amount: 9800 }, size: 'sm' } },
          { props: { ...{ code: 'BK-20418', status: 'Confirmed', guest: 'Omar Hassan', hotel: 'Swissotel Makkah', dates: '12 - 19 Mar', amount: 9800 }, size: 'md' } },
          { props: { ...{ code: 'BK-20418', status: 'Confirmed', guest: 'Omar Hassan', hotel: 'Swissotel Makkah', dates: '12 - 19 Mar', amount: 9800 }, size: 'lg' } },
          { props: { ...{ code: 'BK-20418', status: 'Confirmed', guest: 'Omar Hassan', hotel: 'Swissotel Makkah', dates: '12 - 19 Mar', amount: 9800 }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'GuestCard',
    description: 'Guest profile card with country, nights stayed, optional VIP badge and preference tags. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      { label: 'VIP', width: '340px', props: { name: 'Khalid Al Mansoori', country: 'UAE', nights: 12, vip: true, tags: ['Late checkout', 'High floor', 'Halal only'] } },
      { label: 'Regular', width: '340px', props: { name: 'Dilnoza Karimova', country: 'Uzbekistan', nights: 5, tags: ['Twin beds'] } },
      {
        label: 'Sizes',
        width: '340px', items: [
          { props: { ...{ name: 'Khalid Al Mansoori', country: 'UAE', nights: 12, vip: true, tags: ['Late checkout', 'High floor'] }, size: 'xs' } },
          { props: { ...{ name: 'Khalid Al Mansoori', country: 'UAE', nights: 12, vip: true, tags: ['Late checkout', 'High floor'] }, size: 'sm' } },
          { props: { ...{ name: 'Khalid Al Mansoori', country: 'UAE', nights: 12, vip: true, tags: ['Late checkout', 'High floor'] }, size: 'md' } },
          { props: { ...{ name: 'Khalid Al Mansoori', country: 'UAE', nights: 12, vip: true, tags: ['Late checkout', 'High floor'] }, size: 'lg' } },
          { props: { ...{ name: 'Khalid Al Mansoori', country: 'UAE', nights: 12, vip: true, tags: ['Late checkout', 'High floor'] }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'RoomGrid',
    description: 'Grid of room tiles colored by status (occupied, clean, dirty, blocked; extend with statusTones); onSelect fires with the room number. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      { label: 'Custom statuses (statusTones)', width: '460px', props: { rooms: [{ no: '101', type: 'Double', status: 'occupied' }, { no: '102', type: 'Twin', status: 'clean' }, { no: '103', type: 'Suite', status: 'maintenance' }, { no: '104', type: 'Double', status: 'inspected' }, { no: '105', type: 'Twin', status: 'unknown' }], statusTones: { maintenance: 'danger', inspected: 'sky' } } },
      { label: 'Floor plan', width: '460px', props: { rooms } },
      {
        label: 'Sizes',
        width: '460px', items: [
          { props: { ...{ rooms }, size: 'xs' } },
          { props: { ...{ rooms }, size: 'sm' } },
          { props: { ...{ rooms }, size: 'md' } },
          { props: { ...{ rooms }, size: 'lg' } },
          { props: { ...{ rooms }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'RoomCalendar',
    description: 'Timeline of rooms by day showing booking bars; each booking has a start day index, nights and guest name. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      {
        label: '14 days',
        props: {
          days: 14,
          rooms: [
            { no: '101', bookings: [{ from: 1, nights: 4, guest: 'Omar Hassan' }, { from: 8, nights: 3, guest: 'Sara Ali' }] },
            { no: '102', bookings: [{ from: 0, nights: 6, guest: 'Aisha Rahman' }] },
            { no: '201', bookings: [{ from: 4, nights: 7, guest: 'Yusuf Karim' }] },
            { no: '202', bookings: [] },
          ],
        },
      },
      {
        label: 'Sizes',
        items: [
          { props: { ...{ days: 10, rooms: [{ no: '101', bookings: [{ from: 1, nights: 4, guest: 'Omar Hassan' }] }, { no: '102', bookings: [{ from: 0, nights: 6, guest: 'Aisha Rahman' }] }] }, size: 'xs' } },
          { props: { ...{ days: 10, rooms: [{ no: '101', bookings: [{ from: 1, nights: 4, guest: 'Omar Hassan' }] }, { no: '102', bookings: [{ from: 0, nights: 6, guest: 'Aisha Rahman' }] }] }, size: 'sm' } },
          { props: { ...{ days: 10, rooms: [{ no: '101', bookings: [{ from: 1, nights: 4, guest: 'Omar Hassan' }] }, { no: '102', bookings: [{ from: 0, nights: 6, guest: 'Aisha Rahman' }] }] }, size: 'md' } },
          { props: { ...{ days: 10, rooms: [{ no: '101', bookings: [{ from: 1, nights: 4, guest: 'Omar Hassan' }] }, { no: '102', bookings: [{ from: 0, nights: 6, guest: 'Aisha Rahman' }] }] }, size: 'lg' } },
          { props: { ...{ days: 10, rooms: [{ no: '101', bookings: [{ from: 1, nights: 4, guest: 'Omar Hassan' }] }, { no: '102', bookings: [{ from: 0, nights: 6, guest: 'Aisha Rahman' }] }] }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'LeadCard',
    description: 'CRM lead tile with avatar, code, phone, expected amount and an optional colored tag. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      {
        label: 'Tones',
        width: '320px',
        items: [
          { props: { name: 'Ibrahim Yusuf', code: 'L-1042', phone: '+966 55 123 4567', amount: '12 400 SAR', tag: 'Hot', tone: 'danger' } },
          { props: { name: 'Maryam Said', code: 'L-1043', phone: '+998 90 555 1122', amount: '6 900 SAR', tag: 'New', tone: 'info' } },
        ],
      },
      {
        label: 'Sizes',
        width: '320px', items: [
          { props: { ...{ name: 'Ibrahim Yusuf', code: 'L-1042', phone: '+966 55 123 4567', amount: '12 400 SAR', tag: 'Hot', tone: 'danger' }, size: 'xs' } },
          { props: { ...{ name: 'Ibrahim Yusuf', code: 'L-1042', phone: '+966 55 123 4567', amount: '12 400 SAR', tag: 'Hot', tone: 'danger' }, size: 'sm' } },
          { props: { ...{ name: 'Ibrahim Yusuf', code: 'L-1042', phone: '+966 55 123 4567', amount: '12 400 SAR', tag: 'Hot', tone: 'danger' }, size: 'md' } },
          { props: { ...{ name: 'Ibrahim Yusuf', code: 'L-1042', phone: '+966 55 123 4567', amount: '12 400 SAR', tag: 'Hot', tone: 'danger' }, size: 'lg' } },
          { props: { ...{ name: 'Ibrahim Yusuf', code: 'L-1042', phone: '+966 55 123 4567', amount: '12 400 SAR', tag: 'Hot', tone: 'danger' }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'DealCard',
    description: 'Deal tile with title, amount, stage badge, win probability, owner and due date. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      {
        label: 'Stages',
        width: '320px',
        items: [
          { props: deal('Group of 24, Ramadan', '86 000 SAR', 'Negotiation', 'warning', 60, 'Timur', 'Mar 15') },
          { props: deal('Family Umrah x5', '21 500 SAR', 'Won', 'success', 100, 'Laylo', 'Mar 02') },
        ],
      },
      {
        label: 'Sizes',
        width: '320px', items: [
          { props: { ...deal('Group of 24, Ramadan', '86 000 SAR', 'Negotiation', 'warning', 60, 'Timur', 'Mar 15'), size: 'xs' } },
          { props: { ...deal('Group of 24, Ramadan', '86 000 SAR', 'Negotiation', 'warning', 60, 'Timur', 'Mar 15'), size: 'sm' } },
          { props: { ...deal('Group of 24, Ramadan', '86 000 SAR', 'Negotiation', 'warning', 60, 'Timur', 'Mar 15'), size: 'md' } },
          { props: { ...deal('Group of 24, Ramadan', '86 000 SAR', 'Negotiation', 'warning', 60, 'Timur', 'Mar 15'), size: 'lg' } },
          { props: { ...deal('Group of 24, Ramadan', '86 000 SAR', 'Negotiation', 'warning', 60, 'Timur', 'Mar 15'), size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'PipelineBoard',
    description: 'Horizontal sales pipeline: each stage becomes a KanbanColumn filled with DealCard props. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      {
        label: 'Drag cards between stages (onMove fires with { id, from, to })',
        props: {
          stages: [
            { id: 'new', title: 'New', cards: [{ id: 'd1', title: 'Group of 12', amount: '34 000 SAR', probability: 20, owner: 'Timur', due: 'Mar 20' }] },
            { id: 'quote', title: 'Quote sent', cards: [{ id: 'd2', title: 'Hajj family 6', amount: '58 000 SAR', probability: 50, owner: 'Laylo', due: 'Mar 18' }, { id: 'd3', title: 'Corporate Umrah', amount: '120 000 SAR', probability: 40, owner: 'Timur', due: 'Mar 25' }] },
            { id: 'won', title: 'Won', cards: [] },
          ],
        },
      },
      { label: 'Empty', props: { stages: [] } },
      {
        label: 'Three stages',
        props: {
          stages: [
            { id: 'new', title: 'New', cards: [deal('Group of 12', '34 000 SAR', 'New', 'info', 20, 'Timur', 'Mar 20')] },
            { id: 'quote', title: 'Quote sent', cards: [deal('Hajj family 6', '58 000 SAR', 'Quote', 'warning', 50, 'Laylo', 'Mar 18'), deal('Corporate Umrah', '120 000 SAR', 'Quote', 'warning', 40, 'Timur', 'Mar 25')] },
            { id: 'won', title: 'Won', cards: [deal('Family Umrah x5', '21 500 SAR', 'Won', 'success', 100, 'Laylo', 'Mar 02')] },
          ],
        },
      },
      {
        label: 'Sizes',
        items: [
          { props: { ...{ stages: [{ id: 'new', title: 'New', cards: [deal('Group of 12', '34 000 SAR', 'New', 'info', 20, 'Timur', 'Mar 20')] }, { id: 'won', title: 'Won', cards: [deal('Family Umrah x5', '21 500 SAR', 'Won', 'success', 100, 'Laylo', 'Mar 02')] }] }, size: 'xs' } },
          { props: { ...{ stages: [{ id: 'new', title: 'New', cards: [deal('Group of 12', '34 000 SAR', 'New', 'info', 20, 'Timur', 'Mar 20')] }, { id: 'won', title: 'Won', cards: [deal('Family Umrah x5', '21 500 SAR', 'Won', 'success', 100, 'Laylo', 'Mar 02')] }] }, size: 'sm' } },
          { props: { ...{ stages: [{ id: 'new', title: 'New', cards: [deal('Group of 12', '34 000 SAR', 'New', 'info', 20, 'Timur', 'Mar 20')] }, { id: 'won', title: 'Won', cards: [deal('Family Umrah x5', '21 500 SAR', 'Won', 'success', 100, 'Laylo', 'Mar 02')] }] }, size: 'md' } },
          { props: { ...{ stages: [{ id: 'new', title: 'New', cards: [deal('Group of 12', '34 000 SAR', 'New', 'info', 20, 'Timur', 'Mar 20')] }, { id: 'won', title: 'Won', cards: [deal('Family Umrah x5', '21 500 SAR', 'Won', 'success', 100, 'Laylo', 'Mar 02')] }] }, size: 'lg' } },
          { props: { ...{ stages: [{ id: 'new', title: 'New', cards: [deal('Group of 12', '34 000 SAR', 'New', 'info', 20, 'Timur', 'Mar 20')] }, { id: 'won', title: 'Won', cards: [deal('Family Umrah x5', '21 500 SAR', 'Won', 'success', 100, 'Laylo', 'Mar 02')] }] }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'ContactPanel',
    description: 'Contact details card with avatar, role, descriptions list and Call / Message actions. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      { label: 'Default', width: '380px', props: { name: 'Fatima Zahra', role: 'Group leader', phone: '+966 50 987 6543', telegram: '@fatima_z', email: 'fatima@example.com', city: 'Jeddah' } },
      {
        label: 'Sizes',
        width: '380px', items: [
          { props: { ...{ name: 'Fatima Zahra', role: 'Group leader', phone: '+966 50 987 6543', telegram: '@fatima_z', email: 'fatima@example.com', city: 'Jeddah' }, size: 'xs' } },
          { props: { ...{ name: 'Fatima Zahra', role: 'Group leader', phone: '+966 50 987 6543', telegram: '@fatima_z', email: 'fatima@example.com', city: 'Jeddah' }, size: 'sm' } },
          { props: { ...{ name: 'Fatima Zahra', role: 'Group leader', phone: '+966 50 987 6543', telegram: '@fatima_z', email: 'fatima@example.com', city: 'Jeddah' }, size: 'md' } },
          { props: { ...{ name: 'Fatima Zahra', role: 'Group leader', phone: '+966 50 987 6543', telegram: '@fatima_z', email: 'fatima@example.com', city: 'Jeddah' }, size: 'lg' } },
          { props: { ...{ name: 'Fatima Zahra', role: 'Group leader', phone: '+966 50 987 6543', telegram: '@fatima_z', email: 'fatima@example.com', city: 'Jeddah' }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'KanbanColumn',
    description: 'Kanban lane with a title and card counter. Cards are passed as children. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      { label: 'With cards', width: '300px', props: { title: 'To contact' }, children: [{ name: 'KanbanCard', props: { title: 'Visa documents', sub: 'Group of 12', tag: 'Urgent', tone: 'danger' } }, { name: 'KanbanCard', props: { title: 'Hotel voucher', sub: 'Dar Al Iman', tag: 'Done', tone: 'success' } }] },
      { label: 'Custom count', width: '300px', props: { title: 'Visa pending', count: 12 } },
      {
        label: 'Sizes',
        width: '300px', items: [
          { props: { ...{ title: 'To contact', count: 2 }, size: 'xs' } },
          { props: { ...{ title: 'To contact', count: 2 }, size: 'sm' } },
          { props: { ...{ title: 'To contact', count: 2 }, size: 'md' } },
          { props: { ...{ title: 'To contact', count: 2 }, size: 'lg' } },
          { props: { ...{ title: 'To contact', count: 2 }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'KanbanCard',
    description: 'Card for a kanban lane with title, optional subtitle and a colored tag. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      {
        label: 'Tones',
        width: '280px',
        items: [
          { props: { title: 'Visa documents', sub: 'Group of 12', tag: 'Urgent', tone: 'danger' } },
          { props: { title: 'Hotel voucher', sub: 'Dar Al Iman', tag: 'Done', tone: 'success' } },
          { props: { title: 'Transfer booking', sub: 'Jeddah airport' } },
        ],
      },
      {
        label: 'Sizes',
        width: '280px', items: [
          { props: { ...{ title: 'Visa documents', sub: 'Group of 12', tag: 'Urgent', tone: 'danger' }, size: 'xs' } },
          { props: { ...{ title: 'Visa documents', sub: 'Group of 12', tag: 'Urgent', tone: 'danger' }, size: 'sm' } },
          { props: { ...{ title: 'Visa documents', sub: 'Group of 12', tag: 'Urgent', tone: 'danger' }, size: 'md' } },
          { props: { ...{ title: 'Visa documents', sub: 'Group of 12', tag: 'Urgent', tone: 'danger' }, size: 'lg' } },
          { props: { ...{ title: 'Visa documents', sub: 'Group of 12', tag: 'Urgent', tone: 'danger' }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'CallRow',
    description: 'One-line call log entry with avatar, status, duration in seconds and a play button. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      { label: 'Localized duration units (durUnits)', width: '360px', props: { name: 'Ibrahim Yusuf', status: 'Answered', duration: 184, durUnits: { m: 'min', s: 'sec' } } },
      {
        label: 'Log',
        width: '360px',
        items: [
          { props: { name: 'Ibrahim Yusuf', status: 'Answered', duration: 184 } },
          { props: { name: 'Maryam Said', status: 'Missed', duration: 0 } },
        ],
      },
      {
        label: 'Sizes',
        width: '360px', items: [
          { props: { ...{ name: 'Ibrahim Yusuf', status: 'Answered', duration: 184 }, size: 'xs' } },
          { props: { ...{ name: 'Ibrahim Yusuf', status: 'Answered', duration: 184 }, size: 'sm' } },
          { props: { ...{ name: 'Ibrahim Yusuf', status: 'Answered', duration: 184 }, size: 'md' } },
          { props: { ...{ name: 'Ibrahim Yusuf', status: 'Answered', duration: 184 }, size: 'lg' } },
          { props: { ...{ name: 'Ibrahim Yusuf', status: 'Answered', duration: 184 }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'CallCard',
    description: 'Call recording card with phone, status badge, playback progress and duration. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      { label: 'Status tones', width: '360px', items: ['Answered', 'Missed', 'Voicemail', 'Busy', 'Declined', 'Transferred'].map(status => ({ props: { name: 'Ibrahim Yusuf', phone: '+966 50 123 4567', status, duration: 184, progress: 40 } })) },
      { label: 'Answered', width: '360px', props: { name: 'Ibrahim Yusuf', phone: '+966 55 123 4567', status: 'Answered', progress: 40, duration: 212 } },
      { label: 'Missed', width: '360px', props: { name: 'Maryam Said', phone: '+998 90 555 1122', status: 'Missed', progress: 0, duration: 0 } },
      {
        label: 'Sizes',
        width: '360px', items: [
          { props: { ...{ name: 'Ibrahim Yusuf', phone: '+966 55 123 4567', status: 'Answered', progress: 40, duration: 212 }, size: 'xs' } },
          { props: { ...{ name: 'Ibrahim Yusuf', phone: '+966 55 123 4567', status: 'Answered', progress: 40, duration: 212 }, size: 'sm' } },
          { props: { ...{ name: 'Ibrahim Yusuf', phone: '+966 55 123 4567', status: 'Answered', progress: 40, duration: 212 }, size: 'md' } },
          { props: { ...{ name: 'Ibrahim Yusuf', phone: '+966 55 123 4567', status: 'Answered', progress: 40, duration: 212 }, size: 'lg' } },
          { props: { ...{ name: 'Ibrahim Yusuf', phone: '+966 55 123 4567', status: 'Answered', progress: 40, duration: 212 }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'IncomingCall',
    description: 'Floating incoming call banner with decline and answer buttons. The size prop (xs, sm, md, lg, xl) scales padding, text and avatar size.',
    variants: [
      { label: 'Default', width: '400px', props: { name: 'Ibrahim Yusuf', phone: '+966 55 123 4567' } },
      { label: 'Custom label', width: '400px', props: { label: 'Callback request', name: 'Maryam Said', phone: '+998 90 555 1122' } },
      {
        label: 'Sizes',
        width: '460px', items: [
          { props: { ...{ name: 'Ibrahim Yusuf', phone: '+966 55 123 4567' }, size: 'xs' } },
          { props: { ...{ name: 'Ibrahim Yusuf', phone: '+966 55 123 4567' }, size: 'sm' } },
          { props: { ...{ name: 'Ibrahim Yusuf', phone: '+966 55 123 4567' }, size: 'md' } },
          { props: { ...{ name: 'Ibrahim Yusuf', phone: '+966 55 123 4567' }, size: 'lg' } },
          { props: { ...{ name: 'Ibrahim Yusuf', phone: '+966 55 123 4567' }, size: 'xl' } },
        ],
      },
    ],
  },
  {
    name: 'AuthSplit',
    description: 'Two-pane auth layout: the aside prop holds the brand panel, the logo prop the mark, and the default slot is the form.',
    variants: [
      { label: 'Sign in', width: '100%', props: { title: 'Welcome back', subtitle: 'Sign in to manage your Umrah groups.', aside: 'Plan every journey with ZiyaraGo', logo: 'ZiyaraGo' }, text: 'Form goes here' },
    ],
  },
]
export default examples
