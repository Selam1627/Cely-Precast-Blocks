export interface RoadmapStep {
  /** Stable identifier, used as the list key. */
  id: string
  title: string
  /** Small label shown next to the title, such as "Current stage". */
  statusLabel?: string
  /** Short note shown under the title. */
  note?: string
}

export interface RoadmapContent {
  heading: string
  statement: string
  /** In the order the company plans to go through them. */
  steps: readonly RoadmapStep[]
}

export const roadmap: RoadmapContent = {
  heading: 'Stage and roadmap',
  statement: 'We are an early-stage company, currently at the concept stage.',
  steps: [
    {
      id: 'concept-and-planning',
      title: 'Concept and planning',
      statusLabel: 'Current stage',
    },
    {
      id: 'research-and-lab-development',
      title: 'Research and lab development',
      note: 'Seeking funding to start this phase.',
    },
    {
      id: 'pilot-production',
      title: 'Pilot production',
    },
  ],
}
