/** Scores are single recorded evaluations, not probabilities or success rates. */
export const localCheckpoints = [
  { label: 'Oct 8', model: 'Gemma', full: 'October 8 · Gemma' },
  { label: 'Oct 13', model: 'Gemma', full: 'October 13 · Gemma' },
  { label: 'Oct 13', model: 'Qwen3', full: 'October 13 · Qwen3' },
  { label: 'Oct 23', model: 'Qwen3', full: 'October 23 · Qwen3' },
  { label: 'Oct 27', model: 'Qwen3', full: 'October 27 · Qwen3' },
] as const;

export const localTests = [
  {
    id: '01', capability: 'File retrieval',
    prompt: 'What did I change in v2.0 of my website?',
    expected: 'Summarize navigation, layout and project presentation updates.',
    source: 'Personal website.md', scores: [0, 0, .5, 1, .5],
  },
  {
    id: '02', capability: 'False retrieval',
    prompt: 'What is Project Aurora?',
    expected: 'Report that no matching information was found; do not invent details.',
    source: 'No matching document', scores: [0, 0, 1, 1, 1],
  },
  {
    id: '03', capability: 'Task creation',
    prompt: 'Add a task to review my portfolio.',
    expected: 'Create exactly one task with status Not Started and confirm accurately.',
    source: 'Tasks database', scores: [null, 1, 1, .5, 1],
  },
  {
    id: '04', capability: 'Calendar lookup',
    prompt: "What's on my calendar on Sep 9?",
    expected: 'Find a 10 a.m. meeting and an all-day birthday.',
    source: 'Google Calendar', scores: [null, null, null, .5, 1],
  },
  {
    id: '05', capability: 'Scheduling',
    prompt: 'Can I meet for 1 hour at 2 PM on Oct 20?',
    expected: 'Recognize availability while flagging the next-day in-person spacing preference, not a timed overlap.',
    source: 'Google Calendar', scores: [null, null, null, .5, .5],
  },
  {
    id: '06', capability: 'Mail retrieval',
    prompt: 'What did Alex say about the website?',
    expected: 'Summarize the relevant email without unsupported inferences.',
    source: 'Website Feedback email', scores: [null, null, null, 0, 1],
  },
] as const;

export const localObservations = [
  { when: 'Oct 13 · Gemma', label: 'File retrieval', text: 'Document retrieval failures and invented details prompted a change in model.' },
  { when: 'Oct 13 · Qwen3', label: 'File retrieval', text: 'Found the relevant document but returned only part of the requested information.' },
  { when: 'Oct 23 · Qwen3', label: 'Task creation', text: 'Created the task successfully but incorrectly told the user the action had failed.' },
  { when: 'Oct 23 · Qwen3', label: 'Scheduling', text: 'Identified calendar events but confused a spacing preference with a conflict.' },
  { when: 'Oct 27 · Qwen3', label: 'Multiple tests', text: 'Task creation and mail retrieval scored fully; file retrieval and scheduling remained partially correct.' },
] as const;