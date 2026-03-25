import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

export const PagePluginKey = new PluginKey('page-plugin');

export const Pages = Extension.create({
  name: 'pages',

  addOptions() {
    return {
      pageHeight: 1123,
      pageWidth: 794,
      margin: 96,
      onPageChange: () => {},
    };
  },

  addProseMirrorPlugins() {
    const { pageHeight, onPageChange } = this.options;

    return [
      new Plugin({
        key: PagePluginKey,

        view(editorView) {
          const container = editorView.dom;
          let isLayouting = false;

          const layoutPages = () => {
            if (isLayouting) return;
            isLayouting = true;

            const pages = [];
            let currentPage = createPage();
            pages.push(currentPage);

            const nodes = Array.from(container.children);

            nodes.forEach(node => {
              const clone = node.cloneNode(true);
              currentPage.content.appendChild(clone);

              if (currentPage.content.scrollHeight > pageHeight) {
                currentPage.content.removeChild(clone);

                currentPage = createPage();
                currentPage.content.appendChild(clone);
                pages.push(currentPage);
              }
            });

            container.replaceChildren(...pages.map(p => p.page));
            onPageChange(pages.length);

            isLayouting = false;
          };

          return {
            update(view, prevState) {
              // ✅ only re-layout on document change
              if (view.state.doc !== prevState.doc) {
                requestAnimationFrame(layoutPages);
              }
            },
          };
        },
      }),
    ];
  },
});

function createPage() {
  const page = document.createElement('div');
  page.className = 'editor-page';
  page.dataset.page = 'true';
  const header = document.createElement('div');
  header.className = 'editor-page-header';
  const content = document.createElement('div');
  content.className = 'editor-page-content';
  const footer = document.createElement('div');
  footer.className = 'editor-page-footer';
  page.append(header, content, footer);
  return { page, content, header, footer };
}
