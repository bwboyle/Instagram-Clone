import { Response } from "express";
import { errorHandler, errorMap } from "./error.utils";

describe("Error middleware", () => {
  // Create a mock response for the error handler
  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res as Response;
  };

  // Test each error in the error map
  for (const key in errorMap) {
    const statusCode = errorMap[key];
    const res = mockResponse();
    test(`should respond ${statusCode} on ${key} error`, () => {
      errorHandler(res, new Error(key));
      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({ error: key });
    });
  }

  test("should respond with status 500 on unexpected error", () => {
    const res = mockResponse();
    const error = new Error("Unknown error");

    errorHandler(res, error);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error: Error: Unknown error",
    });
  });
});
