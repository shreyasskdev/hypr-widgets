import { App, Astal, Gtk, Gdk } from "astal/gtk4";
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
  const { LEFT } = Astal.WindowAnchor;

  const geometry = gdkmonitor.get_geometry();
  const screenWidth = geometry.width;

  return (
    <window
      visible
      cssClasses={["Bar"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      application={App}
      anchor={LEFT}
      margin={screenWidth * 0.25 - 200}
      // layer={Astal.Layer.BOTTOM}
      onShow={(win) => {
        win.set_layer(Astal.Layer.BOTTOM);
        // win.set_margin(screenWidth * 0.25 - 200);
      }}
    >
      <box
        orientation={Gtk.Orientation.VERTICAL}
        cssClasses={["clock-container"]}
      >
        <box halign={Gtk.Align.CENTER} cssClasses={["clock-time"]}>
          <label label={time()} />
        </box>
        <box halign={Gtk.Align.CENTER} cssClasses={["clock-date"]}>
          <label label={date()} />
        </box>
      </box>
    </window>
  );
}
