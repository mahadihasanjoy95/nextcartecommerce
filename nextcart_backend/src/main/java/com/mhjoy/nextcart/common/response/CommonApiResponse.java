package com.mhjoy.nextcart.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.slf4j.MDC;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CommonApiResponse<T>(
        boolean success,
        String message,
        T data,
        ErrorDetail error,
        Meta meta
) {

    public record Meta(String requestId) {
        public static Meta current() {
            return new Meta(MDC.get("requestId"));
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record ErrorDetail(String code, String message, Object details) {}

    public static <T> CommonApiResponse<T> success(T data) {
        return new CommonApiResponse<>(true, null, data, null, Meta.current());
    }

    public static <T> CommonApiResponse<T> success(String message, T data) {
        return new CommonApiResponse<>(true, message, data, null, Meta.current());
    }

    public static CommonApiResponse<Void> success(String message) {
        return new CommonApiResponse<>(true, message, null, null, Meta.current());
    }

    public static <T> CommonApiResponse<T> error(String code, String message) {
        return new CommonApiResponse<>(false, null, null, new ErrorDetail(code, message, null), Meta.current());
    }

    public static <T> CommonApiResponse<T> error(String code, String message, Object details) {
        return new CommonApiResponse<>(false, null, null, new ErrorDetail(code, message, details), Meta.current());
    }
}
