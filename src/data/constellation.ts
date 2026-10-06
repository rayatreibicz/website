export type NodeKind = 'anchor' | 'portal' | 'star' | 'quote';
export interface ConstellationNode { id:string; label?:string; kind:NodeKind; href?:string; meta?:string; position:{x:number;y:number}; glow?:'bright'|'medium'|'soft'|'faint'; size?:'large'|'medium'|'small'|'tiny'; }
export interface ConstellationLink { from:string; to:string; kind:'figure'|'bowl'|'handle'; }

// The Big Dipper: the four bowl points carry the site's navigation; the three handle
// points are atmospheric. Proportions are art-directed for a wide screen while keeping
// the familiar bowl + curving handle silhouette intact.
export const constellationNodes: ConstellationNode[] = [
  // Raya is Megrez: the bowl/handle junction and the visual starting point.
  // All four current destinations occupy the bowl. The full handle remains atmospheric.
  { id:'raya', label:'Raya Maia', kind:'anchor', href:'/about/', meta:'thoughtful systems for learning, living & growing', position:{x:.50,y:.49}, glow:'bright' },
  { id:'work', label:'Work', kind:'portal', href:'/work/', meta:'writing / coaching / public work', position:{x:.54,y:.72}, glow:'bright' },
  { id:'contact', label:'Contact', kind:'portal', href:'/contact/', meta:'say hello', position:{x:.72,y:.75}, glow:'bright' },
  { id:'projects', label:'Projects', kind:'portal', href:'/projects/', meta:'building / investigating / improving', position:{x:.80,y:.48}, glow:'bright' },

  // Three unlabeled handle points sweep left from Raya and remain available for future growth.
  { id:'handle-one', kind:'star', position:{x:.37,y:.39}, glow:'medium', size:'large' },
  { id:'handle-two', kind:'star', position:{x:.28,y:.30}, glow:'bright', size:'large' },
  { id:'handle-three', kind:'star', position:{x:.16,y:.28}, glow:'soft', size:'medium' },

  // Signature tucked beneath the handle in a light open-corner annotation — visually related, but not an eighth star.
  { id:'quote', label:"It all began with one question. I just haven't figured out which one yet.", kind:'quote', position:{x:.24,y:.48} },
];

export const constellationLinks: ConstellationLink[] = [
  // Bowl: all four corners are meaningful destinations.
  {from:'raya',to:'projects',kind:'bowl'},
  {from:'projects',to:'contact',kind:'bowl'},
  {from:'contact',to:'work',kind:'bowl'},
  {from:'work',to:'raya',kind:'bowl'},
  // Handle: deliberately unlabeled future-expansion territory.
  {from:'raya',to:'handle-one',kind:'handle'},
  {from:'handle-one',to:'handle-two',kind:'handle'},
  {from:'handle-two',to:'handle-three',kind:'handle'},
];
