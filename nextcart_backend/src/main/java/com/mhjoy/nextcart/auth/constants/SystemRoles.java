package com.mhjoy.nextcart.auth.constants;

public final class SystemRoles {

    public static final String SUPER_ADMIN = "SUPER_ADMIN";
    public static final String ADMIN = "ADMIN";
    public static final String CUSTOMER = "CUSTOMER";

    private SystemRoles() {
    }

    public static boolean isReserved(String roleName) {
        return SUPER_ADMIN.equals(roleName) || CUSTOMER.equals(roleName);
    }
}
