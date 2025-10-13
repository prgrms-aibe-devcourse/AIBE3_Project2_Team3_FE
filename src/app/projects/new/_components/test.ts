export const sample = [
  {
    id: 1,
    name: "개발",
    children: [
      { id: 11, name: "웹 개발" },
      { id: 12, name: "모바일 앱 개발" },
      { id: 13, name: "백엔드 개발" },
      { id: 14, name: "AI/머신러닝" },
    ],
  },
  {
    id: 2,
    name: "디자인",
    children: [
      { id: 21, name: "UX" },
      { id: 22, name: "UI" },
    ],
  },
  { id: 3, name: "마케팅", children: [{ id: 31, name: "콘텐츠" }] },
  { id: 4, name: "글쓰기" }, // 자식 없는 1뎁스(leaf)
];
