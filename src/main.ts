import {
  MarkdownView,
  Plugin,
  PluginSettingTab,
  Setting,
  debounce,
  type Debouncer,
} from 'obsidian';

interface ReadingTimeSettings {
  wordsPerMinute: number;
  showWordCount: boolean;
}

const DEFAULT_SETTINGS: ReadingTimeSettings = {
  wordsPerMinute: 200,
  // 默认只显示阅读时长；字数交给 Obsidian 自带的字数统计，避免重复。
  showWordCount: false,
};

// CJK-aware 字数统计：中日韩每字算一词，其余按空白切分。
export function countWords(text: string): number {
  if (!text) return 0;
  const cjkRe = /[一-鿿぀-ヿ가-힯]/g;
  const cjk = (text.match(cjkRe) || []).length;
  const rest = text.replace(cjkRe, ' ').trim();
  const words = rest ? rest.split(/\s+/).length : 0;
  return cjk + words;
}

export default class ReadingTimeStatusPlugin extends Plugin {
  settings!: ReadingTimeSettings;
  private statusBarEl!: HTMLElement;
  private scheduleUpdate!: Debouncer<[], void>;

  async onload() {
    await this.loadSettings();

    this.statusBarEl = this.addStatusBarItem();
    this.statusBarEl.addClass('reading-time-status');

    // 编辑时高频触发，去抖 400ms。
    this.scheduleUpdate = debounce(() => this.update(), 400, false);

    // registerEvent 会在 unload 时自动解绑（合规：不留悬挂 handler）。
    this.registerEvent(
      this.app.workspace.on('active-leaf-change', () => this.update())
    );
    this.registerEvent(
      this.app.workspace.on('editor-change', () => this.scheduleUpdate())
    );

    this.addSettingTab(new ReadingTimeSettingTab(this));

    // 首次渲染（布局就绪后）。
    this.app.workspace.onLayoutReady(() => this.update());
  }

  onunload() {
    // status bar item 由 Obsidian 随插件卸载自动移除；事件已用 registerEvent 托管。
  }

  private update() {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) {
      this.statusBarEl.setText('');
      return;
    }

    const words = countWords(view.editor.getValue());
    const wpm = Math.max(1, this.settings.wordsPerMinute);
    const minutes = Math.max(1, Math.ceil(words / wpm));

    const parts: string[] = [];
    if (this.settings.showWordCount) parts.push(`${words} words`);
    parts.push(`~${minutes} min`);
    this.statusBarEl.setText(parts.join(' · '));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.update();
  }
}

class ReadingTimeSettingTab extends PluginSettingTab {
  constructor(private plugin: ReadingTimeStatusPlugin) {
    super(plugin.app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Reading speed')
      .setDesc('Words per minute used to estimate reading time.')
      .addText((text) =>
        text
          .setPlaceholder('200')
          .setValue(String(this.plugin.settings.wordsPerMinute))
          .onChange(async (value) => {
            const n = Number(value);
            if (Number.isFinite(n) && n > 0) {
              this.plugin.settings.wordsPerMinute = Math.round(n);
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName('Show word count')
      .setDesc('Also show the word count next to the reading time.')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showWordCount)
          .onChange(async (value) => {
            this.plugin.settings.showWordCount = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
