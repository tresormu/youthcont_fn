
export const MOCK_USER = {
  _id: 'user_1',
  name: 'Admin User',
  email: 'admin@theyouthcontest.com',
  role: 'seed_admin',
};

export const MOCK_EVENTS = [
  {
    _id: 'event_1',
    name: 'National Youth Debate Championship',
    edition: '2026 Edition',
    description: 'The premier debate tournament for high school students nationwide, featuring top teams from every region.',
    status: 'Preliminary Rounds',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'event_2',
    name: 'East Africa Public Speaking Open',
    edition: 'Spring 2026',
    description: 'A prestigious regional competition for aspiring public speakers and young leaders across East Africa.',
    status: 'Registration Open',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    _id: 'event_3',
    name: 'Pan-African Tournament',
    edition: '2025 Edition',
    description: 'Archive of the 2025 Pan-African Tournament held in Nairobi.',
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000 * 400).toISOString(),
  },
  {
    _id: 'event_4',
    name: 'Global Debate Series',
    edition: 'Summer 2026',
    description: 'A global series of debates focusing on climate change and technology.',
    status: 'Draft',
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_SCHOOLS: Record<string, any[]> = {
  'event_1': [
    { _id: 'school_1', name: 'Greenwood High', region: 'Central', teams: ['team_1', 'team_2'], publicSpeakers: ['ps_1'] },
    { _id: 'school_2', name: 'Riverside Academy', region: 'North', teams: ['team_3'], publicSpeakers: ['ps_2'] },
    { _id: 'school_3', name: 'Summit International', region: 'East', teams: ['team_4', 'team_5'], publicSpeakers: [] },
    { _id: 'school_4', name: 'Lakeside College', region: 'South', teams: ['team_6'], publicSpeakers: ['ps_3', 'ps_4'] },
    { _id: 'school_5', name: 'Hillside Academy', region: 'West', teams: ['team_7'], publicSpeakers: ['ps_5'] },
    { _id: 'school_6', name: 'Valley View School', region: 'Central', teams: ['team_8'], publicSpeakers: [] },
    { _id: 'school_7', name: 'Oceanic International', region: 'Coastal', teams: ['team_9', 'team_10'], publicSpeakers: ['ps_6'] },
    { _id: 'school_8', name: 'St. Peters High', region: 'North', teams: ['team_11'], publicSpeakers: ['ps_7'] },
  ],
  'event_2': [
    { _id: 'school_1', name: 'Greenwood High', region: 'Central', teams: [], publicSpeakers: ['ps_8', 'ps_9'] },
    { _id: 'school_3', name: 'Summit International', region: 'East', teams: [], publicSpeakers: ['ps_10'] },
  ]
};

export const MOCK_TEAMS: Record<string, any[]> = {
  'school_1': [
    { _id: 'team_1', name: 'Greenwood Alpha', teamNumber: 1, members: [{fullName: 'John Doe', speakerOrder: 1}, {fullName: 'Jane Smith', speakerOrder: 2}, {fullName: 'Bob Brown', speakerOrder: 3}], totalPoints: 12, matchesPlayed: 4, matchesWon: 4 },
    { _id: 'team_2', name: 'Greenwood Beta', teamNumber: 2, members: [{fullName: 'Alice Ross', speakerOrder: 1}, {fullName: 'Charlie Day', speakerOrder: 2}, {fullName: 'Diana Prince', speakerOrder: 3}], totalPoints: 6, matchesPlayed: 4, matchesWon: 2 },
  ],
  'school_2': [
    { _id: 'team_3', name: 'Riverside Eagles', teamNumber: 1, members: [{fullName: 'Eve Adams', speakerOrder: 1}, {fullName: 'Frank Wright', speakerOrder: 2}, {fullName: 'Grace Hopper', speakerOrder: 3}], totalPoints: 9, matchesPlayed: 4, matchesWon: 3 },
  ],
  'school_3': [
    { _id: 'team_4', name: 'Summit Titans', teamNumber: 1, members: [{fullName: 'Hank Pym', speakerOrder: 1}, {fullName: 'Ivy West', speakerOrder: 2}, {fullName: 'Jack Frost', speakerOrder: 3}], totalPoints: 15, matchesPlayed: 5, matchesWon: 5 },
    { _id: 'team_5', name: 'Summit Voyagers', teamNumber: 2, members: [{fullName: 'Kara Danvers', speakerOrder: 1}, {fullName: 'Liam Neeson', speakerOrder: 2}, {fullName: 'Mia Wallace', speakerOrder: 3}], totalPoints: 3, matchesPlayed: 4, matchesWon: 1 },
  ],
  'school_4': [
    { _id: 'team_6', name: 'Lakeside Lions', teamNumber: 1, members: [{fullName: 'Noah Ark', speakerOrder: 1}, {fullName: 'Olivia Wilde', speakerOrder: 2}, {fullName: 'Peter Pan', speakerOrder: 3}], totalPoints: 0, matchesPlayed: 4, matchesWon: 0 },
  ],
  'school_5': [
    { _id: 'team_7', name: 'Hillside Falcons', teamNumber: 1, members: [{fullName: 'Quinn Fabray', speakerOrder: 1}, {fullName: 'Rachel Berry', speakerOrder: 2}, {fullName: 'Santana Lopez', speakerOrder: 3}], totalPoints: 9, matchesPlayed: 4, matchesWon: 3 },
  ],
  'school_6': [
    { _id: 'team_8', name: 'Valley Rangers', teamNumber: 1, members: [{fullName: 'Tina Cohen', speakerOrder: 1}, {fullName: 'Artie Abrams', speakerOrder: 2}, {fullName: 'Blaine Anderson', speakerOrder: 3}], totalPoints: 6, matchesPlayed: 4, matchesWon: 2 },
  ],
  'school_7': [
    { _id: 'team_9', name: 'Oceanic Blue', teamNumber: 1, members: [{fullName: 'Sam Evans', speakerOrder: 1}, {fullName: 'Mike Chang', speakerOrder: 2}, {fullName: 'Finn Hudson', speakerOrder: 3}], totalPoints: 12, matchesPlayed: 4, matchesWon: 4 },
    { _id: 'team_10', name: 'Oceanic Pearl', teamNumber: 2, members: [{fullName: 'Kurt Hummel', speakerOrder: 1}, {fullName: 'Mercedes Jones', speakerOrder: 2}, {fullName: 'Brittany Pierce', speakerOrder: 3}], totalPoints: 6, matchesPlayed: 4, matchesWon: 2 },
  ],
  'school_8': [
    { _id: 'team_11', name: 'St. Peters Saints', teamNumber: 1, members: [{fullName: 'Will Schuester', speakerOrder: 1}, {fullName: 'Emma Pillsbury', speakerOrder: 2}, {fullName: 'Sue Sylvester', speakerOrder: 3}], totalPoints: 3, matchesPlayed: 4, matchesWon: 1 },
  ]
};

export const MOCK_MATCHUPS: Record<string, any[]> = {
  'event_1': [
    {
      _id: 'mu_1',
      schoolA: { _id: 'school_1', name: 'Greenwood High' },
      schoolB: { _id: 'school_2', name: 'Riverside Academy' },
      stage: 'Prelim',
      matches: [
        { _id: 'm_1', teamA: { _id: 'team_1', name: 'Greenwood Alpha' }, teamB: { _id: 'team_3', name: 'Riverside Eagles' }, winner: 'team_1', status: 'COMPLETED' },
        { _id: 'm_2', teamA: { _id: 'team_2', name: 'Greenwood Beta' }, teamB: null, winner: 'team_2', status: 'COMPLETED' },
      ]
    },
    {
      _id: 'mu_2',
      schoolA: { _id: 'school_3', name: 'Summit International' },
      schoolB: { _id: 'school_4', name: 'Lakeside College' },
      stage: 'Prelim',
      matches: [
        { _id: 'm_3', teamA: { _id: 'team_4', name: 'Summit Titans' }, teamB: { _id: 'team_6', name: 'Lakeside Lions' }, winner: 'team_4', status: 'COMPLETED' },
      ]
    },
    {
      _id: 'mu_3',
      schoolA: { _id: 'school_5', name: 'Hillside Academy' },
      schoolB: { _id: 'school_6', name: 'Valley View School' },
      stage: 'Prelim',
      matches: [
        { _id: 'm_4', teamA: { _id: 'team_7', name: 'Hillside Falcons' }, teamB: { _id: 'team_8', name: 'Valley Rangers' }, winner: 'team_7', status: 'COMPLETED' },
      ]
    }
  ]
};

export const MOCK_BRACKET: Record<string, any> = {
  'event_1': {
    'QUARTER_FINAL': [],
    'SEMI_FINAL': [],
    'FINAL': []
  }
};

export const MOCK_STAFF: any[] = [
  { _id: 'user_1', name: 'Admin User', email: 'admin@theyouthcontest.com', role: 'seed_admin', isActive: true, createdAt: new Date().toISOString() },
  { _id: 'user_2', name: 'Sarah Connor', email: 'sarah@theyouthcontest.com', role: 'staff', isActive: true, createdAt: new Date().toISOString() },
];

export const MOCK_PUBLIC_SPEAKERS: Record<string, any[]> = {
  'school_1': [
    { _id: 'ps_1', fullName: 'Alice Wonderland', speakerNumber: 1, school: 'school_1', event: 'event_1' },
    { _id: 'ps_8', fullName: 'Bob Builder', speakerNumber: 1, school: 'school_1', event: 'event_2' },
    { _id: 'ps_9', fullName: 'Charlie Brown', speakerNumber: 2, school: 'school_1', event: 'event_2' },
  ],
  'school_2': [
    { _id: 'ps_2', fullName: 'Diana Prince', speakerNumber: 1, school: 'school_2', event: 'event_1' },
  ],
  'school_4': [
    { _id: 'ps_3', fullName: 'Edward Scissorhands', speakerNumber: 1, school: 'school_4', event: 'event_1' },
    { _id: 'ps_4', fullName: 'Fiona Shrek', speakerNumber: 2, school: 'school_4', event: 'event_1' },
  ],
  'school_5': [
    { _id: 'ps_5', fullName: 'George Clooney', speakerNumber: 1, school: 'school_5', event: 'event_1' },
  ],
  'school_7': [
    { _id: 'ps_6', fullName: 'Hannah Montana', speakerNumber: 1, school: 'school_7', event: 'event_1' },
  ],
  'school_8': [
    { _id: 'ps_7', fullName: 'Isaac Newton', speakerNumber: 1, school: 'school_8', event: 'event_1' },
  ],
  'school_3': [
    { _id: 'ps_10', fullName: 'Jack Sparrow', speakerNumber: 1, school: 'school_3', event: 'event_2' },
  ]
};


