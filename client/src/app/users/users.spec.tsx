import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Users from './users';

describe('Tickets', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowserRouter><Users /></BrowserRouter>);
    expect(baseElement).toBeTruthy();
  });
});
