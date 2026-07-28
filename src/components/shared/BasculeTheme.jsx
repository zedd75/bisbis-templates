// Bouton de bascule clair / sombre, affiché dans l'en-tête des sites.
// N'apparaît que si l'administrateur a activé la fonctionnalité pour ce
// restaurant (config.sections.theme).
import { modeOppose } from "../../utils/theme.js";

export default function BasculeTheme({ config, mode, onChanger }) {
  if (!config.sections?.theme) return null;

  const vise = modeOppose(mode);
  return (
    <button
      type="button"
      className="bascule-theme"
      onClick={() => onChanger(vise)}
      aria-label={vise === "sombre" ? "Passer en mode sombre" : "Passer en mode clair"}
      title={vise === "sombre" ? "Mode sombre" : "Mode clair"}
    >
      {vise === "sombre" ? "🌙" : "☀️"}
    </button>
  );
}
