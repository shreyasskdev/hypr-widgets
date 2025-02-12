import { Gtk } from "astal/gtk3";
import AstalHyprland from "gi://AstalHyprland";
// import { range } from "../../utils";
import { bind } from "astal";
import { Variable } from "astal";
import { ButtonProps } from "astal/gtk3/widget";

type WsButtonProps = ButtonProps & {
  ws: AstalHyprland.Workspace;
};

function WorkspaceButton({ ws, ...props }: WsButtonProps) {
  const hyprland = AstalHyprland.get_default();
  const classNames = Variable.derive(
    [bind(hyprland, "focusedWorkspace"), bind(hyprland, "clients")],
    (fws, _) => {
      const classes = ["workspace-button"];

      const active = fws.id == ws.id;
      active && classes.push("active");

      const occupied = hyprland.get_workspace(ws.id)?.get_clients().length > 0;
      occupied && classes.push("occupied");
      return classes;
    },
  );

  return (
    <button
      className={classNames().as((classes) => classes.join(" "))}
      onDestroy={() => classNames.drop()}
      onClicked={() => ws.focus()}
      width_request={2}
      height_request={2}
      {...props}
    />
  );
}

export default function WorkspacesPanelButton() {
  return (
    <box
      className="workspace-container"
      halign={Gtk.Align.CENTER}
      hexpand={true}
      orientation={Gtk.Orientation.VERTICAL}
    >
      {range(6).map((i) => (
        <WorkspaceButton ws={AstalHyprland.Workspace.dummy(i + 1, null)} />
      ))}
    </box>
  );
}
function range(max: number) {
  return Array.from({ length: max + 1 }, (_, i) => i);
}
