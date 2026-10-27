import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useConfig, useEditorPanelConfig } from "@sigmacomputing/plugin";

const DEFAULT_TIME_ZONE = "America/Los_Angeles";
const DEFAULT_TEXT_COLOR = "#222222";
// Share of the plugin box the text may fill, leaving a small margin so glyphs aren't clipped.
const FILL_RATIO = 0.96;
// A late time with wide digits, so the size fits the widest the clock text gets.
const WIDEST_SAMPLE_TIME = new Date(2000, 0, 1, 22, 58, 58);

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

  // Size the text to fill the plugin box: measure the widest time at 100px, then scale.
  const containerRef = useRef(null);
  const measureRef = useRef(null);
  const [fontSizePx, setFontSizePx] = useState(100);
  const widestSampleText = timeFormatter.format(WIDEST_SAMPLE_TIME);

  useLayoutEffect(() => {
    const containerElement = containerRef.current;
    const measureElement = measureRef.current;
    function fitText() {
      const textBox = measureElement.getBoundingClientRect();
      if (!textBox.width || !textBox.height) return;
      const widthScale = (containerElement.clientWidth * FILL_RATIO) / textBox.width;
      const heightScale = (containerElement.clientHeight * FILL_RATIO) / textBox.height;
      setFontSizePx(100 * Math.min(widthScale, heightScale));
    }
    fitText();
    // Refit once the ESBuild font has loaded (it changes the text width) and on every resize.
    document.fonts.ready.then(fitText);
    const resizeObserver = new ResizeObserver(fitText);
    resizeObserver.observe(containerElement);
    window.addEventListener("resize", fitText);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", fitText);
    };
  }, [widestSampleText]);

  return (
    <div ref={containerRef} className="clock" style={{ color: textColor }}>
      <span ref={measureRef} className="clock-measure" aria-hidden="true">
        {widestSampleText}
      </span>
      <span style={{ fontSize: `${fontSizePx}px` }}>{timeFormatter.format(currentTime)}</span>
    </div>
  );
}
