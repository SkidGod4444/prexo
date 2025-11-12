const avatarUrls = [
  "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Aiden",
  "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Oliver",
  "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Sarah",
  "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Alexander",
  "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Amaya",
  "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Luis",
  "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Leo",
  "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Destiny",
  "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Ryker",
  "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Jessica",
  "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Christopher",

  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Aiden",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Oliver",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Sarah",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Alexander",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Amaya",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Luis",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Leo",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Destiny",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Ryker",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Jessica",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Christopher",
];

export function getRandomAvatarUrl() {
  const idx = Math.floor(Math.random() * avatarUrls.length);
  return avatarUrls[idx];
}
