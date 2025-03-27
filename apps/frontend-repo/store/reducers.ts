import { createReducer } from '@reduxjs/toolkit';
import { fetchUserStart, fetchUserSuccess, fetchUserFailure, deleteUser } from './actions';

// const initialState = { data: null, loading: false, error: null as string | null };
const initialState = {
    data: [] as any[], // ⬅️ Ubah dari null ke array kosong
    loading: false,
    error: null as string | null
};


const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(fetchUserStart, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUserSuccess, (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
        })
        .addCase(fetchUserFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        })
        .addCase(deleteUser, (state, action) => {
            state.data = state.data.filter(user => user.id !== action.payload.id);
        });

});

export default userReducer;
