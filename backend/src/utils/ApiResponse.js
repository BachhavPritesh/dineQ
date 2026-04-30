class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static send(res, statusCode, message, data = null) {
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, message, data));
  }

  static success(res, message, data = null) {
    return ApiResponse.send(res, 200, message, data);
  }

  static created(res, message, data) {
    return ApiResponse.send(res, 201, message, data);
  }

  static noContent(res) {
    return res.status(204).json({
      success: true,
      statusCode: 204,
      message: 'No content',
      data: null,
    });
  }
}

export default ApiResponse;
