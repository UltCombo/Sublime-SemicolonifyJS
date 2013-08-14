# SemicolonifyJS

**Automatically semicolonifies your JS files upon save. (Sublime Text 2)**

Extremely useful for OCD-like JS coders that can't stand a missing semicolon but are also aware that their lives are too short to manually semicolonify code.

## How it works

//TODO .gif goes here

## Installation

Have Node, NPM and Git installed. You must also have Node in your `PATH`. Now go to ST's packages directory (`Preferences` > `Browse Packages...`), clone this repo and install the dependencies:

```
git clone https://github.com/UltCombo/Sublime-SemicolonifyJS.git SemicolonifyJS
cd SemicolonifyJS
npm install
```

Restart ST and you're all set.

## Notes

- Note that the plugin currently works on top of JSHint's "missing semicolon" warning, which is rather generic. For example, if you have `foo 1+1`, upon save you will get `foo; 1+1;`. You're expected to fix syntax errors such as this one before hitting <kbd>Ctrl</kbd>+<kbd>S</kbd>.

    A good way to watch for these is having [SublimeLinter](https://github.com/SublimeLinter/SublimeLinter) with background linting activated so you can check the possible errors before saving. In this case, I'd suggest setting the `"asi": true` JSHint option in the SublimeLinter user settings so that it won't report the missing semicolons which will be automatically handled by SemicolonifyJS.
    
    In future, I may add an option to disable semicolonification when more serious errors are found - need to define "serious" first (syntax errors and expected expressions most likely). Feel free to open an issue with suggestions or send a PR if you feel like.

- Saving may get very slow when working on HUGE files - that is because the whole file is tunnelled from Sublime to Node and analyzed by JSHint. I may add a maximum file size user setting in the future to avoid hanging on save. The ideal solution would be to analyze only the edited buffers, but I can't think of any sturdy logic that wouldn't end up sending incomplete code fragments for analysis. Feel free to open an issue/PR if you can handle this.

- Do not edit files with minified js inside. Obviously, that would usually end up adding unnecessary semicolons to your minified code, but it is more likely to simply crash the plugin. Either way, always keep minified code in a different file from non-minified code.

- Support is tested with UTF-8 encoded files only. Your `js` files should be saved with UTF-8 encoding anyway, there's hardly any reason to use another encoding and it is rather easy to convert to UTF-8. 

## WARNING

This plugin is currently in development and thus should be considered completely unstable. Use at your own risk.
