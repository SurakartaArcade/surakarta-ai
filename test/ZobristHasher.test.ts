import { Surakarta } from "surakarta";
import { initZobrist, hash } from "../src/mem/ZobristHasher";
import { expect } from "chai";
import "mocha";
import "./globalPerformance";

describe("ZobristHasher", function() {
  initZobrist();

  it("Hash values should be consistent", function() {
    const surakarta = new Surakarta();

    const h1 = hash(surakarta);
    const h2 = hash(surakarta);

    expect(h1).to.equal(h2);
  });
});
