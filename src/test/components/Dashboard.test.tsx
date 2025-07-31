import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../utils'
import { mockTeamMetrics } from '../utils'
import Dashboard from '../../pages/Dashboard'

// Mock the API
vi.mock('@/lib/mockApi', () => ({
  MockLabfoxAPI: {
    getTeamHealth: vi.fn().mockResolvedValue({
      success: true,
      data: mockTeamMetrics
    }),
    getInsights: vi.fn().mockResolvedValue({
      success: true,
      data: []
    }),
    getRecommendations: vi.fn().mockResolvedValue({
      success: true,
      data: []
    })
  },
  fallbackData: {
    teamHealth: mockTeamMetrics
  },
  errorMessages: {
    API_ERROR: 'API Error'
  }
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn()
  }
})

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dashboard header', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByAltText('Kayla Logo')).toBeInTheDocument()
      expect(screen.getByText('JD')).toBeInTheDocument() // Avatar fallback
    })
  })

  it('renders dashboard sections', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      // Check for main dashboard sections
      expect(screen.getByText(/weekly podcast/i)).toBeInTheDocument()
      expect(screen.getByText(/insights/i)).toBeInTheDocument()
      expect(screen.getByText(/recommendations/i)).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    render(<Dashboard />)
    
    // The component should show loading indicators while fetching data
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays team health metrics when loaded', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/team health/i)).toBeInTheDocument()
      expect(screen.getByText(/85%/)).toBeInTheDocument() // Overall health
    })
  })
}) 