export class VariantEngine {
  generate(baseScript: string) {
    return [
      { type: "fast_cut", script: baseScript.replace(".", "!") },
      { type: "slow_moody", script: baseScript + "..." },
      { type: "cinematic", script: baseScript.toUpperCase() },
      { type: "zoom_pulse", script: baseScript },
      { type: "text_overlay", script: `[text] ${baseScript}` },
      { type: "deep_voice", script: `Deep voice: ${baseScript}` },
      { type: "motivational", script: baseScript.replace(" ", "🔥 ") },
      { type: "alpha_male", script: `Listen. ${baseScript}` },
      { type: "high_energy", script: baseScript + " LET'S GO!" },
    ]
  }
}

