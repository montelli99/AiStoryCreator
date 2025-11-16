export class DescriptionEngine {
  generate(strength: "soft" | "medium" | "strong", script: string) {
    if (strength === "strong") {
      return `${script}\n\nIf you're reading this, the algorithm chose YOU. Lock in.`
    }
    if (strength === "medium") {
      return `${script}\n\nSomeone needs to hear this today.`
    }
    return `${script}`
  }
}

