import { TTEntry, TranspositionTable } from "../src/mem/TranspositionTable";
import { expect } from "chai";
import "mocha";

describe("TranspositionTable", function() {
  it("Reads back a written node", function() {
    const mockHash = 921090;
    const mockValue = 50;
    const mockTable = new TranspositionTable({
      nodeLimit: 30
    });

    (mockTable.hit(mockHash, true) as TTEntry).feed(mockHash, mockValue, 0);

    expect(mockTable.hit(mockHash)).to.equal(mockValue);
  });

  describe("TTEntry", function() {
    it("Rejects feed for a less valuable entry", function() {
      const mockEntry = new TTEntry();

      mockEntry.feed(1, 1, 0);
      mockEntry.feed(2, 2, 1); // depth 1 is less valuable

      expect(mockEntry.value).to.equal(1);
    });
  });
});
