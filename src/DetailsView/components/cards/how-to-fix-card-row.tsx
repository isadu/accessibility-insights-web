// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { CardRowProps } from '../../../common/configs/unified-result-property-configurations';
import { NamedSFC } from '../../../common/react/named-sfc';
import { CheckType } from '../../../injected/components/details-dialog';
import { FixInstructionPanel } from '../../../injected/components/fix-instruction-panel';
import { howToFixContent } from './how-to-fix-card-row.scss';
import { SimpleCardRow } from './simple-card-row';

export interface HowToFixWebPropertyData {
    // tslint:disable-next-line: no-reserved-keywords
    any: string[];
    none: string[];
    all: string[];
}

export interface HowToFixWebCardRowProps extends CardRowProps {
    propertyData: HowToFixWebPropertyData;
}

export const HowToFixWebCardRow = NamedSFC<HowToFixWebCardRowProps>('HowToFixWebCardRow', ({ deps, ...props }) => {
    const { any: anyOf, all, none } = props.propertyData;

    const renderFixInstructionsContent = () => {
        return (
            <div className={howToFixContent}>
                <FixInstructionPanel
                    deps={deps}
                    checkType={CheckType.All}
                    checks={all.concat(none).map(turnStringToMessageObject)}
                    renderTitleElement={renderFixInstructionsTitleElement}
                />
                <FixInstructionPanel
                    deps={deps}
                    checkType={CheckType.Any}
                    checks={anyOf.map(turnStringToMessageObject)}
                    renderTitleElement={renderFixInstructionsTitleElement}
                />
            </div>
        );
    };

    const turnStringToMessageObject = (s: string) => {
        return { message: s };
    };

    const renderFixInstructionsTitleElement = (titleText: string, className: string) => {
        return <div className={className}>{titleText}</div>;
    };

    return <SimpleCardRow label="How to fix" content={renderFixInstructionsContent()} rowKey={`how-to-fix-row-${props.index}`} />;
});
