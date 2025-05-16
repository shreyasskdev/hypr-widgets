import { App } from "astal/gtk4";
import style from "./style.scss";
import Bar from "./widget/Bar/Bar";
import DesktopClock from "./widget/DesktopClock";
import ChargingAlert from "./widget/ChargingAlert";
import NotificationPopups from "./widget/Notification/NotificationPopup";

App.start({
  css: style,
  main() {
    App.get_monitors().forEach((gdkmonitor) => {
      Bar(gdkmonitor);
      DesktopClock(gdkmonitor);
      ChargingAlert(gdkmonitor);
      NotificationPopups(gdkmonitor);
    });
  },
});
