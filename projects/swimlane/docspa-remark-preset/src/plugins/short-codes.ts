import visit from 'unist-util-visit';
import MDAST from 'mdast';
import VFILE from 'vfile';
import UNIFIED from 'unified';

import { resolve } from 'url';

function join(start: string, end: string): string {
  if (start.length === 0) {
    return end;
  }
  if (end.length === 0) {
    return start;
  }
  let slashes = 0;
  if (start.endsWith('/')) {
    slashes++;
  }
  if (end.startsWith('/')) {
    slashes++;
  }
  if (slashes === 2) {
    return start + end.substring(1);
  }
  if (slashes === 1) {
    return start + end;
  }
  return start + '/' + end;
}

interface ShortCode extends MDAST.Parent {
  type: 'shortcode';
  identifier: string;
  attributes: { [key: string]: any };
}

interface VFile extends VFILE.VFile {
  data: {
    base?: string;
  };
}

/**
 * Convert [[toc]] smart-code to a TOC
 * Must be included after remark-shortcodes but before customSmartCodes
 */
export const tocSmartCode = (): UNIFIED.Transformer => {
  return (tree: MDAST.Root, file: VFile) => {
    file.data = file.data || {};
    return visit(tree, 'shortcode', (node: ShortCode) => {
      if (node.identifier === 'toc') {
        node.attributes.path = node.attributes.path || file.data.base;
      }
      return true;
    });
  };
};

export const customSmartCodes = (codes): UNIFIED.Transformer => {
  return (tree: MDAST.Root, file: VFile) => {
    file.data = file.data || {};
    return visit(tree, 'shortcode', (node: ShortCode, index, parent) => {
      if (node && parent && index !== undefined && node.identifier in codes) {
        const child = {
          type: 'element',
          ...codes[node.identifier]
        };
        child.properties = {...(child.properties || {}), ...(node.data ? node.data.hProperties : {}) };
        const newNode = {
          type: node.identifier,
          data: { hChildren: [child] }
        };
        parent.children.splice(index, 1, newNode);
      }
      return true;
    });
  };
};

export function shortCodeProps(): UNIFIED.Transformer {
  return (tree: MDAST.Root, file: VFile) => {
    file.data = file.data || {};
    return visit(tree, 'shortcode', (node: ShortCode) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties = { ...node.data.hProperties, ...node.attributes };
      return true;
    });
  };
}

export const customSmartCodesOptions = {
  toc: {
    tagName: 'md-toc'
  },
  var: {
    tagName: 'env-var'
  },
  stackblitz: {
    tagName: 'embed-stackblitz'
  }
};

export function includeShortCode(this: UNIFIED.Processor): UNIFIED.Transformer {
  const processor = this;
  return async (tree: MDAST.Root, file: VFile) => {
    file.data = file.data || {};
    const promises: any[] = [];
    visit(tree, 'shortcode', visitor);
    return await Promise.all(promises).then(() => tree);

    function visitor(node: ShortCode, index, parent) {
      if (node.identifier === 'include' && node.attributes.path) {
        const filePath = join(file.cwd, resolve(file.path as string, node.attributes.path));
        const p = fetch(filePath).then(res => res.text()).then(res => {
          let newNode: any;

          if (node.attributes.codeblock) {
            newNode = {
              type: 'code',
              data: node.data,
              value: res,
              lang: node.attributes.codeblock
            };
          } else {
            newNode = {
              type: 'embededBlock',
              data: node.data,
              children: processor.parse(res).children
            };
          }
          parent.children.splice(index, 1, newNode);
        });
        promises.push(p);
      }
      return true;
    }
  };
}