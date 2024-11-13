package main.security.model;

import java.util.List;

public class RecaptchaResponse {
    private boolean success;
    private List<String> errorCodes;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public List<String> getErrorCodes() {
        return errorCodes;
    }

    public void setErrorCodes(List<String> errorCodes) {
        this.errorCodes = errorCodes;
    }

    @Override
    public String toString() {
        return "RecaptchaResponse{" +
                "success=" + success +
                ", errorCodes=" + errorCodes +
                '}';
    }
}
