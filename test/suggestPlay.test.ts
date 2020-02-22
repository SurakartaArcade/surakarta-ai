import { Surakarta, Move } from "surakarta";
import { suggestPlay, play } from "../src";
import { expect } from "chai";
import "mocha";

describe("suggestPlay()", function() {
  const mockSurakarta = new Surakarta();

  it("Executes without throwing an errors", function() {
    const mockResult = suggestPlay(mockSurakarta);
    expect(mockResult).to.not.equal(null);
  });

  it("play() runs", function() {
    play(mockSurakarta).then(result => {
      expect(result.srcRow).to.be.a("number");
    });
  });
});
