import React from 'react';
import { css, cx } from 'emotion';
import { border } from '@guardian/src-foundations/palette';
import { between, until } from '@guardian/src-foundations/mq';
import { Contributor } from '@root/src/web/components/Contributor';
import { Avatar } from '@root/src/web/components/Avatar';

import { getSharingUrls } from '@root/src/lib/sharing-urls';
import { SharingIcons } from './ShareIcons';
import { Dateline } from './Dateline';

type Props = {
    display: Display;
    designType: DesignType;
    pillar: Pillar;
    pageId: string;
    webTitle: string;
    author: AuthorType;
    tags: TagType[];
    webPublicationDateDisplay: string;
};

const meta = css`
    ${between.tablet.and.leftCol} {
        order: 1;
    }

    ${until.phablet} {
        padding-left: 20px;
        padding-right: 20px;
    }
    padding-top: 8px;
`;

const metaFlex = css`
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const metaExtras = css`
    border-top: 1px solid ${border.secondary};
    flex-grow: 1;
    padding-top: 6px;

    ${until.phablet} {
        margin-left: -20px;
        margin-right: -20px;
        padding-left: 20px;
        padding-right: 20px;
    }
`;

const metaNumbers = css`
    border-top: 1px solid ${border.secondary};
    display: flex;
    flex-grow: 1;

    justify-content: flex-end;
    ${between.leftCol.and.wide} {
        justify-content: flex-start;
    }

    ${until.phablet} {
        margin-left: -20px;
        margin-right: -20px;
        padding-left: 20px;
        padding-right: 20px;
    }
`;

const metaContainer = css`
    ${until.phablet} {
        margin-left: -20px;
        margin-right: -20px;
    }
    ${until.mobileLandscape} {
        margin-left: -10px;
        margin-right: -10px;
    }
`;

const getBylineImageUrl = (tags: TagType[]) => {
    const contributorTag = tags.find(tag => tag.type === 'Contributor');
    return contributorTag && contributorTag.bylineImageUrl;
};

const getAuthorName = (tags: TagType[]) => {
    const contributorTag = tags.find(tag => tag.type === 'Contributor');
    return contributorTag && contributorTag.title;
};

const shouldShowAvatar = (designType: DesignType, display: Display) => {
    if (display === 'immersive') {
        return false;
    }

    switch (designType) {
        case 'Feature':
        case 'Review':
        case 'Recipe':
        case 'Interview':
            return true;
        case 'Live':
        case 'Media':
        case 'PhotoEssay':
        case 'Analysis':
        case 'Article':
        case 'SpecialReport':
        case 'MatchReport':
        case 'GuardianView':
        case 'GuardianLabs':
        case 'Quiz':
        case 'AdvertisementFeature':
        case 'Comment':
        case 'Immersive':
        default:
            return false;
    }
};

const shouldShowContributor = (designType: DesignType, display: Display) => {
    if (display === 'immersive') {
        return false;
    }

    switch (designType) {
        case 'Comment':
        case 'GuardianView':
            return false;
        case 'Feature':
        case 'Review':
        case 'Live':
        case 'Media':
        case 'PhotoEssay':
        case 'Interview':
        case 'Analysis':
        case 'Article':
        case 'SpecialReport':
        case 'Recipe':
        case 'MatchReport':
        case 'GuardianLabs':
        case 'Quiz':
        case 'AdvertisementFeature':
        case 'Immersive':
        default:
            return true;
    }
};

const AvatarContainer = ({
    children,
}: {
    children: JSX.Element | JSX.Element[];
}) => (
    <div
        className={css`
            width: 140px;
            height: 140px;
            margin-top: 6px;
            margin-right: 10px;
            margin-bottom: 12px;
            margin-left: 0px;

            ${until.leftCol} {
                width: 60px;
                height: 60px;
                margin-top: 3px;
                margin-right: 10px;
                margin-bottom: 12px;
                margin-left: 0px;
            }
        `}
    >
        {children}
    </div>
);

const RowBelowLeftCol = ({
    children,
}: {
    children: JSX.Element | JSX.Element[];
}) => (
    <div
        className={css`
            display: flex;
            flex-direction: column;

            ${until.leftCol} {
                flex-direction: row;
            }
        `}
    >
        {children}
    </div>
);

export const ArticleMeta = ({
    display,
    designType,
    pillar,
    pageId,
    webTitle,
    author,
    tags,
    webPublicationDateDisplay,
}: Props) => {
    const sharingUrls = getSharingUrls(pageId, webTitle);
    const bylineImageUrl = getBylineImageUrl(tags);
    const authorName = getAuthorName(tags);

    const onlyOneContributor: boolean =
        tags.filter(tag => tag.type === 'Contributor').length === 1;

    const showAvatar =
        onlyOneContributor && shouldShowAvatar(designType, display);

    return (
        <div className={metaContainer}>
            <div className={cx(meta)}>
                <RowBelowLeftCol>
                    <>
                        {showAvatar && bylineImageUrl && (
                            <AvatarContainer>
                                <Avatar
                                    imageSrc={bylineImageUrl}
                                    imageAlt={authorName || 'Author image'}
                                    pillar={pillar}
                                />
                            </AvatarContainer>
                        )}
                        <div>
                            {shouldShowContributor(designType, display) && (
                                <Contributor
                                    designType={designType}
                                    author={author}
                                    tags={tags}
                                    pillar={pillar}
                                />
                            )}
                            <Dateline
                                dateDisplay={webPublicationDateDisplay}
                                descriptionText="Published on"
                            />
                        </div>
                    </>
                </RowBelowLeftCol>
                <div className={metaFlex}>
                    <div className={metaExtras}>
                        <SharingIcons
                            sharingUrls={sharingUrls}
                            pillar={pillar}
                            displayIcons={['facebook', 'twitter', 'email']}
                        />
                    </div>
                    <div className={metaNumbers}>
                        <div id="share-comment-counts" />
                    </div>
                </div>
            </div>
        </div>
    );
};
