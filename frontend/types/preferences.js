export const DEFAULT_PREFERENCES = Object.freeze({
  autoHideTitle: true,
  autoHideRightMenu: true,
  autoHideEditorFormattingTool: false,
  spellcheckEnabled: true,
});

export class Preferences {
  constructor({
    autoHideTitle = DEFAULT_PREFERENCES.autoHideTitle,
    autoHideRightMenu = DEFAULT_PREFERENCES.autoHideRightMenu,
    autoHideEditorFormattingTool = DEFAULT_PREFERENCES.autoHideEditorFormattingTool,
    spellcheckEnabled = DEFAULT_PREFERENCES.spellcheckEnabled,
  } = {}) {
    this.autoHideTitle = Boolean(autoHideTitle);
    this.autoHideRightMenu = Boolean(autoHideRightMenu);
    this.autoHideEditorFormattingTool = Boolean(autoHideEditorFormattingTool);
    this.spellcheckEnabled = Boolean(spellcheckEnabled);
  }

  toJSON() {
    return {
      autoHideTitle: this.autoHideTitle,
      autoHideRightMenu: this.autoHideRightMenu,
      autoHideEditorFormattingTool: this.autoHideEditorFormattingTool,
      spellcheckEnabled: this.spellcheckEnabled,
    };
  }

  static from(data) {
    return new Preferences(data || {});
  }
}
