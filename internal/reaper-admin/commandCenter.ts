export type ReaperAdminSection = {
  id: string;
  title: string;
  purpose: string;
  privateOnly: true;
  actions: string[];
};

export const reaperResearchCommandCenter: ReaperAdminSection[] = [
  { id: 'home', title: 'ITS PAST RESEARCH COMMAND CENTER', purpose: 'Physical entities, histories built, sources, timelines, reconstructions, queue, conflicts, and review required.', privateOnly: true, actions: ['OPEN_QUEUE', 'VIEW_CONFLICTS', 'VIEW_REVIEW_REQUIRED'] },
  { id: 'research-queue', title: 'Research Queue', purpose: 'Manage research depth, reconstruction status, confidence, and review actions.', privateOnly: true, actions: ['OPEN', 'RESEARCH_AGAIN', 'DEEP_RESEARCH', 'REVIEW', 'RECONSTRUCT'] },
  { id: 'job-detail', title: 'Research Job View', purpose: 'Inspect searches performed, sources found, claims, evidence, conflicts, confidence, timeline, and reconstruction status.', privateOnly: true, actions: ['VIEW_CHAIN', 'REQUEST_MORE_RESEARCH'] },
  { id: 'sources', title: 'Source Management', purpose: 'Review provider records, URLs, licenses, copyright status, linked claims, entities, and reliability.', privateOnly: true, actions: ['VIEW', 'DISABLE', 'RESEARCH_AGAIN', 'FLAG'] },
  { id: 'claims', title: 'Claim Management', purpose: 'Approve, reject, request more research, or mark uncertain without overwriting evidence.', privateOnly: true, actions: ['APPROVE', 'REJECT', 'REQUEST_MORE_RESEARCH', 'MARK_UNCERTAIN'] },
  { id: 'reconstruction', title: 'Reconstruction Studio', purpose: 'Generate and review research-gated reconstructions with known, estimated, and unknown elements separated.', privateOnly: true, actions: ['GENERATE', 'REGENERATE', 'APPROVE', 'REJECT', 'REQUEST_MORE_EVIDENCE'] },
  { id: 'monitoring', title: 'System Monitoring', purpose: 'Watch jobs, failures, API calls, AI calls, storage, processing time, errors, cost, and rate limits.', privateOnly: true, actions: ['VIEW_HEALTH', 'VIEW_COSTS', 'VIEW_RATE_LIMITS'] }
];

export const publicBundleBoundary = 'The public ItsPast app must not import this module or route to these sections.';
