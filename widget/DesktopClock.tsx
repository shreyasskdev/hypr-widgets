import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { Variable } from "astal";

const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

const dateFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  day: "numeric",
});

const time = Variable("").poll(1000, () => {
  const now = new Date();
  return timeFormat.format(now);
});

const date = Variable("").poll(1000, () => {
  const now = new Date();
  return dateFormat.format(now);
});

export default function DesktopClock(gdkmonitor: Gdk.Monitor) {
  const { LEFT, RIGHT } = Astal.WindowAnchor;

  const geometry = gdkmonitor.get_geometry();
  const screenWidth = geometry.width;

  return (
    <window
      className="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      application={App}
      layer={Astal.Layer.BOTTOM}
      anchor={Astal.WindowAnchor.LEFT}
      margin={screenWidth * 0.25 - 200}
    >
      <box className="clock-container" orientation={Gtk.Orientation.VERTICAL}>
        <box className="clock-time" halign={Gtk.Align.CENTER}>
          {time()}
        </box>
        <box className="clock-date" halign={Gtk.Align.CENTER}>
          {date()}
        </box>
      </box>
    </window>
  );
}
