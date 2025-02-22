// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { HyperlinkDefinition } from 'views/content/content-page';

import { NamedSFC } from '../../../common/react/named-sfc';
import { HelpLinks, HelpLinksDeps } from './help-links';
import { helpHeading, overviewHelpContainer } from './overview-help-section.scss';

export type OverviewHelpSectionDeps = HelpLinksDeps;

export interface OverviewHelpSectionProps {
    deps: OverviewHelpSectionDeps;
    linkDataSource: HyperlinkDefinition[];
}

export const OverviewHelpSection = NamedSFC('OverviewHelpSection', (props: OverviewHelpSectionProps) => {
    return (
        <section className={overviewHelpContainer}>
            <h3 className={helpHeading}>Help</h3>
            <HelpLinks linkInformation={props.linkDataSource} deps={props.deps} />
        </section>
    );
});
