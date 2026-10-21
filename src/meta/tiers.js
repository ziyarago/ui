// Which components stay in the free MIT package and which belong to Pro. Everything not listed in PRO is free.
// Versions 0.1 to 0.10 already shipped everything under MIT and stay MIT; this split applies to new releases.
export const PRO = {
  layout: ['LiquidGlass', 'Sortable'],
  actions: ['Fab', 'ActionRail', 'ActionCard', 'NotificationBell'],
  forms: ['ChipInput', 'InlineEdit', 'RichEditor', 'GroupedSelect', 'TreeSelect', 'PillSelect', 'OptionCard', 'OptionCards', 'RangeSlider', 'ColorPicker', 'RangeCalendar', 'ImageUpload', 'ValidatedField', 'StepForm', 'Stepper'],
  data: ['DataGroup', 'TreeView', 'CalendarView', 'KpiInline', 'StatRow', 'StatLine', 'StatStrip', 'CountryRow', 'VersusBar', 'SegBar', 'ChartCard', 'OccupancyChart', 'SalesFunnel', 'SystemStatus', 'UserCell', 'HeroBanner', 'TabTiles', 'PricingCard', 'IntegrationCard'],
  overlay: ['StepDialog', 'FullscreenDialog', 'Actionsheet', 'HoverCard', 'CommandBar', 'ImageViewer', 'Tour', 'TourPopover', 'Screensaver'],
  media: ['Gallery', 'Map', 'ProfileHeader', 'ChatAi', 'Carousel'],
  domain: ['HotelCard', 'TourCard', 'PrayerTimes', 'RamadanTracker', 'QiblaCompass', 'BookingCard', 'GuestCard', 'RoomGrid', 'RoomCalendar', 'LeadCard', 'DealCard', 'PipelineBoard', 'ContactPanel', 'KanbanColumn', 'KanbanCard', 'CallRow', 'CallCard', 'IncomingCall', 'AuthShowcase'],
  pages: ['PagePatterns', 'PageCrm', 'PageBookings', 'PageCatalog', 'PageDetail', 'PageProfile', 'PageForm', 'PageOrder', 'PageAccount', 'PageFaq', 'PageAnalytics', 'PageCalendar', 'PageKanban', 'PageBilling', 'PageTeam', 'PageIntegrations', 'PageSearch', 'PageArticle', 'PageChangelog', 'PageHelp', 'PageStates', 'PageLegal', 'PageLocations', 'PageBookingFlow', 'PageLanding', 'PageOnboarding', 'PageCheckout', 'PageInbox', 'PageNotifications', 'PageItinerary', 'PagePrayer', 'PageGroupManager', 'PageTourPublic'],
};
export const PRO_NAMES = new Set(Object.values(PRO).flat());
export const isPro = name => PRO_NAMES.has(name);
