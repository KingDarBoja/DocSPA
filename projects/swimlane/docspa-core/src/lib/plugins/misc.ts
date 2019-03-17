export { infoString, infoStringToAttr } from '@swimlane/docspa-remark-preset/dist/module/plugins/misc';
import { customBlocksOptions } from '@swimlane/docspa-remark-preset/dist/module/plugins/remark-custom-blocks';

import remarkCustomBlocks from 'remark-custom-blocks';

export const customBlocks = [remarkCustomBlocks, customBlocksOptions];

// TODO: remove experimental features from core
export function tabsHook(hook: any) {
  const toggleState = function(tabs: any[]) {
    tabs.forEach((tab: any) => {
      const state = this === tab ? 'open' : 'closed';
      tab = tab.closest('.tab');
      tab.setAttribute('data-state', state);
    });
  };

  hook.doneEach(() => {
    [].slice.call(document.querySelectorAll('.tabs')).forEach((tabSet: any) => {
      const tabs: any[] = [].slice.call(tabSet.querySelectorAll('.tabs .tab .custom-block-heading'));
      tabs.forEach((tab, i) => {
        const state = i === 0 ? 'open' : 'closed';
        tab.closest('.tab').setAttribute('data-state', state);
        tab.addEventListener('click', toggleState.bind(tab, tabs), false);
      });
    });
  });
}
