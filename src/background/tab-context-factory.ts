// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { NotificationCreator } from '../common/notification-creator';
import { PromiseFactory } from '../common/promises/promise-factory';
import { StateDispatcher } from '../common/state-dispatcher';
import { WindowUtils } from '../common/window-utils';
import { ActionCreator } from './actions/action-creator';
import { ActionHub } from './actions/action-hub';
import { ContentActionCreator } from './actions/content-action-creator';
import { DetailsViewActionCreator } from './actions/details-view-action-creator';
import { DevToolsActionCreator } from './actions/dev-tools-action-creator';
import { InspectActionCreator } from './actions/inspect-action-creator';
import { PathSnippetActionCreator } from './actions/path-snippet-action-creator';
import { ScopingPanelActionCreator } from './actions/scoping-panel-action-creator';
import { ShortcutsPageActionCreator } from './actions/shortcuts-page-action-creator';
import { TabActionCreator } from './actions/tab-action-creator';
import { UnifiedScanResultActionCreator } from './actions/unified-scan-result-action-creator';
import { AssessmentScanPolicyRunner } from './assessment-scan-policy-runner';
import { DetailsViewController } from './details-view-controller';
import { InjectorController } from './injector-controller';
import { ContentScriptInjector } from './injector/content-script-injector';
import { Interpreter } from './interpreter';
import { isAnAssessmentSelected } from './is-an-assessment-selected';
import { ScannerUtility } from './scanner-utility';
import { ShortcutsPageController } from './shortcuts-page-controller';
import { AssessmentStore } from './stores/assessment-store';
import { TabContextStoreHub } from './stores/tab-context-store-hub';
import { TabContext } from './tab-context';
import { TargetTabController } from './target-tab-controller';
import { TelemetryEventHandler } from './telemetry/telemetry-event-handler';

export class TabContextFactory {
    constructor(
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private telemetryEventHandler: TelemetryEventHandler,
        private windowUtils: WindowUtils,
        private targetTabController: TargetTabController,
        private assessmentStore: AssessmentStore,
        private assessmentsProvider: AssessmentsProvider,
        private readonly promiseFactory: PromiseFactory,
    ) {}

    public createTabContext(
        broadcastMessage: (message) => void,
        browserAdapter: BrowserAdapter,
        detailsViewController: DetailsViewController,
        tabId: number,
    ): TabContext {
        const interpreter = new Interpreter();
        const actionsHub = new ActionHub();
        const storeHub = new TabContextStoreHub(actionsHub, this.visualizationConfigurationFactory);
        const notificationCreator = new NotificationCreator(browserAdapter, this.visualizationConfigurationFactory);
        const shortcutsPageController = new ShortcutsPageController(browserAdapter);

        const shortcutsPageActionCreator = new ShortcutsPageActionCreator(interpreter, shortcutsPageController, this.telemetryEventHandler);

        const actionCreator = new ActionCreator(
            actionsHub,
            interpreter.registerTypeToPayloadCallback,
            detailsViewController,
            this.telemetryEventHandler,
            notificationCreator,
            this.visualizationConfigurationFactory,
            this.targetTabController,
        );

        const detailsViewActionCreator = new DetailsViewActionCreator(
            interpreter.registerTypeToPayloadCallback,
            actionsHub.detailsViewActions,
            detailsViewController,
            this.telemetryEventHandler,
        );

        const tabActionCreator = new TabActionCreator(
            interpreter.registerTypeToPayloadCallback,
            browserAdapter,
            this.telemetryEventHandler,
            actionsHub.tabActions,
        );

        const devToolsActionCreator = new DevToolsActionCreator(
            actionsHub.devToolActions,
            this.telemetryEventHandler,
            interpreter.registerTypeToPayloadCallback,
        );

        const inspectActionsCreator = new InspectActionCreator(
            actionsHub.inspectActions,
            this.telemetryEventHandler,
            browserAdapter,
            interpreter.registerTypeToPayloadCallback,
        );

        const pathSnippetActionCreator = new PathSnippetActionCreator(
            actionsHub.pathSnippetActions,
            interpreter.registerTypeToPayloadCallback,
        );

        const scanResultActionCreator = new UnifiedScanResultActionCreator(
            actionsHub.scanResultActions,
            interpreter.registerTypeToPayloadCallback,
        );

        const scopingPanelActionCreator = new ScopingPanelActionCreator(
            actionsHub.scopingActions,
            this.telemetryEventHandler,
            interpreter.registerTypeToPayloadCallback,
            detailsViewController,
        );

        const contentActionCreator = new ContentActionCreator(
            actionsHub.contentActions,
            this.telemetryEventHandler,
            interpreter.registerTypeToPayloadCallback,
            detailsViewController,
        );

        const injectorController = new InjectorController(
            new ContentScriptInjector(browserAdapter, this.promiseFactory),
            storeHub.visualizationStore,
            interpreter,
            storeHub.tabStore,
            storeHub.inspectStore,
        );

        const scannerUtility = new ScannerUtility(interpreter, this.windowUtils);
        const simpleSequentialScanner = new AssessmentScanPolicyRunner(
            this.assessmentStore,
            storeHub.visualizationStore,
            scannerUtility.executeScan,
            this.assessmentsProvider,
            isAnAssessmentSelected,
            tabId,
        );
        simpleSequentialScanner.beginListeningToStores();

        shortcutsPageActionCreator.registerCallbacks();
        actionCreator.registerCallbacks();
        detailsViewActionCreator.registerCallback();
        devToolsActionCreator.registerCallbacks();
        inspectActionsCreator.registerCallbacks();
        pathSnippetActionCreator.registerCallbacks();
        tabActionCreator.registerCallbacks();
        scopingPanelActionCreator.registerCallbacks();
        contentActionCreator.registerCallbacks();
        scanResultActionCreator.registerCallbacks();

        injectorController.initialize();
        const dispatcher = new StateDispatcher(broadcastMessage, storeHub);
        dispatcher.initialize();

        return new TabContext(interpreter, storeHub);
    }
}
