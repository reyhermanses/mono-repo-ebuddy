import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../apis/userApi';
import { Button, Typography } from '@mui/material';
import { RootState, AppDispatch } from '../store/store';

const UpdateButton = () => {
    const dispatch = useDispatch<AppDispatch>(); // Pastikan useDispatch memiliki tipe AppDispatch
    const { data, loading, error } = useSelector((state: RootState) => state.user);

    return (
        <div>
            <Button onClick={() => dispatch(fetchUser())} variant="contained">
                Refresh Data
            </Button>
            {/* {loading && <Typography>Loading...</Typography>}
            {error && <Typography color="error">{error}</Typography>} */}
            {/* {data && <Typography>{JSON.stringify(data)}</Typography>} */}
        </div>
    );
};

export default UpdateButton;
