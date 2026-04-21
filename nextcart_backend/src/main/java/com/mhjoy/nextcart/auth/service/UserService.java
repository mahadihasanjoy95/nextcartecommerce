package com.mhjoy.nextcart.auth.service;

import com.mhjoy.nextcart.auth.dto.request.AssignUserRoleRequestDto;
import com.mhjoy.nextcart.auth.dto.request.CreateAdminRequestDto;
import com.mhjoy.nextcart.auth.dto.response.UserResponseDto;
import com.mhjoy.nextcart.common.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface UserService {

    UserResponseDto createAdmin(CreateAdminRequestDto requestDto);

    PageResponse<UserResponseDto> listUsers(Pageable pageable);

    PageResponse<UserResponseDto> listAdminUsers(Pageable pageable);

    PageResponse<UserResponseDto> listCustomerUsers(Pageable pageable);

    UserResponseDto getUserById(Long userId);

    UserResponseDto assignRole(Long userId, AssignUserRoleRequestDto requestDto);

    UserResponseDto enableUser(Long userId);

    UserResponseDto disableUser(Long userId);

    void deleteUser(Long userId);
}
