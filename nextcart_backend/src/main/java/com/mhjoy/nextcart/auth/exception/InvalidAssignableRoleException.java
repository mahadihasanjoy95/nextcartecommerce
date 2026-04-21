package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.BadRequestException;

public class InvalidAssignableRoleException extends BadRequestException {

    public InvalidAssignableRoleException(String role) {
        super(
                "INVALID_ASSIGNABLE_ROLE",
                "Role '%s' cannot be assigned from user management".formatted(role)
        );
    }
}
