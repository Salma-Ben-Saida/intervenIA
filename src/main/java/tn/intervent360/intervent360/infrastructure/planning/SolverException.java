package tn.intervent360.intervent360.infrastructure.planning;

public class SolverException extends RuntimeException {
    public SolverException(String message) {
        super(message);
    }

    public SolverException(String message, Throwable cause) {
        super(message, cause);
    }
}
