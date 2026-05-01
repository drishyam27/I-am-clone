export const affirmationsData = [
  { id: '1', text: "I am capable of achieving great things.", category: "Success" },
  { id: '2', text: "I choose to be happy and grateful today.", category: "Growth" },
  { id: '3', text: "My mind is clear, focused, and energized.", category: "Success" },
  { id: '4', text: "I release all tension from my body and mind.", category: "Anxiety" },
  { id: '5', text: "I am resilient and can get through any challenge.", category: "Growth" },
  { id: '6', text: "Every day, I am becoming a better version of myself.", category: "Growth" },
  { id: '7', text: "I am worthy of all the good things that happen to me.", category: "Growth" },
  { id: '8', text: "I nourish my body with healthy choices.", category: "Health" },
  { id: '9', text: "My potential to succeed is infinite.", category: "Success" },
  { id: '10', text: "I breathe in peace and breathe out worry.", category: "Anxiety" },
  { id: '11', text: "I am strong, energetic, and full of vitality.", category: "Health" },
  { id: '12', text: "I trust the process of life.", category: "Anxiety" },
  { id: '13', text: "Opportunities flow to me effortlessly.", category: "Success" },
  { id: '14', text: "I am in tune with my body's needs.", category: "Health" },
  { id: '15', text: "I forgive myself for past mistakes and move forward.", category: "Growth" }
];

export const getAllAffirmations = () => {
  return affirmationsData;
};

export const getAffirmationsByCategory = (category) => {
  return affirmationsData.filter(item => item.category === category);
};

export const getRandomAffirmations = (count = 5) => {
  const shuffled = [...affirmationsData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default affirmationsData;
