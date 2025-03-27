import { createAction } from '@reduxjs/toolkit';

export const fetchUserStart = createAction('user/fetchStart');
export const fetchUserSuccess = createAction<{ data: any }>('user/fetchSuccess');
export const fetchUserFailure = createAction<{ error: string }>('user/fetchFailure');
export const deleteUser = createAction<{ id: string }>("user/deleteUser");