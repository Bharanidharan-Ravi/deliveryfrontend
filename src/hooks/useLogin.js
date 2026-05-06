import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import { PATHS } from '../core/routing/paths';

export function useLogin() {
  const navigate = useNavigate();

  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: authService.login,

    onSuccess: ({ token, user }) => {
      login(token, user);

     navigate(PATHS.DELIVERY);
    },
  });
}