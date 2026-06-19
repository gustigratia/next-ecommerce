import { render, screen } from '@testing-library/react';

import Container from '@/app/components/Container';

describe('Container', () => {
  it('renders children content correctly', () => {
    render(
      <Container>
        <p>Test child content</p>
      </Container>
    );

    expect(screen.getByText('Test child content')).toBeInTheDocument();
  });
});
