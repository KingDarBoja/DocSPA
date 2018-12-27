import visit from 'unist-util-visit';
import toString from 'mdast-util-to-string';
import MDAST from 'mdast';

export function readMatter() {
  return function transformer({children}, file) {
    if (children[0].type === 'yaml') {
      file.data.matter = children[0].data.parsedValue;
    }
  };
}

export const getTitle = () => {
  return (tree, file) => {
    file.data = file.data || {};
    return visit(tree, 'heading', (node: MDAST.Heading) => {
      if (node.depth === 1 && !file.data.title) {
        file.data.title = toString(node);
      }
      return true;
    });
  };
};
