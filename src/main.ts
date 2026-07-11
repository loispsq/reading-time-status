import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface PluginSettings {
  greeting: string;
}

const DEFAULT_SETTINGS: PluginSettings = {
  greeting: 'Hello from Reading Time Status',
};

export default class ReadingTimeStatusPlugin extends Plugin {
  settings!: PluginSettings;

  async onload() {
    await this.loadSettings();

    // 一个演示命令 —— 换成你的真实功能。
    this.addCommand({
      id: 'say-hello',
      name: 'Say hello',
      callback: () => {
        // 用 Notice 而非 alert（alert 会阻塞 Obsidian）。
        new Notice(this.settings.greeting);
      },
    });

    this.addSettingTab(new SampleSettingTab(this.app, this));
  }

  onunload() {
    // 在这里 detach 你注册的所有 handler / 定时器（合规红线）。
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: ReadingTimeStatusPlugin;

  constructor(app: App, plugin: ReadingTimeStatusPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Greeting')
      .setDesc('The message shown by the "Say hello" command.')
      .addText((text) =>
        text
          .setPlaceholder('Enter a greeting')
          .setValue(this.plugin.settings.greeting)
          .onChange(async (value) => {
            this.plugin.settings.greeting = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
