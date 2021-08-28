import { Notice, addIcon, setIcon, Plugin } from "obsidian";

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: "default",
};

const icons: Record<string, string> = {
  yinyang: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="0" stroke-linecap="round" stroke-linejoin="round"><path d="M19.062 4.938A9.942 9.942 0 0 0 12.016 2h-.026a9.94 9.94 0 0 0-7.071 2.938c-3.898 3.898-3.898 10.243 0 14.143c1.895 1.895 4.405 2.938 7.071 2.938s5.177-1.043 7.071-2.938c3.9-3.899 3.9-10.243.001-14.143zM13.5 15a1.5 1.5 0 1 1-.001 3.001A1.5 1.5 0 0 1 13.5 15zM6.333 6.353A7.953 7.953 0 0 1 11.99 4l.026.001c1.652.008 3.242 1.066 3.55 2.371c.366 1.552-1.098 3.278-4.018 4.737c-5.113 2.555-5.312 5.333-4.975 6.762l.008.021c-.082-.075-.169-.146-.249-.226c-3.118-3.119-3.118-8.194.001-11.313z" fill="currentColor"/><circle cx="10.5" cy="7.5" r="1.5" fill="currentColor"/></svg>`,
};

function addIcons() {
  Object.keys(icons).forEach((key) => {
    addIcon(key, icons[key]);
  });
}

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;
  statusBarIcon: HTMLElement;

  async onload() {
    console.log("LightMode DarkMode v" + this.manifest.version + " loaded");
    addIcons();
    await this.loadSettings();
    this.app.workspace.onLayoutReady(() => {
      setTimeout(() => {
        this.setupStatusBar();
      });
    });
  }

  setupStatusBar() {
    this.statusBarIcon = this.addStatusBarItem();
    this.statusBarIcon.addClass("LD-statusbar-button");
    setIcon(this.statusBarIcon, "yinyang");

    this.registerDomEvent(this.statusBarIcon, "click", () => {
      //@ts-ignore
      this.app.getTheme() === "obsidian"
        ? //@ts-ignore
          this.app.commands.executeCommandById("theme:use-light") +
          new Notice("☀️")
        : //@ts-ignore
          this.app.commands.executeCommandById("theme:use-dark") +
          new Notice("🌑");
    });
  }

  onunload() {
    console.log("LightMode DarkMode unloaded");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
