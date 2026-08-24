import type { HistoricalSource, PhysicalEntity, ReconstructionRequest, TimelineEvent } from '../types/entities';

// Real public records seeded from no-key sources.
export const demoSources: HistoricalSource[] = [
  {
    id: "wikidata-penn-station-1910",
    sourceType: "ARCHIVE",
    title: "Wikidata item Q14707174 — Pennsylvania Station (1910–1963)",
    publisher: "Wikidata",
    url: "https://www.wikidata.org/wiki/Q14707174",
    archiveReference: "Q14707174",
    copyrightStatus: "CC0 metadata; linked media requires per-file review",
    description: "Structured entity metadata used as a source-backed discovery record.",
    confidence: "HIGH",
    demoData: false
  },
  {
    id: "wikidata-brooklyn-bridge",
    sourceType: "ARCHIVE",
    title: "Wikidata item Q125006 — Brooklyn Bridge",
    publisher: "Wikidata",
    url: "https://www.wikidata.org/wiki/Q125006",
    archiveReference: "Q125006",
    copyrightStatus: "CC0 metadata; linked media requires per-file review",
    description: "Structured entity metadata used as a source-backed discovery record.",
    confidence: "CONFIRMED",
    demoData: false
  },
  {
    id: "wikidata-eads-bridge",
    sourceType: "ARCHIVE",
    title: "Wikidata item Q1239907 — Eads Bridge",
    publisher: "Wikidata",
    url: "https://www.wikidata.org/wiki/Q1239907",
    archiveReference: "Q1239907",
    copyrightStatus: "CC0 metadata; linked media requires per-file review",
    description: "Structured entity metadata used as a source-backed discovery record.",
    confidence: "HIGH",
    demoData: false
  },
  {
    id: "wikidata-pullman-national-historical-park",
    sourceType: "ARCHIVE",
    title: "Wikidata item Q7259479 — Pullman National Historical Park",
    publisher: "Wikidata",
    url: "https://www.wikidata.org/wiki/Q7259479",
    archiveReference: "Q7259479",
    copyrightStatus: "CC0 metadata; linked media requires per-file review",
    description: "Structured entity metadata used as a source-backed discovery record.",
    confidence: "HIGH",
    demoData: false
  },
  {
    id: "wikidata-fox-theatre-detroit",
    sourceType: "ARCHIVE",
    title: "Wikidata item Q3080199 — Fox Theatre (Detroit)",
    publisher: "Wikidata",
    url: "https://www.wikidata.org/wiki/Q3080199",
    archiveReference: "Q3080199",
    copyrightStatus: "CC0 metadata; linked media requires per-file review",
    description: "Structured entity metadata used as a source-backed discovery record.",
    confidence: "HIGH",
    demoData: false
  },
  {
    id: "wikidata-los-angeles-union-station",
    sourceType: "ARCHIVE",
    title: "Wikidata item Q198019 — Los Angeles Union Station",
    publisher: "Wikidata",
    url: "https://www.wikidata.org/wiki/Q198019",
    archiveReference: "Q198019",
    copyrightStatus: "CC0 metadata; linked media requires per-file review",
    description: "Structured entity metadata used as a source-backed discovery record.",
    confidence: "HIGH",
    demoData: false
  },
  {
    id: "wikidata-detroit-public-library-main",
    sourceType: "ARCHIVE",
    title: "Wikidata item Q131913777 — Detroit Public Library Main Branch",
    publisher: "Wikidata",
    url: "https://www.wikidata.org/wiki/Q131913777",
    archiveReference: "Q131913777",
    copyrightStatus: "CC0 metadata; linked media requires per-file review",
    description: "Structured entity metadata used as a source-backed discovery record.",
    confidence: "HIGH",
    demoData: false
  },
  {
    id: "wikidata-old-post-office-washington-dc",
    sourceType: "ARCHIVE",
    title: "Wikidata item Q1141542 — Old Post Office (Washington, D.C.)",
    publisher: "Wikidata",
    url: "https://www.wikidata.org/wiki/Q1141542",
    archiveReference: "Q1141542",
    copyrightStatus: "CC0 metadata; linked media requires per-file review",
    description: "Structured entity metadata used as a source-backed discovery record.",
    confidence: "HIGH",
    demoData: false
  },
  {
    id: "wikidata-soho-cast-iron-historic-district",
    sourceType: "ARCHIVE",
    title: "Wikidata item Q49562891 — SoHo Cast Iron Historic District",
    publisher: "Wikidata",
    url: "https://www.wikidata.org/wiki/Q49562891",
    archiveReference: "Q49562891",
    copyrightStatus: "CC0 metadata; linked media requires per-file review",
    description: "Structured entity metadata used as a source-backed discovery record.",
    confidence: "MEDIUM",
    demoData: false
  },
  {
    id: "wikidata-market-street-railway",
    sourceType: "ARCHIVE",
    title: "Wikidata item Q6770765 — Market Street Railway",
    publisher: "Wikidata",
    url: "https://www.wikidata.org/wiki/Q6770765",
    archiveReference: "Q6770765",
    copyrightStatus: "CC0 metadata; linked media requires per-file review",
    description: "Structured entity metadata used as a source-backed discovery record.",
    confidence: "MEDIUM",
    demoData: false
  },
  {
    id: "wikidata-flatiron-building",
    sourceType: "ARCHIVE",
    title: "Wikidata item Q220728 — Flatiron Building",
    publisher: "Wikidata",
    url: "https://www.wikidata.org/wiki/Q220728",
    archiveReference: "Q220728",
    copyrightStatus: "CC0 metadata; linked media requires per-file review",
    description: "Structured entity metadata used as a source-backed discovery record.",
    confidence: "HIGH",
    demoData: false
  },
  {
    id: "wikidata-riverside-church",
    sourceType: "ARCHIVE",
    title: "Wikidata item Q1156586 — Riverside Church",
    publisher: "Wikidata",
    url: "https://www.wikidata.org/wiki/Q1156586",
    archiveReference: "Q1156586",
    copyrightStatus: "CC0 metadata; linked media requires per-file review",
    description: "Structured entity metadata used as a source-backed discovery record.",
    confidence: "HIGH",
    demoData: false
  }
];

export const demoEntities: PhysicalEntity[] = [
  {
    id: "penn-station-1910",
    name: "Pennsylvania Station (1910–1963)",
    entityType: "infrastructure",
    description: "Former New York City railroad station opened in 1910 and demolished beginning in 1963; seeded from Wikidata and public media metadata for ItsPast discovery.",
    location: {
      latitude: 40.7506,
      longitude: -73.9939,
      address: "Seventh Avenue and 32nd Street, New York, NY"
    },
    createdDate: "1910",
    currentStatus: "demolished",
    confidenceLevel: "HIGH",
    dataQuality: 86,
    knownChanges: [
      "Real source-backed seed record",
      "Needs deeper archival cross-check before reconstruction",
      "No longer exists in original form"
    ],
    sourceIds: [
      "wikidata-penn-station-1910"
    ],
    relatedEntityIds: [],
    demoData: false,
    createdAt: "2026-08-24",
    updatedAt: "2026-08-24",
    destroyedDate: "1963"
  },
  {
    id: "brooklyn-bridge",
    name: "Brooklyn Bridge",
    entityType: "bridge",
    description: "Suspension/cable-stayed bridge crossing the East River between Manhattan and Brooklyn; seeded as a high-confidence public landmark record.",
    location: {
      latitude: 40.705666666,
      longitude: -73.996333333,
      address: "Brooklyn Bridge, New York, NY"
    },
    createdDate: "1883",
    currentStatus: "existing",
    confidenceLevel: "CONFIRMED",
    dataQuality: 98,
    knownChanges: [
      "Real source-backed seed record",
      "Needs deeper archival cross-check before reconstruction"
    ],
    sourceIds: [
      "wikidata-brooklyn-bridge"
    ],
    relatedEntityIds: [],
    demoData: false,
    createdAt: "2026-08-24",
    updatedAt: "2026-08-24"
  },
  {
    id: "eads-bridge",
    name: "Eads Bridge",
    entityType: "bridge",
    description: "Bridge spanning the Mississippi River at St. Louis, seeded from Wikidata as a real infrastructure discovery.",
    location: {
      latitude: 38.628056,
      longitude: -90.171389,
      address: "Mississippi River at St. Louis, Missouri"
    },
    createdDate: "1874",
    currentStatus: "existing",
    confidenceLevel: "HIGH",
    dataQuality: 86,
    knownChanges: [
      "Real source-backed seed record",
      "Needs deeper archival cross-check before reconstruction"
    ],
    sourceIds: [
      "wikidata-eads-bridge"
    ],
    relatedEntityIds: [],
    demoData: false,
    createdAt: "2026-08-24",
    updatedAt: "2026-08-24"
  },
  {
    id: "pullman-national-historical-park",
    name: "Pullman National Historical Park",
    entityType: "neighborhood",
    description: "Historic district and national historical park in Chicago associated with the Pullman company town.",
    location: {
      latitude: 41.697222,
      longitude: -87.609444,
      address: "Pullman, Chicago, IL"
    },
    createdDate: "1880",
    currentStatus: "changed",
    confidenceLevel: "HIGH",
    dataQuality: 86,
    knownChanges: [
      "Real source-backed seed record",
      "Needs deeper archival cross-check before reconstruction"
    ],
    sourceIds: [
      "wikidata-pullman-national-historical-park"
    ],
    relatedEntityIds: [],
    demoData: false,
    createdAt: "2026-08-24",
    updatedAt: "2026-08-24"
  },
  {
    id: "fox-theatre-detroit",
    name: "Fox Theatre (Detroit)",
    entityType: "building",
    description: "Theater and former movie palace in Detroit, opened in 1928; seeded with real coordinates and source provenance.",
    location: {
      latitude: 42.3386,
      longitude: -83.052236,
      address: "2211 Woodward Ave, Detroit, MI"
    },
    createdDate: "1928",
    currentStatus: "renovated",
    confidenceLevel: "HIGH",
    dataQuality: 86,
    knownChanges: [
      "Real source-backed seed record",
      "Needs deeper archival cross-check before reconstruction"
    ],
    sourceIds: [
      "wikidata-fox-theatre-detroit"
    ],
    relatedEntityIds: [],
    demoData: false,
    createdAt: "2026-08-24",
    updatedAt: "2026-08-24"
  },
  {
    id: "los-angeles-union-station",
    name: "Los Angeles Union Station",
    entityType: "infrastructure",
    description: "Main railroad station in Los Angeles, opened in 1939; seeded as a public transportation landmark.",
    location: {
      latitude: 34.0551,
      longitude: -118.235,
      address: "800 N Alameda St, Los Angeles, CA"
    },
    createdDate: "1939",
    currentStatus: "existing",
    confidenceLevel: "HIGH",
    dataQuality: 86,
    knownChanges: [
      "Real source-backed seed record",
      "Needs deeper archival cross-check before reconstruction"
    ],
    sourceIds: [
      "wikidata-los-angeles-union-station"
    ],
    relatedEntityIds: [],
    demoData: false,
    createdAt: "2026-08-24",
    updatedAt: "2026-08-24"
  },
  {
    id: "detroit-public-library-main",
    name: "Detroit Public Library Main Branch",
    entityType: "building",
    description: "Main public library building in Detroit, opened in 1921; seeded as a real civic building record.",
    location: {
      latitude: 42.3586,
      longitude: -83.0667,
      address: "5201 Woodward Ave, Detroit, MI"
    },
    createdDate: "1921",
    currentStatus: "existing",
    confidenceLevel: "HIGH",
    dataQuality: 86,
    knownChanges: [
      "Real source-backed seed record",
      "Needs deeper archival cross-check before reconstruction"
    ],
    sourceIds: [
      "wikidata-detroit-public-library-main"
    ],
    relatedEntityIds: [],
    demoData: false,
    createdAt: "2026-08-24",
    updatedAt: "2026-08-24"
  },
  {
    id: "old-post-office-washington-dc",
    name: "Old Post Office (Washington, D.C.)",
    entityType: "building",
    description: "Historic building on Pennsylvania Avenue in Washington, D.C.; seeded with real source references and coordinates.",
    location: {
      latitude: 38.893977777,
      longitude: -77.027975,
      address: "1100 Pennsylvania Ave NW, Washington, DC"
    },
    createdDate: "1899",
    currentStatus: "renovated",
    confidenceLevel: "HIGH",
    dataQuality: 86,
    knownChanges: [
      "Real source-backed seed record",
      "Needs deeper archival cross-check before reconstruction"
    ],
    sourceIds: [
      "wikidata-old-post-office-washington-dc"
    ],
    relatedEntityIds: [],
    demoData: false,
    createdAt: "2026-08-24",
    updatedAt: "2026-08-24"
  },
  {
    id: "soho-cast-iron-historic-district",
    name: "SoHo Cast Iron Historic District",
    entityType: "neighborhood",
    description: "Historic district in Manhattan known for cast-iron architecture; seeded as a real district record.",
    location: {
      latitude: 40.723055555,
      longitude: -74.001111111,
      address: "SoHo, Manhattan, New York, NY"
    },
    createdDate: "1973",
    currentStatus: "existing",
    confidenceLevel: "MEDIUM",
    dataQuality: 68,
    knownChanges: [
      "Real source-backed seed record",
      "Needs deeper archival cross-check before reconstruction"
    ],
    sourceIds: [
      "wikidata-soho-cast-iron-historic-district"
    ],
    relatedEntityIds: [],
    demoData: false,
    createdAt: "2026-08-24",
    updatedAt: "2026-08-24"
  },
  {
    id: "market-street-railway",
    name: "Market Street Railway",
    entityType: "infrastructure",
    description: "San Francisco streetcar and bus operator active from 1860 to 1944; seeded as a real historical transportation entity.",
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: "San Francisco, CA"
    },
    createdDate: "1860",
    currentStatus: "changed",
    confidenceLevel: "MEDIUM",
    dataQuality: 68,
    knownChanges: [
      "Real source-backed seed record",
      "Needs deeper archival cross-check before reconstruction",
      "No longer exists in original form"
    ],
    sourceIds: [
      "wikidata-market-street-railway"
    ],
    relatedEntityIds: [],
    demoData: false,
    createdAt: "2026-08-24",
    updatedAt: "2026-08-24",
    destroyedDate: "1944"
  },
  {
    id: "flatiron-building",
    name: "Flatiron Building",
    entityType: "building",
    description: "Triangular skyscraper in Manhattan completed in 1902; seeded as a real public landmark record.",
    location: {
      latitude: 40.741111,
      longitude: -73.989722,
      address: "175 Fifth Ave, New York, NY"
    },
    createdDate: "1902",
    currentStatus: "existing",
    confidenceLevel: "HIGH",
    dataQuality: 86,
    knownChanges: [
      "Real source-backed seed record",
      "Needs deeper archival cross-check before reconstruction"
    ],
    sourceIds: [
      "wikidata-flatiron-building"
    ],
    relatedEntityIds: [],
    demoData: false,
    createdAt: "2026-08-24",
    updatedAt: "2026-08-24"
  },
  {
    id: "riverside-church",
    name: "Riverside Church",
    entityType: "building",
    description: "Interdenominational church in Manhattan with Wikidata-recorded inception and coordinates; seeded as a real landmark.",
    location: {
      latitude: 40.81178,
      longitude: -73.96307,
      address: "490 Riverside Dr, New York, NY"
    },
    createdDate: "1927",
    currentStatus: "existing",
    confidenceLevel: "HIGH",
    dataQuality: 86,
    knownChanges: [
      "Real source-backed seed record",
      "Needs deeper archival cross-check before reconstruction"
    ],
    sourceIds: [
      "wikidata-riverside-church"
    ],
    relatedEntityIds: [],
    demoData: false,
    createdAt: "2026-08-24",
    updatedAt: "2026-08-24"
  }
];

export const demoTimeline: TimelineEvent[] = [
  {
    id: "event-penn-station-1910",
    entityId: "penn-station-1910",
    date: "1910",
    datePrecision: "YEAR",
    title: "Recorded inception / opening",
    description: "Structured no-key source metadata supplies this date clue; archival cross-check required before reconstruction.",
    eventType: "inception",
    confidence: "HIGH",
    sourceIds: [
      "wikidata-penn-station-1910"
    ]
  },
  {
    id: "event-brooklyn-bridge",
    entityId: "brooklyn-bridge",
    date: "1883",
    datePrecision: "YEAR",
    title: "Recorded inception / opening",
    description: "Structured no-key source metadata supplies this date clue; archival cross-check required before reconstruction.",
    eventType: "inception",
    confidence: "CONFIRMED",
    sourceIds: [
      "wikidata-brooklyn-bridge"
    ]
  },
  {
    id: "event-eads-bridge",
    entityId: "eads-bridge",
    date: "1874",
    datePrecision: "YEAR",
    title: "Recorded inception / opening",
    description: "Structured no-key source metadata supplies this date clue; archival cross-check required before reconstruction.",
    eventType: "inception",
    confidence: "HIGH",
    sourceIds: [
      "wikidata-eads-bridge"
    ]
  },
  {
    id: "event-pullman-national-historical-park",
    entityId: "pullman-national-historical-park",
    date: "1880",
    datePrecision: "YEAR",
    title: "Recorded inception / opening",
    description: "Structured no-key source metadata supplies this date clue; archival cross-check required before reconstruction.",
    eventType: "inception",
    confidence: "HIGH",
    sourceIds: [
      "wikidata-pullman-national-historical-park"
    ]
  },
  {
    id: "event-fox-theatre-detroit",
    entityId: "fox-theatre-detroit",
    date: "1928",
    datePrecision: "YEAR",
    title: "Recorded inception / opening",
    description: "Structured no-key source metadata supplies this date clue; archival cross-check required before reconstruction.",
    eventType: "inception",
    confidence: "HIGH",
    sourceIds: [
      "wikidata-fox-theatre-detroit"
    ]
  },
  {
    id: "event-los-angeles-union-station",
    entityId: "los-angeles-union-station",
    date: "1939",
    datePrecision: "YEAR",
    title: "Recorded inception / opening",
    description: "Structured no-key source metadata supplies this date clue; archival cross-check required before reconstruction.",
    eventType: "inception",
    confidence: "HIGH",
    sourceIds: [
      "wikidata-los-angeles-union-station"
    ]
  },
  {
    id: "event-detroit-public-library-main",
    entityId: "detroit-public-library-main",
    date: "1921",
    datePrecision: "YEAR",
    title: "Recorded inception / opening",
    description: "Structured no-key source metadata supplies this date clue; archival cross-check required before reconstruction.",
    eventType: "inception",
    confidence: "HIGH",
    sourceIds: [
      "wikidata-detroit-public-library-main"
    ]
  },
  {
    id: "event-old-post-office-washington-dc",
    entityId: "old-post-office-washington-dc",
    date: "1899",
    datePrecision: "YEAR",
    title: "Recorded inception / opening",
    description: "Structured no-key source metadata supplies this date clue; archival cross-check required before reconstruction.",
    eventType: "inception",
    confidence: "HIGH",
    sourceIds: [
      "wikidata-old-post-office-washington-dc"
    ]
  },
  {
    id: "event-soho-cast-iron-historic-district",
    entityId: "soho-cast-iron-historic-district",
    date: "1973",
    datePrecision: "YEAR",
    title: "Recorded inception / opening",
    description: "Structured no-key source metadata supplies this date clue; archival cross-check required before reconstruction.",
    eventType: "inception",
    confidence: "MEDIUM",
    sourceIds: [
      "wikidata-soho-cast-iron-historic-district"
    ]
  },
  {
    id: "event-market-street-railway",
    entityId: "market-street-railway",
    date: "1860",
    datePrecision: "YEAR",
    title: "Recorded inception / opening",
    description: "Structured no-key source metadata supplies this date clue; archival cross-check required before reconstruction.",
    eventType: "inception",
    confidence: "MEDIUM",
    sourceIds: [
      "wikidata-market-street-railway"
    ]
  },
  {
    id: "event-flatiron-building",
    entityId: "flatiron-building",
    date: "1902",
    datePrecision: "YEAR",
    title: "Recorded inception / opening",
    description: "Structured no-key source metadata supplies this date clue; archival cross-check required before reconstruction.",
    eventType: "inception",
    confidence: "HIGH",
    sourceIds: [
      "wikidata-flatiron-building"
    ]
  },
  {
    id: "event-riverside-church",
    entityId: "riverside-church",
    date: "1927",
    datePrecision: "YEAR",
    title: "Recorded inception / opening",
    description: "Structured no-key source metadata supplies this date clue; archival cross-check required before reconstruction.",
    eventType: "inception",
    confidence: "HIGH",
    sourceIds: [
      "wikidata-riverside-church"
    ]
  }
];

export const demoReconstructions: ReconstructionRequest[] = [
  {
    id: "recon-penn-station-1910",
    entityId: "penn-station-1910",
    targetYear: "1910",
    status: "INSUFFICIENT_EVIDENCE",
    confidence: "SPECULATIVE",
    prompt: "AI HISTORICAL RECONSTRUCTION candidate only. Requires source images/maps/architectural evidence beyond seed metadata before generation.",
    evidence: [
      {
        id: "evidence-penn-station-1910",
        label: "DOCUMENTED",
        description: "Seed source documents identity, coordinates and a research date clue; not enough alone for generation.",
        sourceIds: [
          "wikidata-penn-station-1910"
        ]
      }
    ]
  },
  {
    id: "recon-brooklyn-bridge",
    entityId: "brooklyn-bridge",
    targetYear: "1883",
    status: "INSUFFICIENT_EVIDENCE",
    confidence: "SPECULATIVE",
    prompt: "AI HISTORICAL RECONSTRUCTION candidate only. Requires source images/maps/architectural evidence beyond seed metadata before generation.",
    evidence: [
      {
        id: "evidence-brooklyn-bridge",
        label: "DOCUMENTED",
        description: "Seed source documents identity, coordinates and a research date clue; not enough alone for generation.",
        sourceIds: [
          "wikidata-brooklyn-bridge"
        ]
      }
    ]
  },
  {
    id: "recon-eads-bridge",
    entityId: "eads-bridge",
    targetYear: "1874",
    status: "INSUFFICIENT_EVIDENCE",
    confidence: "SPECULATIVE",
    prompt: "AI HISTORICAL RECONSTRUCTION candidate only. Requires source images/maps/architectural evidence beyond seed metadata before generation.",
    evidence: [
      {
        id: "evidence-eads-bridge",
        label: "DOCUMENTED",
        description: "Seed source documents identity, coordinates and a research date clue; not enough alone for generation.",
        sourceIds: [
          "wikidata-eads-bridge"
        ]
      }
    ]
  },
  {
    id: "recon-pullman-national-historical-park",
    entityId: "pullman-national-historical-park",
    targetYear: "1880",
    status: "INSUFFICIENT_EVIDENCE",
    confidence: "SPECULATIVE",
    prompt: "AI HISTORICAL RECONSTRUCTION candidate only. Requires source images/maps/architectural evidence beyond seed metadata before generation.",
    evidence: [
      {
        id: "evidence-pullman-national-historical-park",
        label: "DOCUMENTED",
        description: "Seed source documents identity, coordinates and a research date clue; not enough alone for generation.",
        sourceIds: [
          "wikidata-pullman-national-historical-park"
        ]
      }
    ]
  },
  {
    id: "recon-fox-theatre-detroit",
    entityId: "fox-theatre-detroit",
    targetYear: "1928",
    status: "INSUFFICIENT_EVIDENCE",
    confidence: "SPECULATIVE",
    prompt: "AI HISTORICAL RECONSTRUCTION candidate only. Requires source images/maps/architectural evidence beyond seed metadata before generation.",
    evidence: [
      {
        id: "evidence-fox-theatre-detroit",
        label: "DOCUMENTED",
        description: "Seed source documents identity, coordinates and a research date clue; not enough alone for generation.",
        sourceIds: [
          "wikidata-fox-theatre-detroit"
        ]
      }
    ]
  },
  {
    id: "recon-los-angeles-union-station",
    entityId: "los-angeles-union-station",
    targetYear: "1939",
    status: "INSUFFICIENT_EVIDENCE",
    confidence: "SPECULATIVE",
    prompt: "AI HISTORICAL RECONSTRUCTION candidate only. Requires source images/maps/architectural evidence beyond seed metadata before generation.",
    evidence: [
      {
        id: "evidence-los-angeles-union-station",
        label: "DOCUMENTED",
        description: "Seed source documents identity, coordinates and a research date clue; not enough alone for generation.",
        sourceIds: [
          "wikidata-los-angeles-union-station"
        ]
      }
    ]
  },
  {
    id: "recon-detroit-public-library-main",
    entityId: "detroit-public-library-main",
    targetYear: "1921",
    status: "INSUFFICIENT_EVIDENCE",
    confidence: "SPECULATIVE",
    prompt: "AI HISTORICAL RECONSTRUCTION candidate only. Requires source images/maps/architectural evidence beyond seed metadata before generation.",
    evidence: [
      {
        id: "evidence-detroit-public-library-main",
        label: "DOCUMENTED",
        description: "Seed source documents identity, coordinates and a research date clue; not enough alone for generation.",
        sourceIds: [
          "wikidata-detroit-public-library-main"
        ]
      }
    ]
  },
  {
    id: "recon-old-post-office-washington-dc",
    entityId: "old-post-office-washington-dc",
    targetYear: "1899",
    status: "INSUFFICIENT_EVIDENCE",
    confidence: "SPECULATIVE",
    prompt: "AI HISTORICAL RECONSTRUCTION candidate only. Requires source images/maps/architectural evidence beyond seed metadata before generation.",
    evidence: [
      {
        id: "evidence-old-post-office-washington-dc",
        label: "DOCUMENTED",
        description: "Seed source documents identity, coordinates and a research date clue; not enough alone for generation.",
        sourceIds: [
          "wikidata-old-post-office-washington-dc"
        ]
      }
    ]
  },
  {
    id: "recon-soho-cast-iron-historic-district",
    entityId: "soho-cast-iron-historic-district",
    targetYear: "1973",
    status: "INSUFFICIENT_EVIDENCE",
    confidence: "SPECULATIVE",
    prompt: "AI HISTORICAL RECONSTRUCTION candidate only. Requires source images/maps/architectural evidence beyond seed metadata before generation.",
    evidence: [
      {
        id: "evidence-soho-cast-iron-historic-district",
        label: "DOCUMENTED",
        description: "Seed source documents identity, coordinates and a research date clue; not enough alone for generation.",
        sourceIds: [
          "wikidata-soho-cast-iron-historic-district"
        ]
      }
    ]
  },
  {
    id: "recon-market-street-railway",
    entityId: "market-street-railway",
    targetYear: "1860",
    status: "INSUFFICIENT_EVIDENCE",
    confidence: "SPECULATIVE",
    prompt: "AI HISTORICAL RECONSTRUCTION candidate only. Requires source images/maps/architectural evidence beyond seed metadata before generation.",
    evidence: [
      {
        id: "evidence-market-street-railway",
        label: "DOCUMENTED",
        description: "Seed source documents identity, coordinates and a research date clue; not enough alone for generation.",
        sourceIds: [
          "wikidata-market-street-railway"
        ]
      }
    ]
  },
  {
    id: "recon-flatiron-building",
    entityId: "flatiron-building",
    targetYear: "1902",
    status: "INSUFFICIENT_EVIDENCE",
    confidence: "SPECULATIVE",
    prompt: "AI HISTORICAL RECONSTRUCTION candidate only. Requires source images/maps/architectural evidence beyond seed metadata before generation.",
    evidence: [
      {
        id: "evidence-flatiron-building",
        label: "DOCUMENTED",
        description: "Seed source documents identity, coordinates and a research date clue; not enough alone for generation.",
        sourceIds: [
          "wikidata-flatiron-building"
        ]
      }
    ]
  },
  {
    id: "recon-riverside-church",
    entityId: "riverside-church",
    targetYear: "1927",
    status: "INSUFFICIENT_EVIDENCE",
    confidence: "SPECULATIVE",
    prompt: "AI HISTORICAL RECONSTRUCTION candidate only. Requires source images/maps/architectural evidence beyond seed metadata before generation.",
    evidence: [
      {
        id: "evidence-riverside-church",
        label: "DOCUMENTED",
        description: "Seed source documents identity, coordinates and a research date clue; not enough alone for generation.",
        sourceIds: [
          "wikidata-riverside-church"
        ]
      }
    ]
  }
];
