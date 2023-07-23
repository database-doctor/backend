import { faker } from "@faker-js/faker";

export const select = <T>(arr: T[], k: number): T[] => {
  const shuffled = arr.slice(0);
  let i = arr.length;
  let temp: T;
  let index: number;

  while (i--) {
    index = faker.number.int({ max: i });
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }

  return shuffled.slice(0, k);
};
