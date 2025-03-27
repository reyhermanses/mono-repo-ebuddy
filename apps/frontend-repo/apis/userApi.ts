import { fetchUserStart, fetchUserSuccess, fetchUserFailure } from '../store/actions';
import { AppDispatch } from '../store/store';

export const fetchUser = () => async (dispatch: AppDispatch) => {
  dispatch(fetchUserStart());
  try {
    // const response = await fetch('/api/user');
    const token = localStorage.getItem('jwt');
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJzOVBPa01ncTMxbERFNHZ5VjJZdyIsImVtYWlsIjoicmV5LnVuZG90QGdtYWlsLmNvbSIsIm5hbWUiOiJSZXkgSGVybWFuc2VzIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNzAxNjQwLCJleHAiOjE3NDI3MDUyNDB9.cfPYqa57avA04UPNm4fr7M1y4Z_YhR39rHfAC48Jzb0';
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/fetch-user-data`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Kalau JWT expired atau invalid, hapus token dan lempar error
      if (response.status === 403) {
        localStorage.removeItem("jwt"); // Hapus token
        window.location.href = "/"; // Redirect ke login
        throw new Error("Session expired. Please log in again.");
      }

      throw new Error(errorData.message || "Failed to fetch user data.");
    }

    const data = await response.json();
    dispatch(fetchUserSuccess({ data }));

  } catch (error: any) {
    dispatch(fetchUserFailure({ error: error.toString() })); // <-- Sesuai dengan tipe action
  }
};

export const deleteUser = ({ id }: { id: string }) => async (dispatch: AppDispatch) => {
  try {
    // const response = await fetch('/api/user');
    const token = localStorage.getItem('jwt');
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJzOVBPa01ncTMxbERFNHZ5VjJZdyIsImVtYWlsIjoicmV5LnVuZG90QGdtYWlsLmNvbSIsIm5hbWUiOiJSZXkgSGVybWFuc2VzIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNzAxNjQwLCJleHAiOjE3NDI3MDUyNDB9.cfPYqa57avA04UPNm4fr7M1y4Z_YhR39rHfAC48Jzb0';
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/delete-user-data/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Kalau JWT expired atau invalid, hapus token dan lempar error
      if (response.status === 403) {
        localStorage.removeItem("jwt"); // Hapus token
        window.location.href = "/"; // Redirect ke login
        throw new Error("Session expired. Please log in again.");
      }

      throw new Error(errorData.message || "Failed to fetch user data.");
    }
    
  } catch (error: any) {
    dispatch(fetchUserFailure({ error: error.toString() })); // <-- Sesuai dengan tipe action
  }
}
