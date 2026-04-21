package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.BadRequestException;

public class InvalidRoleAssignmentTargetException extends BadRequestException {

    public InvalidRoleAssignmentTargetException() {
        super(
                "INVALID_ROLE_ASSIGNMENT_TARGET",
                "Roles can only be reassigned for admin or staff users"
        );
    }
}
