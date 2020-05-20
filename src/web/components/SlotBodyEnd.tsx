import React, { useEffect, useState, useRef } from 'react';
import { css } from 'emotion';
import {
    getBodyEnd,
    getViewLog,
    logView,
    getWeeklyArticleHistory,
} from '@guardian/automat-client';
import {
    shouldShowSupportMessaging,
    isRecurringContributor,
    getLastOneOffContributionDate,
} from '@root/src/web/lib/contributions';
import { getCookie } from '../browser/cookie';
import { useHasBeenSeen } from '../lib/useHasBeenSeen';

type HasBeenSeen = [boolean, (el: HTMLDivElement) => void];

const checkForErrors = (response: any) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
};

type OphanAction = 'INSERT' | 'VIEW';

type TestMeta = {
    abTestName: string;
    abTestVariant: string;
    campaignCode: string;
    campaignId: string;
};

const sendOphanEpicEvent = (action: OphanAction, testMeta: TestMeta): void => {
    const componentEvent = {
        component: {
            componentType: 'ACQUISITIONS_EPIC',
            products: ['CONTRIBUTION', 'MEMBERSHIP_SUPPORTER'],
            campaignCode: testMeta.campaignCode,
            id: testMeta.campaignId,
        },
        abTest: {
            name: testMeta.abTestName,
            variant: testMeta.abTestVariant,
        },
        action,
    };

    window.guardian.ophan.record({ componentEvent });
};

const sendOphanReminderEvent = (componentId: string): void => {
    const componentEvent = {
        component: {
            componentType: 'ACQUISITIONS_OTHER',
            id: componentId,
        },
        action: 'CLICK',
    };

    window.guardian.ophan.record({ componentEvent });
};

const wrapperMargins = css`
    margin: 18px 0;
`;

type Props = {
    isSignedIn?: boolean;
    countryCode?: string;
    contentType: string;
    sectionName?: string;
    shouldHideReaderRevenue: boolean;
    isMinuteArticle: boolean;
    isPaidContent: boolean;
    isSensitive: boolean;
    tags: TagType[];
    contributionsServiceUrl: string;
};

// TODO specify return type (need to update client to provide this first)
const buildPayload = (props: Props) => {
    return {
        tracking: {
            ophanPageId: window.guardian.config.ophan.pageViewId,
            ophanComponentId: 'ACQUISITIONS_EPIC',
            platformId: 'GUARDIAN_WEB',
            clientName: 'dcr',
            referrerUrl: window.location.origin + window.location.pathname,
        },
        targeting: {
            contentType: props.contentType,
            sectionName: props.sectionName || '', // TODO update client to reflect that this is optional
            shouldHideReaderRevenue: props.shouldHideReaderRevenue,
            isMinuteArticle: props.isMinuteArticle,
            isPaidContent: props.isPaidContent,
            isSensitive: props.isSensitive,
            tags: props.tags,
            showSupportMessaging: shouldShowSupportMessaging(),
            isRecurringContributor: isRecurringContributor(
                props.isSignedIn || false,
            ),
            lastOneOffContributionDate: getLastOneOffContributionDate(),
            epicViewLog: getViewLog(),
            weeklyArticleHistory: getWeeklyArticleHistory(),
            mvtId: Number(getCookie('GU_mvt_id')),
            countryCode: props.countryCode,
        },
    };
};

/* type SlotState = {
    html: string;
    css: string;
    js: string;
    meta: TestMeta;
}; */

const MemoisedInner = ({
    isSignedIn,
    countryCode,
    contentType,
    sectionName,
    shouldHideReaderRevenue,
    isMinuteArticle,
    isPaidContent,
    isSensitive,
    tags,
    contributionsServiceUrl,
}: Props) => {
    const [component, setComponent] = useState<Element>();

    // Debounce the IntersectionObserver callback
    // to ensure the Slot is seen for at least 200ms before registering the view
    const debounce = true;
    const [hasBeenSeen, setNode] = useHasBeenSeen(
        {
            rootMargin: '-18px',
            threshold: 0,
        },
        debounce,
    ) as HasBeenSeen;

    useEffect(() => {
        // fetch Count component
        const count = import(
            /* webpackIgnore: true */ 'http://localhost:3030/count.js'
        );
        count
            .then(module => {
                setComponent(module.component(React));
            })
            .catch(error => console.log('count - error is: ' + error));
    });

    // Note would want to return meta as part of the JS module?
    /*     useEffect(() => {
        // This won't be true until we've successfully fetched the data and
        // rendered the epic (because of how we're wiring up the ref below). And
        // because of the way the hook behaves, it'll only ever go from false ->
        // true once.
        if (hasBeenSeen) {
            const meta = data?.slot?.meta;

            if (meta) {
                // Add a new entry to the view log when we know an Epic is viewed
                logView(meta.abTestName);
                sendOphanEpicEvent('VIEW', meta);
            }
        }
    // The 'data' object used in the hook never changes after 'hasBeenSeen'
    // is set to true, so we're intentionally leaving it out of the deps array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasBeenSeen]); */

    if (component) {
        return (
            <div ref={setNode} className={wrapperMargins}>
                {component}
            </div>
        );
    }

    return null;
};

export const SlotBodyEnd = ({
    isSignedIn,
    countryCode,
    contentType,
    sectionName,
    shouldHideReaderRevenue,
    isMinuteArticle,
    isPaidContent,
    isSensitive,
    tags,
    contributionsServiceUrl,
}: Props) => {
    if (isSignedIn === undefined || countryCode === undefined) {
        return null;
    }

    // Memoised as we only ever want to call the Slots API once, for simplicity
    // and performance reasons.
    return (
        <MemoisedInner
            isSignedIn={isSignedIn}
            countryCode={countryCode}
            contentType={contentType}
            sectionName={sectionName}
            shouldHideReaderRevenue={shouldHideReaderRevenue}
            isMinuteArticle={isMinuteArticle}
            isPaidContent={isPaidContent}
            isSensitive={isSensitive}
            tags={tags}
            contributionsServiceUrl={contributionsServiceUrl}
        />
    );
};
