import { App } from "astal/gtk4";
import style from "./style.scss";
import Bar from "./widget/Bar/Bar";
import DesktopClock from "./widget/DesktopClock";
import ChargingAlert from "./widget/ChargingAlert";
import NotificationPopups from "./widget/Notification/NotificationPopup";
import { monitorFile, readFile, writeFile } from "astal";
import Gio from "gi://Gio";
import GLib from "gi://GLib";

App.start({
  css: style,
  main() {
    loadApplyAndWriteCss();

    App.get_monitors().forEach((gdkmonitor) => {
      Bar(gdkmonitor);
      DesktopClock(gdkmonitor);
      ChargingAlert(gdkmonitor);
      NotificationPopups(gdkmonitor);
    });
  },
});

function loadApplyAndWriteCss() {
  const colors = readFile(`${GLib.get_home_dir()}/.cache/wal/colors.css`);
  App.apply_css(colors);
  writeFile("./styles/colors.css", colors);
}

monitorFile(
  `${GLib.get_home_dir()}/.cache/wal/colors.css`,
  (file: string, event: Gio.FileMonitorEvent) => {
    loadApplyAndWriteCss();
  },
);
