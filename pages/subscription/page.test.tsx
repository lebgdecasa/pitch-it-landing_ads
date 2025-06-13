import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubscriptionPage from './page'; // The component to test
import { useAuthContext } from '@/supa_database/components/AuthProvider';

// --- Mocks ---

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    pathname: '/subscription',
    route: '/subscription',
    asPath: '/subscription',
    query: '',
  })),
}));

// Mock useAuthContext
jest.mock('@/supa_database/components/AuthProvider', () => ({
  useAuthContext: jest.fn(),
}));

// Helper to set the mock user for useAuthContext
const mockSetUser = (user: any) => {
  (useAuthContext as jest.Mock).mockReturnValue({
    user,
    loading: false,
    // Add other properties/functions if your component uses them
    // e.g., signIn: jest.fn(), signOut: jest.fn(), etc.
  });
};

describe('SubscriptionPage', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    // Setup alert spy before each test
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    // Default mock user for tests that need an authenticated user but don't care about the plan initially
    mockSetUser({ id: 'test-user', email: 'test@example.com', plan: 'free' });
  });

  afterEach(() => {
    // Restore alert spy after each test
    alertSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('renders the main heading', () => {
      render(<SubscriptionPage />);
      expect(screen.getByRole('heading', { name: /Choose Your Plan/i })).toBeInTheDocument();
    });

    it('renders all three plan cards with names and prices', () => {
      render(<SubscriptionPage />);
      // Free Plan
      expect(screen.getByText('Free')).toBeInTheDocument();
      expect(screen.getByText('$0')).toBeInTheDocument();
      expect(screen.getByText(/3 projects per user/i)).toBeInTheDocument();

      // Premium Plan
      expect(screen.getByText('Premium')).toBeInTheDocument();
      expect(screen.getByText('$40')).toBeInTheDocument();
      expect(screen.getByText(/5 projects per user/i)).toBeInTheDocument();

      // Investor/VC Plan
      expect(screen.getByText('Investor/VC')).toBeInTheDocument();
      // Price is a <p> tag, Button is a <button> tag
      expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'p' && content === 'Contact Us')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Contact Us/i})).toBeInTheDocument();
      expect(screen.getByText(/Unlimited project creation/i)).toBeInTheDocument();
    });
  });

  describe('Pop-up Functionality', () => {
    it('Premium plan button shows pop-up with correct message', async () => {
      mockSetUser({ id: 'test-user', email: 'test@example.com', plan: 'free' });
      render(<SubscriptionPage />);

      fireEvent.click(screen.getByRole('button', { name: /Upgrade to Premium/i }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Premium Plan Update/i })).toBeInTheDocument();
      });
      expect(screen.getByText(/You can't upgrade right now as this is a beta version/i)).toBeInTheDocument();

      // Close modal
      fireEvent.click(screen.getByRole('button', { name: /Close/i }));
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: /Premium Plan Update/i })).not.toBeInTheDocument();
      });
    });

    it('Investor/VC plan button shows pop-up with correct message', async () => {
      mockSetUser({ id: 'test-user', email: 'test@example.com', plan: 'free' });
      render(<SubscriptionPage />);

      fireEvent.click(screen.getByRole('button', { name: /Contact Us/i }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Investor\/VC Plan Update/i })).toBeInTheDocument();
      });
      expect(screen.getByText(/You can't upgrade right now as this is a beta version/i)).toBeInTheDocument();

      // Close modal
      fireEvent.click(screen.getByRole('button', { name: /Close/i }));
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: /Investor\/VC Plan Update/i })).not.toBeInTheDocument();
      });
    });
  });

  describe('Free Plan Button Logic', () => {
    it('"Switch to Free" button works correctly (button text is "Select Plan")', () => {
      mockSetUser({ id: 'test-user', email: 'test@example.com', plan: 'premium' });
      render(<SubscriptionPage />);

      const freePlanButton = screen.getByRole('button', { name: /Select Plan/i }); // Corrected name
      expect(freePlanButton).toBeInTheDocument();
      expect(freePlanButton).not.toBeDisabled();

      fireEvent.click(freePlanButton);

      expect(alertSpy).toHaveBeenCalledWith('You have selected the Free Plan.');
      // After click, button should become "Current Plan" and be disabled
      const currentPlanButton = screen.getByRole('button', { name: /Current Plan/i });
      expect(currentPlanButton).toBeInTheDocument();
      expect(currentPlanButton).toBeDisabled();
      expect(screen.queryByRole('button', { name: /Select Plan/i })).not.toBeInTheDocument();
    });

    it('"Current Plan" button is disabled and shows correct text', () => {
      mockSetUser({ id: 'test-user', email: 'test@example.com', plan: 'free' });
      render(<SubscriptionPage />);

      const freePlanButton = screen.getByRole('button', { name: /Current Plan/i });
      expect(freePlanButton).toBeInTheDocument();
      expect(freePlanButton).toBeDisabled(); // Key assertion: button is disabled

      fireEvent.click(freePlanButton); // Click should not trigger alert if disabled

      expect(alertSpy).not.toHaveBeenCalledWith('This is your current plan.'); // Alert should not be called
      // Text remains "Current Plan"
      expect(screen.getByRole('button', { name: /Current Plan/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Select Plan/i })).not.toBeInTheDocument();
    });
  });

  // Test for unauthenticated user (optional, but good practice)
  describe('Unauthenticated User', () => {
    it('shows login prompt if user is not authenticated', () => {
      mockSetUser(null); // Simulate unauthenticated user
      render(<SubscriptionPage />);

      // The component currently doesn't explicitly handle the case where `user` is null
      // *within the main return* for the plans, but rather in the AuthProvider or a higher level.
      // The subscription page itself, when user is null, will show the "Choose Your Plan"
      // and the plans. The optional login prompt is at the bottom.
      // Let's verify the "Log In or Sign Up" button from the optional section appears.
      expect(screen.getByRole('link', { name: /Log In or Sign Up/i })).toBeInTheDocument();
      // And the plans should still be visible
      expect(screen.getByText('Free')).toBeInTheDocument();
      expect(screen.getByText('Premium')).toBeInTheDocument();
      expect(screen.getByText('Investor/VC')).toBeInTheDocument();
    });
  });
});
