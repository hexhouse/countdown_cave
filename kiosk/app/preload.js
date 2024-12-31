const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('SS', {
  hostname: process.env.SS_HOSTNAME,
  role: process.env.SS_ROLE,
  underscan_h: process.env.SS_UNDERSCAN_H,
  underscan_v: process.env.SS_UNDERSCAN_V,
});
