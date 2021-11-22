import GD from "../js/GridData";

test("check parse when valid string", () => {
  expect(Array.isArray(GD.parse("1 2 \n 3 4")));
});

test("check neighbours", () => {
  const gridData = GD.parse("1 2 3\n 4 5 6 \n 7 8 9");
  let neighbours = gridData.getNeighbours({ x: 0, y: 0 });
  expect(neighbours[0]).toEqual({ x: 1, y: 0 });
  expect(neighbours[1]).toEqual({ x: 0, y: 1 });

  neighbours = gridData.getNeighbours({ x: 1, y: 1 });
  expect(neighbours[0]).toEqual({ x: 2, y: 1 });
  expect(neighbours[1]).toEqual({ x: 0, y: 1 });
  expect(neighbours[2]).toEqual({ x: 1, y: 2 });
  expect(neighbours[3]).toEqual({ x: 1, y: 0 });

  neighbours = GD.parse("1 2 3\n 4 5 6 \n 7 x 9", "X").getNeighbours({
    x: 2,
    y: 2,
  });
  expect(neighbours[0]).toEqual({ x: 1, y: 2 });
});

test("check error when invalid string", () => {
  expect(() => GD.parse("12 \n 3 4")).toThrowError(
    "Invalid length, should be 1"
  );
});

test("check error when invalid object", () => {
  expect(() => GD.parse("1 2 \n 3 4").addRow({})).toThrowError(
    "Invalid object, should be an Array"
  );
});

test("check error when not string", () => {
  expect(() => GD.parse([])).toThrowError("Data must be of type string");
});
