import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { Variable } from "astal";
import WorkspacesPanelButton from "./WorkspacesPanelButton";
import Battery from "gi://AstalBattery";
import { bind } from "astal";

// const time = Variable("").poll(1000, "date");
const hour = Variable("").poll(1000, "date +%I");
const minute = Variable("").poll(1000, "date +%M");
const ampm = Variable("").poll(1000, "date +%p");
const date = Variable("").poll(1000, "date '+%A, %d'");

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, BOTTOM } = Astal.WindowAnchor;
  const battery = Battery.get_default();
  const b = bind(battery, "percentage").as((val) => {
    return (val * 100).toFixed(0) + "%";
  });
  return (
    <window
      className="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | BOTTOM}
      application={App}
      width_request={10}
      height_request={10}
      widthRequest={10}
      heightRequest={10}
      // layer={Astal.Layer.BOTTOM}
    >
      <centerbox
        orientation={Gtk.Orientation.VERTICAL}
        className="bar-container"
      >
        <box valign={Gtk.Align.START}>
          <WorkspacesPanelButton />
        </box>
        <box
          orientation={Gtk.Orientation.VERTICAL}
          heightRequest={100}
          valign={Gtk.Align.CENTER}
        >
          <label label={hour()} />
          <label label=":" angle={90} />
          <label label={minute()} />
        </box>
        <box valign={Gtk.Align.END}>
          <label label={b} />
        </box>
      </centerbox>
    </window>
  );
}
