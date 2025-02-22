// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import * as React from 'react';

import { NamedSFC } from '../../../common/react/named-sfc';
import { instanceListRowContent, label, row } from '../../../reports/components/instance-details.scss';

export interface SimpleCardRowProps {
    label: string;
    content: string | JSX.Element;
    rowKey: string;
    contentClassName?: string;
}

export const SimpleCardRow = NamedSFC<SimpleCardRowProps>('SimpleCardRow', ({ label: givenLabel, content, rowKey, contentClassName }) => {
    const contentStyling = css(instanceListRowContent, contentClassName);

    return (
        <tr className={row} key={rowKey}>
            <th className={label}>{givenLabel}</th>
            <td className={contentStyling}>{content}</td>
        </tr>
    );
});
