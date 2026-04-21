package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.ConflictException;

public class ProtectedSuperAdminOperationException extends ConflictException {

    public ProtectedSuperAdminOperationException() {
        super(
                "SUPER_ADMIN_PROTECTED",
                "Super admin accounts are protected and cannot be disabled or reassigned"
        );
    }
}
