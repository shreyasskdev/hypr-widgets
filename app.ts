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
    const colors = readFile("./styles/colors.css");
    App.apply_css(colors);

    App.get_monitors().forEach((gdkmonitor) => {
      Bar(gdkmonitor);
      DesktopClock(gdkmonitor);
      ChargingAlert(gdkmonitor);
      NotificationPopups(gdkmonitor);
    });
  },
});

monitorFile(
  `${GLib.get_home_dir()}/.cache/wal/colors.css`,
  (file: string, event: Gio.FileMonitorEvent) => {
    const content = readFile(file);
    writeFile("./styles/colors.css", content);
    App.apply_css(content);
  },
);
