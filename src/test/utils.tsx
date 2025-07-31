import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Test data helpers
export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
}

export const mockTeamMetrics = {
  overallHealth: 85,
  communication: 90,
  collaboration: 88,
  productivity: 82,
  morale: 87,
  trends: {
    weekly: [80, 82, 85, 87, 88, 90, 85],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
}

export const mockPodcastData = {
  title: "Weekly Team Insights",
  duration: "15:30",
  url: "https://example.com/podcast.mp3",
  transcript: "This week we discussed team collaboration...",
  insights: [
    "Improved communication patterns",
    "Higher engagement in meetings",
    "Better cross-team collaboration"
  ]
}

export const mockRecommendations = [
  {
    id: '1',
    title: 'Schedule more 1:1 meetings',
    description: 'Team members report feeling more connected after individual check-ins',
    priority: 'high',
    category: 'communication'
  },
  {
    id: '2',
    title: 'Implement async communication',
    description: 'Reduce meeting fatigue by using async communication tools',
    priority: 'medium',
    category: 'productivity'
  }
] 