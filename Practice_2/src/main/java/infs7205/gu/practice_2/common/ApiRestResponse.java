package infs7205.gu.practice_2.common;

public class ApiRestResponse <T> {
    private Integer status;
    private String message;
    private T data;

    private static final int SUCCESS_STATUS = 200;
    private static final String SUCCESS_MESSAGE = "success";

    public ApiRestResponse(Integer status ,String message) {
        this.message = message;
        this.status = status;
    }


    public ApiRestResponse() {
        this(SUCCESS_STATUS, SUCCESS_MESSAGE);
    }

    public ApiRestResponse(Integer status , String message, T data) {
        this.message = message;
        this.status = status;
        this.data = data;
    }

    public static <T> ApiRestResponse<T> success(){
        return new ApiRestResponse<>();
    }
    public static <T> ApiRestResponse<T> success(T result){
        ApiRestResponse<T> Response= new ApiRestResponse<>();
        Response.setData(result);
        return Response;
    }

    public static <T> ApiRestResponse<T> error(Integer code, String msg) {
        return new ApiRestResponse<>(code, msg);
    }

//    public static <T> ApiRestResponse<T> error(MallExceptionEnum Exception){
//
//
//        return  new ApiRestResponse<>(Exception.getCode(),Exception.getMessage());
//    }

    public Integer getStatus() {
        return status;
    }



    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "ApiRestResponse{" +
                "status=" + status +
                ", message='" + message + '\'' +
                ", data=" + data +
                '}';
    }

}
