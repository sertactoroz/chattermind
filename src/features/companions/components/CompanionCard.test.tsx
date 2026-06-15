import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import CompanionCard from './CompanionCard';

vi.mock('next/image', () => ({
  default: ({ fill: _fill, alt = '', ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  ),
}));

describe('CompanionCard', () => {
  it('uses database fields for user companions without reporting missing translations', () => {
    const onError = vi.fn();

    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          Companions: {},
          CompanionCard: { fallbackRole: 'Companion' },
        }}
        onError={onError}
      >
        <CompanionCard
          companion={{
            id: 'user_d5fe58f9_75305726',
            name: 'My Companion',
            role: 'Personal mentor',
            description: 'Description stored in the database',
            promptKey: 'USER_PROMPT',
          }}
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Personal mentor')).toBeInTheDocument();
    expect(screen.getByText('Description stored in the database')).toBeInTheDocument();
    expect(onError).not.toHaveBeenCalled();
  });
});
