package tn.intervenIA.intervenIA.infrastructure.planning;

public class SolverException extends RuntimeException {
    public SolverException(String message) {
        super(message);
    }

    public SolverException(String message, Throwable cause) {
        super(message, cause);
    }
}
