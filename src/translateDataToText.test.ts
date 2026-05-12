import { describe, it, expect } from "vitest";

type AttemptData = Record<number, string[]>;

// Function to translate form inputs to text format
const translateDataToText = (data: AttemptData) => {
  return Object.values(data)
    .map((attempts) => attempts.join(" "))
    .join("\n");
};

describe("translateDataToText", () => {
  it("should translate form inputs to the correct text format", () => {
    const mockData = {
      1: ["3", "2", "1"],
      2: ["4", "3", "2"],
      3: ["5", "4", "3"],
      4: ["6", "5", "4"],
      5: ["7", "6", "5"],
      6: ["8", "7", "6"],
      7: ["9", "8", "7"],
      8: ["10", "9", "8"],
      9: ["X", "10", "9"],
      10: ["1", "X", "10"],
    };

    const expectedOutput = `3 2 1\n4 3 2\n5 4 3\n6 5 4\n7 6 5\n8 7 6\n9 8 7\n10 9 8\nX 10 9\n1 X 10`;

    const result = translateDataToText(mockData);
    expect(result).toBe(expectedOutput);
  });
});
