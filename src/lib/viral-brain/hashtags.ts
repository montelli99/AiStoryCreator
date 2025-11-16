export class HashtagEngine {
  async generate(category: string) {
    const base = {
      stoicism: [
        "#stoic",
        "#stoicism",
        "#selfdiscipline",
        "#selfmastery",
        "#mentalclarity",
        "#viralmindset",
      ],
      discipline: [
        "#discipline",
        "#focus",
        "#motivationdaily",
        "#hardworkwins",
        "#mindsetcoach",
      ],
      quotes: [
        "#quotesdaily",
        "#motivationalquotes",
        "#viralquotes",
        "#deepquotes",
      ],
    }

    const tags = base[category] ?? base["stoicism"]

    return {
      tags,
      top5: tags.slice(0, 5),
      score: Math.floor(Math.random() * 40) + 60,
    }
  }
}

