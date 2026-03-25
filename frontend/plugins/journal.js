import { Node } from '@tiptap/core';

export const Journal = Node.create({
  name: 'journal',
  group: 'block',
  content: 'inline*',
  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      time: {
        default: null,
        parseHTML: element => element.getAttribute('data-journal-time'),
        renderHTML: attributes => ({
          'data-journal-time': attributes.time,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'p[data-journal-time]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setJournal:
        () =>
        ({ commands }) => {
          const time = new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          });

          return commands.insertContent({
            type: this.name,
            attrs: { time },
            content: [
              {
                type: 'text',
                text: time,
              },
            ],
          });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-j': () => this.editor.commands.toggleJournal(),
    };
  },
});
