describe("Hello Test", function() {
  it("should recognize true and false", function() {
    expect(!!1).toEqual(true);
    expect(!!0).toEqual(false);
  });
});
