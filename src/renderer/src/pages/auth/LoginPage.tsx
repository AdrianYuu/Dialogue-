import InputForm from '@renderer/components/InputForm'
import { FormEvent, useEffect, useState } from 'react'
import Button from '../../components/Button'
import { Link, useNavigate } from 'react-router-dom'
import useUser from '@renderer/contexts/UserContext'
import NotificationComponent from '@renderer/components/notification'
import { INotification, NotificationStatus } from '@renderer/interfaces/NotificationInterface'

const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { login } = useUser();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [notification, setNotification] = useState<INotification | null>(null);

  const handlePostNotification = (status: NotificationStatus, message: string): void => {
    const notification: INotification = {
      status,
      message
    }
    setNotification(notification);
  };

  const isFormEmpty = (): boolean => {
    return email === '' || password === '';
  };

  const validateFormData = (): boolean => {
    if (isFormEmpty()) {
      handlePostNotification(NotificationStatus.FAILED, 'Please fill all the fields.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateFormData())
      return;

    const isLoginSuccess = await login(email, password);
    if (!isLoginSuccess) {
      handlePostNotification(NotificationStatus.FAILED, 'Invalid credentials.');
      return;
    }

    handlePostNotification(NotificationStatus.SUCCESS, 'Login successful.');
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    };

  }, [notification]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-discord">
      <div className="w-[35rem] h-[30rem] bg-gray-700 rounded-3xl">
        <form className="flex flex-col p-[2rem]" onSubmit={handleSubmit}>
          <h1 className="font-semibold text-white text-3xl text-center mt-[2rem] mb-[2rem]">
            Login with your Account
          </h1>
          <div className="flex flex-col gap-4 mb-[7rem]">
            <InputForm
              label="Email"
              type="text"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e)}
            />
            <InputForm
              label="Password"
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e)}
            />
            <div className="flex flex-col gap-5 my-5">
              <Button label="Submit" type="submit" style="w-full btn btn-neutral" />
              <div className="flex gap-1 text-cyan-100 justify-center">
                <p>Need an account? </p>
                <Link to="/auth/register" className="font-bold hover:underline">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>

      <NotificationComponent notification={notification} />
    </div>
  )
}

export default LoginPage
