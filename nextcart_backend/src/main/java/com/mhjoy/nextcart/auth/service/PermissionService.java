package com.mhjoy.nextcart.auth.service;

import com.mhjoy.nextcart.auth.dto.request.CreateApiPermissionMapRequestDto;
import com.mhjoy.nextcart.auth.dto.request.CreatePermissionRequestDto;
import com.mhjoy.nextcart.auth.dto.request.UpdateApiPermissionMapRequestDto;
import com.mhjoy.nextcart.auth.dto.response.ApiPermissionMapResponseDto;
import com.mhjoy.nextcart.auth.dto.response.PermissionResponseDto;

import java.util.List;

public interface PermissionService {

    PermissionResponseDto createPermission(CreatePermissionRequestDto requestDto);

    List<PermissionResponseDto> listAllPermissions();

    ApiPermissionMapResponseDto createApiPermissionMap(CreateApiPermissionMapRequestDto requestDto);

    List<ApiPermissionMapResponseDto> listApiPermissionMaps();

    ApiPermissionMapResponseDto updateApiPermissionMap(Long id, UpdateApiPermissionMapRequestDto requestDto);

    void deleteApiPermissionMap(Long id);
}
