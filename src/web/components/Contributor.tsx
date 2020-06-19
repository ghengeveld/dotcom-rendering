import TwitterIcon from '@frontend/static/icons/twitter.svg';
import { BylineLink } from '@frontend/web/components/BylineLink';
import { neutral, text } from '@guardian/src-foundations/palette';
import { headline, textSans } from '@guardian/src-foundations/typography';
import { pillarPalette } from '@root/src/lib/pillars';
import { css } from 'emotion';
import React from 'react';

const twitterHandle = css`
    ${textSans.xsmall()};
    font-weight: bold;
    color: ${text.supporting};

    padding-right: 10px;
    display: inline-block;

    svg {
        height: 10px;
        max-width: 12px;
        margin-right: 0px;
        fill: ${neutral[46]};
    }

    a {
        color: ${text.supporting};
        text-decoration: none;
    }
`;

const bylineStyle = (pillar: Pillar) => css`
    ${headline.xxxsmall()};
    color: ${pillarPalette[pillar].main};
    padding-bottom: 8px;
    font-style: italic;

    a {
        font-weight: 700;
        color: ${pillarPalette[pillar].main};
        text-decoration: none;
        font-style: normal;
        :hover {
            text-decoration: underline;
        }
    }
`;

export const Contributor: React.FC<{
    designType: DesignType;
    author: AuthorType;
    tags: TagType[];
    pillar: Pillar;
}> = ({ designType, author, tags, pillar }) => {
    if (!author.byline) {
        return null;
    }

    const onlyOneContributor: boolean =
        tags.filter(tag => tag.type === 'Contributor').length === 1;

    return (
        <address
            aria-label="Contributor info"
            data-component="meta-byline"
            data-link-name="byline"
        >
            {designType !== 'Interview' && (
                <div className={bylineStyle(pillar)}>
                    <BylineLink byline={author.byline} tags={tags} />
                </div>
            )}
            {onlyOneContributor && author.twitterHandle && (
                <div className={twitterHandle}>
                    <TwitterIcon />
                    <a
                        href={`https://www.twitter.com/${author.twitterHandle}`}
                        aria-label={`@${author.twitterHandle} on Twitter`}
                    >
                        @{author.twitterHandle}
                    </a>
                </div>
            )}
        </address>
    );
};
