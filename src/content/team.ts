export interface TeamMember {
  name: string
  role: string
  bio: string
}

export interface TeamContent {
  heading: string
  members: readonly TeamMember[]
}

export const team: TeamContent = {
  heading: 'Team',
  members: [
    {
      name: 'Selam Berhe Beyene',
      role: 'Founder',
      bio: 'PhD researcher in cement-sector decarbonisation at Universidad de Cantabria, developing low-carbon building materials.',
    },
    {
      name: 'Meron Gebreselassie Tadesse',
      role: 'Co-founder',
      bio: 'Brings expertise in project management.',
    },
  ],
}
