// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';
import { DetailsListIssuesView, DetailsListIssuesViewDeps, DetailsListIssuesViewProps } from './details-list-issues-view';
import { TargetPageChangedView } from './target-page-changed-view';

export type AdhocIssuesTestViewDeps = DetailsListIssuesViewDeps;

export type AdhocIssuesTestViewProps = DetailsListIssuesViewProps;

export const AdhocIssuesTestView = NamedSFC<AdhocIssuesTestViewProps>('AdhocIssuesTestView', ({ children, ...props }) => {
    if (props.tabStoreData.isChanged) {
        return createTargetPageChangedView(props);
    }

    return <DetailsListIssuesView {...props} />;
});

function createTargetPageChangedView(props: AdhocIssuesTestViewProps): JSX.Element {
    const selectedTest = props.selectedTest;
    const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
    const clickHandler = props.clickHandlerFactory.createClickHandler(selectedTest, !scanData.enabled);

    return (
        <TargetPageChangedView
            displayableData={props.configuration.displayableData}
            visualizationType={selectedTest}
            toggleClickHandler={clickHandler}
        />
    );
}
