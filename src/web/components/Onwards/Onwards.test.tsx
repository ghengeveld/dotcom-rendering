import React from 'react';
import { render } from '@testing-library/react';
import { linkAndDescription } from '@root/fixtures/onwards.mocks';
import { useApi as useApi_ } from '@root/src/web/lib/api';
import { OnwardsLayout } from './OnwardsLayout';

const response = { data: linkAndDescription };
const useApi: any = useApi_;

jest.mock('@root/src/web/lib/api', () => ({
    useApi: jest.fn(),
}));

describe('OnwardsLayout', () => {
    beforeEach(() => {
        useApi.mockReset();
    });
    it('Render Ophan Data Components as expected', () => {
        useApi.mockReturnValue(response);

        const { asFragment } = render(
            <OnwardsLayout onwardSections={[linkAndDescription]} />,
        );

        // Renders data-component
        expect(
            asFragment().querySelectorAll(
                '[data-component="more-on-this-story"]',
            ).length,
        ).toBe(1);

        expect(
            asFragment().querySelectorAll(
                '[data-link-name="more-on-this-story"]',
            ).length,
        ).toBe(1);

        expect(
            asFragment().querySelectorAll('[data-link-name="article"]').length,
        ).toBe(8);
    });
});
