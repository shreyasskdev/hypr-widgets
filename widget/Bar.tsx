import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { Variable } from "astal";
import WorkspacesPanelButton from "./WorkspacesPanelButton";
import Battery from "gi://AstalBattery";
import { bind } from "astal";
import AstalHyprland from "gi://AstalHyprland";

const hour = Variable("").poll(1000, "date +%I");
const minute = Variable("").poll(1000, "date +%M");
const ampm = Variable("").poll(1000, "date +%p");
const date = Variable("").poll(1000, "date '+%A, %d'");

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const hyprland = AstalHyprland.get_default();

  const clockClassNames = Variable.derive(
    [bind(hyprland, "focusedWorkspace"), bind(hyprland, "clients")],
    (fws, _) => {
      const workspace = hyprland.get_workspace(fws.id);
      const occupied = workspace ? workspace.get_clients().length > 0 : false;
      const classes = ["clock-container"];
      if (occupied) classes.push("occupied");
      else classes.push("not-occupied");
      return classes;
    },
  );

  const { TOP, LEFT, BOTTOM } = Astal.WindowAnchor;
  const battery = Battery.get_default();
  const b = bind(battery, "percentage").as((val) => {
    return (val * 100).toFixed(0) + "";
  });
  const batteryFillVariable = b.as((percentStr) => {
    const pct = parseInt(percentStr);
    return `--battery-pct: ${pct}%`;
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
    >
      <centerbox
        orientation={Gtk.Orientation.VERTICAL}
        className="bar-container"
      >
        <box valign={Gtk.Align.START}>
          <WorkspacesPanelButton />
        </box>
        {/* Clock container with reactive classNames */}
        <box
          className={clockClassNames().as((classes) => classes.join(" "))}
          orientation={Gtk.Orientation.VERTICAL}
          heightRequest={100}
          valign={Gtk.Align.CENTER}
          onDestroy={() => clockClassNames.drop()}
        >
          <label label={hour()} className="clock" />
          <label label=":" angle={90} className="clock" />
          <label label={minute()} className="clock" />
        </box>
        <box
          valign={Gtk.Align.END}
          orientation={Gtk.Orientation.VERTICAL}
          className="battery"
          css={batteryFillVariable}
        >
          <label label={b} />
          {/* <label label="" className="battery-icon" /> */}
        </box>
      </centerbox>
    </window>
  );
}
