const { app, protocol, screen, BrowserWindow } = require('electron')
const path = require('path')

protocol.registerSchemesAsPrivileged([{
  scheme: 'http', 
  privileges: {
    secure: true,
  }
}]);

app.commandLine.appendSwitch('--no-sandbox');
app.commandLine.appendSwitch('--remote-debugging-port', '9222');

app.whenReady().then(async () => {
  let id = 0;
  for (const display of screen.getAllDisplays()/*.sort((a, b) => a.bounds.x - b.bounds.x)*/) {
    const win = new BrowserWindow({
      x: display.bounds.x,
      y: display.bounds.y,
      width: display.bounds.width,
      height: display.bounds.height,
      // kiosk: true,
      frame: false,
      show: false,
      backgroundColor: 'black',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    })

    win.webContents.on('did-finish-load', e => {
      win.webContents.executeJavaScript("window.withGesture && withGesture()", true);
    });

    win.loadFile(path.join(__dirname, 'static/index.html'), {
      query: { id, },
    }).then(async () => {
      setTimeout(() => {
        win.show();
        win.setKiosk(true);
      }, 100);
    });

    id++;
  }
});

