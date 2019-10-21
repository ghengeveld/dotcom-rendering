import React from 'react';
import { css, cx } from 'emotion';
import { until, desktop } from '@guardian/src-foundations';

const hideBelowDesktop = css`
    ${until.desktop} {
        /* below 980 */
        display: none;
    }

    ${desktop} {
        /* above 980 */
        display: block;
        flex-basis: 300px;
        flex-grow: 0;
        flex-shrink: 0;
    }
`;

const topPadding = css`
    padding-top: 6px;
`;

type Props = {
    children: JSX.Element | JSX.Element[];
};

export const ArticleRight = ({ children }: Props) => {
    return (
        <section className={cx(hideBelowDesktop, topPadding)}>
            {children}
        </section>
    );
};
