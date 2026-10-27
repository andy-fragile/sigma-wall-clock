import { useEffect, useMemo, useState } from "react";
import { useConfig, useEditorPanelConfig } from "@sigmacomputing/plugin";

const DEFAULT_TIME_ZONE = "America/Los_Angeles";
const DEFAULT_TEXT_COLOR = "#222222";

export default function WallClock() {
  // Options shown in Sigma's editor panel for this plugin element.
  useEditorPanelConfig([
    { name: "timeZone", type: "text", defaultValue: DEFAULT_TIME_ZONE },
    { name: "textColor", type: "text", defaultValue: DEFAULT_TEXT_COLOR },
    { name: "use24Hour", type: "toggle", defaultValue: false },
  ]);
  const pluginConfig = useConfig();

  const timeZone = pluginConfig.timeZone || DEFAULT_TIME_ZONE;
  const textColor = pluginConfig.textColor || DEFAULT_TEXT_COLOR;
  const use24Hour = Boolean(pluginConfig.use24Hour);

  const timeFormatter = useMemo(() => {
    const formatOptions = {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: !use24Hour,
    };
    try {
      return new Intl.DateTimeFormat("en-US", { ...formatOptions, timeZone });
    } catch {
      // An invalid time zone typed into the editor panel falls back to the default.
      return new Intl.DateTimeFormat("en-US", { ...formatOptions, timeZone: DEFAULT_TIME_ZONE });
    }
  }, [timeZone, use24Hour]);

  const [currentTime, setCurrentTime] = useState(() => new Date());
  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="clock" style={{ color: textColor }}>
      {timeFormatter.format(currentTime)}
    </div>
  );
}
