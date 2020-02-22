import { Surakarta } from "surakarta";
import { suggestPlay } from "../src";
import { expect } from "chai";
import "mocha";

describe("suggestPlay()", function() {
  const mockSurakarta = new Surakarta();

  it("Executes without throwing an errors", function() {
    expect(suggestPlay(mockSurakarta)).to.not.equal(null);
  });
});
