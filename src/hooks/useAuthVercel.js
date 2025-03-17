import { useQuery, useMutation, useQueryClient } from 'react-query';
import { authService } from '../services/auth';

export function useAuth() {
  const queryClient = useQueryClient();

  const registerMutation = useMutation(
    ({ email, password }) => authService.register(email, password),
    {
      onSuccess: (data) => {
        authService.setToken(data.token);
        queryClient.setQueryData('user', data.user);
      },
    }
  );

  const loginMutation = useMutation(
    ({ email, password }) => authService.login(email, password),
    {
      onSuccess: (data) => {
        authService.setToken(data.token);
        queryClient.setQueryData('user', data.user);
      },
    }
  );

  const logout = () => {
    authService.logout();
    queryClient.setQueryData('user', null);
  };

  return {
    register: registerMutation.mutate,
    login: loginMutation.mutate,
    logout,
    isLoading: registerMutation.isLoading || loginMutation.isLoading,
    error: registerMutation.error || loginMutation.error,
  };
}